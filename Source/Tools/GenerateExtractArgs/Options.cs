using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using CommandLine;
using CommandLine.Text;

namespace GenerateExtractArgs {
	public class Options {
		[Option('d', "database", Required = true, HelpText = "The database to extract from.")]
		public string Database {
			get;
			set;
		}

		[Option('s', "script-path", Required = true, HelpText = "The path to search for scripts in.")]
		public string ScriptPath {
			get;
			set;
		}

		[Option('f', "script-pattern", HelpText = "A wildcard filter used to filter script files.")]
		public string Filter {
			get;
			set;
		}

		[Option('r', "recurse", Default = false, HelpText = "Flag indicating if this should be recursive.")]
		public bool Recurse {
			get;
			set;
		}

		[Option('o', "base-output-directory", HelpText = "The base output directory to use.")]
		public string BaseOutputDirectory {
			get;
			set;
		}
	}
}
