using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CommandLine;
using CommandLine.Text;
using Newtonsoft.Json;

namespace GenerateRivalryRatios {
	public class Program {
		#region Methods

		public void Main(string[] args) {
			var sets = new string[] {
				@"-i G:\Projects\TheBlackMarket\Data\Json\VictimStatsC   -o G:\Projects\TheBlackMarket\Data\Json\RivalriesG",
				@"-i G:\Projects\TheBlackMarket\Data\Json\VictimStatsRC  -o G:\Projects\TheBlackMarket\Data\Json\RivalriesR",
				@"-i G:\Projects\TheBlackMarket\Data\Json\VictimStatsRTC -o G:\Projects\TheBlackMarket\Data\Json\RivalriesRT",
				@"-i G:\Projects\TheBlackMarket\Data\Json\VictimStatsTC  -o G:\Projects\TheBlackMarket\Data\Json\RivalriesT",
			};

			foreach (var set in sets) {
				var setArgs = set.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

				try {
					Batch(setArgs);
				} catch (Exception e) {
					Console.WriteLine("Failed to process {0}:\n\n{1}\n", args[3], e);
				}
			}
		}

		public void Batch(string[] args) {
			var parserResults = Parser.Default.ParseArguments<Options>(args);

			if (parserResults.Tag == ParserResultType.NotParsed) {
				Console.WriteLine(
					new HelpText { AddDashesToOption = true }
						.AddPreOptionsLine("GenerateRivalryRatios")
						.AddPreOptionsLine("")
						.AddOptions(parserResults).ToString());

				return;
			}

			var options = (parserResults as Parsed<Options>).Value;

			var files = Directory.GetFiles(options.InputDirectory, options.FileFilter);

			// Generate groups of files by combinging all the files with
			// diffferent champion suffixes.
			var fileGroups =
				from file in files
				let filename = Path.GetFileName(file)
				let cIndex = filename.LastIndexOf('c')
				where cIndex != -1
				let groupId = filename.Substring(0, cIndex)
				group file by groupId into generatedFileGroups
				select generatedFileGroups;

			Console.WriteLine("Processing {0}", options.InputDirectory);

			if (!Directory.Exists(options.OutputDirectory)) {
				Directory.CreateDirectory(options.OutputDirectory);
			}

			foreach (var fileGroup in fileGroups) {
				Console.WriteLine("  {0}", fileGroup.Key);
				ProcessFileGroup(options.OutputDirectory, fileGroup.Key, fileGroup);
			}

			Console.WriteLine();
		}

		private void ProcessFileGroup(string outputDirectory, string groupId, IEnumerable<string> files) {
			// Convert all the individual champion files into a dictionary that
			// maps a champion to a lookup of who they killed to how many times.
			//
			// champion => victim => kills
			var victimData =
				(from file in files
				 let json = File.ReadAllText(file)
				 let individualVictimData = JsonConvert.DeserializeObject<VictimData>(json)
				 // Skip minions
				 where individualVictimData.Id.ChampionId > 0
				 select new {
					 ChampionId = individualVictimData.Id.ChampionId,
					 VictimLookup = Enumerable.Zip(
						 individualVictimData.Victims,
						 individualVictimData.Kills,
						 (v, k) => new {
							Victim = v,
							Kills = k
						 }).Where(e => e.Victim != 0).ToDictionary(e => e.Victim, e => e.Kills)
				 }).ToDictionary(e => e.ChampionId, e => e.VictimLookup);

			// All champion ids.
			var champions = victimData.Keys.Union(victimData.SelectMany(vd => vd.Value.Keys)).Distinct().OrderBy(e => e).ToList();
			var championCount = champions.Count;

			// Calculate the champion kills over their targets kills on them.
			var killRatios =
				from champion in champions
				let championKills = victimData.ContainsKey(champion) ? victimData[champion] : null
				select
					(championKills == null)
						// If a champion can't be found, fill their array with -1 for current champ
						// always loses.
						? Enumerable.Repeat(-1.0f, champions.Count)
						: (
							from targetChampion in champions
							let killCount = championKills.ContainsKey(targetChampion) ? championKills[targetChampion] : 0.0f
							let deathCount = (victimData.ContainsKey(targetChampion) && victimData[targetChampion].ContainsKey(champion)) ? victimData[targetChampion][champion] : 0.0f
							select (deathCount == 0) ? -2 : (killCount == 0) ? -1 : killCount / deathCount
						).ToList();

			var killRatiosList = killRatios.ToList();

			var killRatioCounts = killRatiosList.Select(krl => krl.Count());
			var mismatches = killRatioCounts.Where(c => c != championCount).Count();

			if (mismatches > 0) {
				throw new Exception(string.Format("{0} champions have mismatched kill ratios data array lengths."));
			}

			var processedKillRatios = new {
				championIds = champions,
				killRatios = killRatiosList
			};

			var outputId = string.IsNullOrWhiteSpace(groupId) ? "global" : groupId;

			var jsonConverters = new JsonConverter[] { new FloatConverter() };
			var outputJson = JsonConvert.SerializeObject(processedKillRatios, jsonConverters);
			var outputPath = Path.Combine(outputDirectory, outputId) + ".json";
			File.WriteAllText(outputPath, outputJson);
		}

		#endregion

		#region FloatConverter Class

		private class FloatConverter : JsonConverter {
			public int Precission {
				get;
				set;
			} = 2;

			public override bool CanConvert(Type objectType) {
				return (typeof(float) == objectType) || (typeof(double) == objectType);
			}

			public override object ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
				throw new NotImplementedException();
			}

			public override void WriteJson(Newtonsoft.Json.JsonWriter writer, object value, JsonSerializer serializer) {
				if (value.GetType() == typeof(float)) {
					var roundedValue = Math.Round((float) value, Precission);
					var intValue = (int) roundedValue;

					if (intValue == roundedValue) {
						writer.WriteRawValue(intValue.ToString());
					} else {
						writer.WriteValue(roundedValue);
					}

					return;
				}

				if (value.GetType() == typeof(double)) {
					var roundedValue = Math.Round((double) value, Precission);
					var longValue = (long) roundedValue;

					if (longValue == roundedValue) {
						writer.WriteRawValue(longValue.ToString());
					} else {
						writer.WriteValue(roundedValue);
					}

					return;
				}
			}
		}

		#endregion

	}
}
