using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using CommandLine;
using CommandLine.Text;

namespace GenerateRivalryRatios {
	public class Options {
		[Option('i', "input-directory", Required = true, HelpText = "The input directory to load the victim data from.")]
		public string InputDirectory {
			get;
			set;
		}

		[Option('o', "output-directory", Required = true, HelpText = "The directory to write the output into.")]
		public string OutputDirectory {
			get;
			set;
		}

		[Option('f', "filter", Default = "*.json", HelpText = "A file filter to filter the input files with.")]
		public string FileFilter {
			get;
			set;
		}
	}
}
