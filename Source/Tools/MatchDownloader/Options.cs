using CommandLine;

namespace MatchDownloader {
	public class Options {
		[Option('k', "api-key", Required = true, HelpText = "The RIOT API key to use for performing fetches.")]
		public string ApiKey {
			get;
			set;
		}

		[Option('m', "match", HelpText = "Specifies the id of a specific match to fetch.")]
		public uint Match {
			get;
			set;
		}

		[Option('i', "input-match-list", HelpText = "Specifies the path of a json formatted file containing a list of match Ids to fetch.")]
		public string MatchList {
			get;
			set;
		}

		[Option('d', "delay", Default = 2000, HelpText = "The delay to wait between making API requests.")]
		public int Delay {
			get;
			set;
		}

		[Option('o', "output-directory", HelpText = "The output directory to write match data into.")]
		public string OutputDirectory {
			get;
			set;
		}

		[Option('r', "region", Default = Region.NA, HelpText = "The region to pull the data from.")]
		public Region Region {
			get;
			set;
		}

		[Option('v', "verbose", Default = false, HelpText = "Display additional diagnostic messages.")]
		public bool Verbose {
			get;
			set;
		}

		[Option('f', "force", Default = false, HelpText = "Forces the redownload of match data even if the file exist.")]
		public bool Force {
			get;
			set;
		}
	}
}
