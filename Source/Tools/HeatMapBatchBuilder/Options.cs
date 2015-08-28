using CommandLine;

namespace HeatMapBatchBuilder {
	public class Options {
		[Option('h', "heat-map-visualizer-path", Required = true, HelpText = "The path to the heat map visualizer tool.")]
		public string HeatMapVideoBuilderPath {
			get;
			set;
		}

		[Option('i', "input-directory", Required = true, HelpText = "The directory to load heat map data from.")]
		public string InputDirectory {
			get;
			set;
		}

		[Option('f', "input-filter", Default = "*.json", HelpText = "A filter to use for the files being processed.")]
		public string InputFilter {
			get;
			set;
		}

		[Option("force", Default = false, HelpText = "Forces regeneration of the video.")]
		public bool Force {
			get;
			set;
		}

		[Option('o', "output-directory", Required = true, HelpText = "The output directory to place the videos.")]
		public string OutputDirectory {
			get;
			set;
		}

		[Option('m', "map", Required = true, HelpText = "The background image for the heatmap.")]
		public string Map {
			get;
			set;
		}

		[Option('b', "blue-team-sprite", Required = true, HelpText = "The sprite to use for the blue team.")]
		public string BlueTeamSprite {
			get;
			set;
		}

		[Option('r', "red-team-sprite", Required = true, HelpText = "The sprite to use for the red team.")]
		public string RedTeamSprite {
			get;
			set;
		}

		[Option('n', "nuetral-team-sprite", Required = true, HelpText = "The sprite to use for the both teams.")]
		public string NuetralTeamSprite {
			get;
			set;
		}

		[Option('t', "merge-teams", Default = false, HelpText = "Attempt to merge parallel team data from the input directory.")]
		public bool MergeTeamData {
			get;
			set;
		}

		[Option('e', "residual-sprite", HelpText = "The sprite to use for a residual trail.")]
		public string ResidualSprite {
			get;
			set;
		}

		[Option("force-nuetral", Default = false, HelpText = "Forces the use of the nuetral sprite.")]
		public bool ForceNuetralSprite {
			get;
			set;
		}

		[Option("bit-rate", Default = 0, HelpText = "The bit rate to encode with.")]
		public int BitRate {
			get;
			set;
		}

		public bool HasResidualImage {
			get {
				return !string.IsNullOrWhiteSpace(ResidualSprite);
			}
		}
	}
}
