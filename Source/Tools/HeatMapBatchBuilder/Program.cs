using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using CommandLine;
using CommandLine.Text;

namespace HeatMapBatchBuilder {
	public class Program {
		private static readonly Regex teamRegex = new Regex(@"t(\d\d\d)");

		public static void Main(string[] args) {
			var parserResults = Parser.Default.ParseArguments<Options>(args);

			if (parserResults.Tag == ParserResultType.NotParsed) {
				Console.WriteLine(
					new HelpText { AddDashesToOption = true }
						.AddPreOptionsLine("HeatMapBatchBuilder")
						.AddPreOptionsLine("")
						.AddOptions(parserResults).ToString());

				return;
			}

			var options = (parserResults as Parsed<Options>).Value;

			bool hasArgumentErrors = false;
			Image mapImage = null;

			try {
				mapImage = Bitmap.FromFile(options.Map);
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to load map image \"{0}\":\n\n{1}\n\n", options.Map, e);
				hasArgumentErrors = true;
			}

			if (hasArgumentErrors) {
				return;
			}

			var mapOrigin = new Point(0, mapImage.Height);
			var mapSize = new Size(mapImage.Width, -mapImage.Height);

			var dataFiles = Directory.GetFiles(options.InputDirectory, options.InputFilter);

			if (!options.MergeTeamData) {
				foreach (var dataFile in dataFiles) {
					ProcessData(dataFile, options, ref mapOrigin, ref mapSize);
				}
			} else {
				var pairedData =
					from dataFile in dataFiles
					let teamAgnosticFilename = teamRegex.Replace(Path.GetFileNameWithoutExtension(dataFile), "")
					group dataFile by teamAgnosticFilename;

				foreach (var grouping in pairedData) {
					var count = grouping.Count();

					switch (count) {
						case 1:
							ProcessData(grouping.First(), options, ref mapOrigin, ref mapSize);
							break;

						case 2:
							var firstFile = grouping.First();
							var secondFile = grouping.Last();

							if (firstFile.Contains("t200")) {
								var temp = firstFile;
								secondFile = firstFile;
								firstFile = temp;
							}

							ProcessTeamData(firstFile, secondFile, options, ref mapOrigin, ref mapSize);
							break;
					}
				}
			}
		}

		private static void ProcessData(string dataFile, Options options, ref Point mapOrigin, ref Size mapSize) {
			var spriteFile = options.NuetralTeamSprite;
			var match = teamRegex.Match(dataFile);

			if (match.Success) {
				var teamNumber = int.Parse(match.Groups[1].Value);

				switch (teamNumber) {
					case 100:
						spriteFile = options.BlueTeamSprite;
						break;

					case 200:
						spriteFile = options.RedTeamSprite;
						break;
				}
			}

			var outputFile = Path.Combine(options.OutputDirectory, Path.GetFileName(dataFile));
			outputFile = Path.ChangeExtension(outputFile, (options.GenerateCompositeImage ? "png" : "mp4"));

			if (!options.Force && File.Exists(outputFile)) {
				return;
			}

			var argsBuilder = new StringBuilder();
			argsBuilder.AppendFormat("-b \"{0}\" ", options.Map);
			argsBuilder.AppendFormat("-i \"{0}\" ", dataFile);
			argsBuilder.AppendFormat("-o \"{0}\" ", outputFile);
			argsBuilder.AppendFormat("-s \"{0}\" ", spriteFile);

			if (options.BitRate > 0) {
				argsBuilder.AppendFormat("--bit-rate {0} ", options.BitRate);
			}

			if (options.HasResidualImage) {
				argsBuilder.AppendFormat("--residual-sprite \"{0}\" ", options.ResidualSprite);
			}

			if (options.GenerateCompositeImage) {
				argsBuilder.AppendFormat("--generate-composite-image --composite-image-factor {0} ", options.CompositeImageFactor);

			}

			argsBuilder.AppendFormat("--map-origin {0},{1} ", mapOrigin.X, mapOrigin.Y);
			argsBuilder.AppendFormat("--map-size {0},{1} ", mapSize.Width, mapSize.Height);

			argsBuilder.Append("--data-origin 0,0 --data-size 14820,14881");

			Console.WriteLine("Building {0}...", dataFile);

			RunHeatMapVideoBuilder(options, argsBuilder.ToString());
		}

		private static void ProcessTeamData(string blueDataFile, string redDataFile, Options options, ref Point mapOrigin, ref Size mapSize) {
			var spriteFile = options.NuetralTeamSprite;

			// Strip the team out of the filename.
			var outputFileName = teamRegex.Replace(blueDataFile, "");

			var outputFile = Path.Combine(options.OutputDirectory, Path.GetFileName(outputFileName));
			outputFile = Path.ChangeExtension(outputFile, (options.GenerateCompositeImage ? "png" : "mp4"));

			if (!options.Force && File.Exists(outputFile)) {
				return;
			}

			var argsBuilder = new StringBuilder();
			argsBuilder.AppendFormat("-b \"{0}\" ", options.Map);
			argsBuilder.AppendFormat("-i \"{0}\",\"{1}\" ", blueDataFile, redDataFile);
			argsBuilder.AppendFormat("-o \"{0}\" ", outputFile);

			if (options.BitRate > 0) {
				argsBuilder.AppendFormat("--bit-rate {0} ", options.BitRate);
			}

			if (options.ForceNuetralSprite) {
				argsBuilder.AppendFormat("-s \"{0}\",\"{1}\" ", options.NuetralTeamSprite, options.NuetralTeamSprite);
			} else {
				argsBuilder.AppendFormat("-s \"{0}\",\"{1}\" ", options.BlueTeamSprite, options.RedTeamSprite);
			}

			if (options.HasResidualImage) {
				argsBuilder.AppendFormat("--residual-sprite \"{0}\" ", options.ResidualSprite);
			}

			if (options.GenerateCompositeImage) {
				argsBuilder.AppendFormat("--generate-composite-image --composite-image-factor {0} ", options.CompositeImageFactor);
			}

			argsBuilder.AppendFormat("--map-origin {0},{1} ", mapOrigin.X, mapOrigin.Y);
			argsBuilder.AppendFormat("--map-size {0},{1} ", mapSize.Width, mapSize.Height);

			argsBuilder.Append("--data-origin 0,0 --data-size 14820,14881");

			Console.WriteLine("Building team data...\n\t{0}\n\t{1}", blueDataFile, redDataFile);

			RunHeatMapVideoBuilder(options, argsBuilder.ToString());
		}

		private static void RunHeatMapVideoBuilder(Options options, string arguments) {
			var processStartInfo = new ProcessStartInfo();
			processStartInfo.FileName = options.HeatMapVideoBuilderPath;
			processStartInfo.Arguments = arguments;
			processStartInfo.CreateNoWindow = true;
			processStartInfo.UseShellExecute = false;

			//Console.WriteLine("  {0}", processStartInfo.Arguments);

			var process = Process.Start(processStartInfo);
			process.WaitForExit();
		}
	}
}
