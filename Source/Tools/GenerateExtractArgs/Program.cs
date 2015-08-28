using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using CommandLine;
using CommandLine.Text;

namespace GenerateExtractArgs {
	/// <summary>
	///		This is a utility program that scans script files used to aggreate data
	///		from the match history data and generates the command line arguments
	///		needed to run the MongoExtract utility to export the data.
	/// 
	///		It's based off the suffix of the collections to detect the permutation
	///		of fields used for groupings and then reads those id fields to generate
	///		unique on disk filenames.
	/// </summary>
	public class Program {
		#region Members

		/// <summary>
		///		These are the fields used in the _ids of the documents being exports.
		///		This lookup provides information for reading the _id value and creating
		///		the filenames on disk.
		/// </summary>
		private static Dictionary<char, SuffixInfo> suffixes = new Dictionary<char, SuffixInfo>() {
			{ 'C', new SuffixInfo("_id.championId", "c") },
			{ 'G', new SuffixInfo("_id.global", "") },
			{ 'I', new SuffixInfo("_id.itemId", "i") },
			{ 'R', new SuffixInfo("_id.region", "r") },
			{ 'T', new SuffixInfo("_id.teamId", "t") },
		};

		#endregion

		#region Methods

		public void Main(string[] args) {
			var parserResults = Parser.Default.ParseArguments<Options>(args);

			if (parserResults.Tag == ParserResultType.NotParsed) {
				Console.WriteLine(
					new HelpText { AddDashesToOption = true }
						.AddPreOptionsLine("MongoExtract")
						.AddPreOptionsLine("")
						.AddOptions(parserResults).ToString());

				return;
			}

			var options = (parserResults as Parsed<Options>).Value;
			var filter = string.IsNullOrWhiteSpace(options.Filter) ? "*.js" : options.Filter;
			var baseOutputDirectory = string.IsNullOrWhiteSpace(options.BaseOutputDirectory) ? "." : options.BaseOutputDirectory;

			var suffixValues = string.Join("", suffixes.Keys);
			var suffixRegexString = string.Format("([{0}]+)$", suffixValues);
			var suffixRegex = new Regex(suffixRegexString);

			foreach (var scriptFile in FindMatchingScripts(options.ScriptPath, filter, options.Recurse)) {
				var scriptFilename = Path.GetFileNameWithoutExtension(scriptFile);
				var matchResult = suffixRegex.Match(scriptFilename);

				if (!matchResult.Success) {
					Console.Error.WriteLine("Script file\"{0}\" does not have a suffix. Unable to infer IdPath and IdFormat.", scriptFile);
					return;
				}

				var suffix = matchResult.Captures[0].Value;
				var current = 0;
				var idAccessorBuilder = new StringBuilder();
				var idFormatBuilder = new StringBuilder();
				var firstSuffix = true;

				foreach (var suffixChar in suffix) {
					SuffixInfo suffixInfo = null;

					if (!suffixes.TryGetValue(suffixChar, out suffixInfo)) {
						Console.Error.WriteLine("Script file\"{0}\" has an unrecognized suffix character '{1}'.", scriptFile, suffixChar);
					}

					if (firstSuffix) {
						firstSuffix = false;
					} else {
						idAccessorBuilder.Append(",");
					}

					idAccessorBuilder.AppendFormat(suffixInfo.IdPath);
					idFormatBuilder.AppendFormat("{0}{{{1}}}", suffixInfo.FormatPrefix, current);

					++current;
				}

				var idAccessorr = idAccessorBuilder.ToString();
				var idFormat = idFormatBuilder.ToString();
				var outputDirectory = Path.Combine(baseOutputDirectory, scriptFilename);

				Console.WriteLine(
					"-d {0} -c {1} -o \"{2}\" -i {3} -f {4}",
					options.Database,
					scriptFilename,
					outputDirectory,
					idAccessorr,
					idFormat);
			}
		}

		/// <summary>
		///		Find the scriptings to generate the command lines for int he target directory.
		/// </summary>
		/// <param name="directory">
		///		The directory to scan.
		/// </param>
		/// <param name="pattern">
		///		A wildcard filter for the files to look at.
		/// </param>
		/// <param name="recurse">
		///		Flag indicating if this should be recursive.
		/// </param>
		/// <returns>
		///		The list of matching files.
		/// </returns>
		private IEnumerable<string> FindMatchingScripts(string directory, string pattern, bool recurse) {
			foreach (var path in Directory.GetFiles(directory, pattern)) {
				yield return Path.Combine(directory, path);
			}

			if (recurse) {
				foreach (var childDirectory in Directory.GetDirectories(directory)) {
					var fullChildDirectory = Path.Combine(directory, childDirectory);

					foreach (var childPath in FindMatchingScripts(fullChildDirectory, pattern, recurse)) {
						yield return childPath;
					}
				}
			}
		}

		#endregion
	}
}
