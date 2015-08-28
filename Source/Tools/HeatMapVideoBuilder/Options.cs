using System.Collections.Generic;
using CommandLine;

namespace HeatMapVideoBuilder {
	public class Options {
		[Option('b', "background", Required = true, HelpText = "The background image for the heatmap.")]
		public string Background {
			get;
			set;
		}

		[Option('i', "input", Separator = ',', Required = true, HelpText = "The input data to process.")]
		public IList<string> InputFile {
			get;
			set;
		}

		[Option('o', "output", Required = true, HelpText = "The output file to generate.")]
		public string OutputFile {
			get;
			set;
		}

		[Option('s', "sprite", Separator = ',', Required = true, HelpText = "The sprite to use for pings.")]
		public IList<string> SpriteFiles {
			get;
			set;
		}

		[Option("residual-sprite", HelpText = "The sprite to use for pings.")]
		public string ResidualSpriteFile {
			get;
			set;
		}

		[Option('d', "duration", Default = 250.0f, HelpText = "The rate at which heat map data fades.")]
		public float Duration {
			get;
			set;
		}

		[Option("map-origin", Default = "0,0", HelpText = "The origin for heat map data in the image.")]
		public string MapOrigin {
			get;
			set;
		}

		[Option("map-size", HelpText = "The size of the map relative to the origin. Coordinates go from the top left to the bottom right. Negative values can be used to invert directions. The default value will be the distance from the Origin to the lower right corner.")]
		public string MapSize {
			get;
			set;
		}

		[Option("data-origin", HelpText = "The data origin for heat map data. This will default to the image origin.")]
		public string DataOrigin {
			get;
			set;
		}

		[Option("data-size", HelpText = "The data size for heat map data. This will default to the map size.")]
		public string DataSize {
			get;
			set;
		}

		[Option('t', "time-scale", Default = 120.0f, HelpText = "A multiplier to apply to the time.")]
		public float TimeScale {
			get;
			set;
		}

		[Option("bit-rate", Default = 0, HelpText = "The bit rate to encode with.")]
		public int BitRate {
			get;
			set;
		}

		[Option("generate-composite-image", Default = false, HelpText = "Generates a final heatmap image.")]
		public bool GenerateCompositeImage {
			get;
			set;
		}

		[Option("composite-image-factor", Default = 256.0f, HelpText = "Used for alpha of the sprite for composite images.")]
		public float CompositeImageFactor {
			get;
			set;
		}
	}
}
