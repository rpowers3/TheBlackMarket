using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using AForge.Video.FFMPEG;
using CommandLine;
using CommandLine.Text;
using Newtonsoft.Json;

namespace HeatMapVideoBuilder {
	class Program {
		static void Main(string[] args) {
			var parserResults = Parser.Default.ParseArguments<Options>(args);

			if (parserResults.Tag == ParserResultType.NotParsed) {
				Console.WriteLine(
					new HelpText { AddDashesToOption = true }
						.AddPreOptionsLine("HeatMapVideoBuilder")
						.AddPreOptionsLine("")
						.AddOptions(parserResults).ToString());

				return;
			}

			var options = (parserResults as Parsed<Options>).Value;

			bool hasArgumentErrors = false;
			Image backgroundImage = null;
			IList<Image> spriteImages = new List<Image>();
			IList<SizeF> halfSpriteSize = new List<SizeF>();
			Image residualSpriteImage = null;
			Point mapOrigin = Point.Empty;
			Size mapSize = Size.Empty;
			Point dataOrigin = Point.Empty;
			Size dataSize = Size.Empty;
			IList<HeatMapData> heatMapData = new List<HeatMapData>();

			try {
				backgroundImage = Bitmap.FromFile(options.Background);
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to load background image \"{0}\":\n\n{1}\n\n", options.Background, e);
				hasArgumentErrors = true;
			}

			try {
				mapOrigin = string.IsNullOrWhiteSpace(options.MapOrigin) ? Point.Empty : ParsePoint(options.MapOrigin);
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to parse map origin \"{0}\":\n\n{1}\n\n", options.MapOrigin, e);
				hasArgumentErrors = true;
			}

			try {
				mapSize = string.IsNullOrWhiteSpace(options.MapSize) ? new Size(backgroundImage.Size.Width - mapOrigin.X, backgroundImage.Size.Height - mapOrigin.Y) : ParseSize(options.MapSize);
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to parse map size \"{0}\":\n\n{1}\n\n", options.MapSize, e);
				hasArgumentErrors = true;
			}

			try {
				dataOrigin = string.IsNullOrWhiteSpace(options.DataOrigin) ? mapOrigin : ParsePoint(options.DataOrigin);
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to parse data origin \"{0}\":\n\n{1}\n\n", options.DataOrigin, e);
				hasArgumentErrors = true;
			}

			try {
				dataSize = string.IsNullOrWhiteSpace(options.DataSize) ? mapSize : ParseSize(options.DataSize);
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to parse data size \"{0}\":\n\n{1}\n\n", options.DataSize, e);
				hasArgumentErrors = true;
			}

			foreach (var spriteFile in options.SpriteFiles) {
				try {
					var sprite = Bitmap.FromFile(spriteFile);
					spriteImages.Add(sprite);
					halfSpriteSize.Add(new SizeF(sprite.Width / 2.0f, sprite.Height / 2.0f));
				} catch (Exception e) {
					Console.Error.WriteLine("Failed to load heat map sprite image \"{0}\":\n\n{1}\n\n", spriteFile, e);
					hasArgumentErrors = true;
				}
			}

			if (string.IsNullOrWhiteSpace(options.ResidualSpriteFile)) {
				residualSpriteImage = spriteImages.First();
			} else {
				try {
					residualSpriteImage = Bitmap.FromFile(options.ResidualSpriteFile);
				} catch (Exception e) {
					Console.Error.WriteLine("Failed to load heat map sprite image \"{0}\":\n\n{1}\n\n", options.ResidualSpriteFile, e);
					hasArgumentErrors = true;
				}
			}

			foreach (var inputFile in options.InputFile) {
				try {
					var json = File.ReadAllText(inputFile);
					var currentHeatMapData = JsonConvert.DeserializeObject<HeatMapData>(json);

					if ((currentHeatMapData.Timestamps == null)) {
						throw new Exception("Heat map data is missing a times array. This must be an array in a root object and contain time in milliseconds.");
					}

					if ((currentHeatMapData.X == null)) {
						throw new Exception("Heat map data is missing an x coordinate array. This must be an array in a root object.");
					}

					if ((currentHeatMapData.Y == null)) {
						throw new Exception("Heat map data is missing an y coordinate array. This must be an array in a root object.");
					}

					if ((currentHeatMapData.Timestamps.Count != currentHeatMapData.X.Count) || (currentHeatMapData.Timestamps.Count != currentHeatMapData.Y.Count)) {
						throw new Exception("Heat map data arrays are not equal length.");
					}

					heatMapData.Add(currentHeatMapData);
				} catch (Exception e) {
					Console.Error.WriteLine("Failed to load heat map data from \"{0}\":\n\n{1}\n\n", options.InputFile, e);
					hasArgumentErrors = true;
				}
			}

			if (hasArgumentErrors) {
				return;
			}

			var frameRate = 25;
			var scaledFrameRate = options.TimeScale / frameRate;
			var timeDelta = (int) (1000 * scaledFrameRate);
			var width = backgroundImage.Width;
			var height = backgroundImage.Height;
			var fullRect = new Rectangle(0, 0, width, height);
			var xScaling = mapSize.Width / (float) dataSize.Width;
			var yScaling = mapSize.Height / (float) dataSize.Height;

			var compositeImage = new Bitmap(width, height, PixelFormat.Format32bppArgb);
			var compositeImageGraphics = Graphics.FromImage(compositeImage);
			compositeImageGraphics.CompositingMode = CompositingMode.SourceOver;
			compositeImageGraphics.CompositingQuality = CompositingQuality.HighSpeed;

			var heatMapBuffer = new Bitmap(width, height, PixelFormat.Format32bppArgb);
			var heatMapBufferGraphics = Graphics.FromImage(heatMapBuffer);
			heatMapBufferGraphics.CompositingMode = CompositingMode.SourceOver;
			heatMapBufferGraphics.CompositingQuality = CompositingQuality.HighSpeed;

			var residualBuffer = new Bitmap(width, height, PixelFormat.Format32bppArgb);
			var residualBufferGraphics = Graphics.FromImage(residualBuffer);
			residualBufferGraphics.CompositingMode = CompositingMode.SourceOver;
			residualBufferGraphics.CompositingQuality = CompositingQuality.HighSpeed;

			var tempBuffer = new Bitmap(width, height, PixelFormat.Format32bppArgb);
			var tempBufferGraphics = Graphics.FromImage(tempBuffer);
			tempBufferGraphics.CompositingMode = CompositingMode.SourceOver;
			tempBufferGraphics.CompositingQuality = CompositingQuality.HighSpeed;

			var currentTime = 0;
			var currentIndices = Enumerable.Repeat(0, heatMapData.Count).ToArray();
			var heatMapDataDone = Enumerable.Repeat(false, heatMapData.Count).ToArray();

			var outputDirectory = Path.GetDirectoryName(options.OutputFile);
			if (!Directory.Exists(outputDirectory)) {
				Directory.CreateDirectory(outputDirectory);
			}

			var videoWriter = new VideoFileWriter();

			if (options.BitRate == 0) {
				videoWriter.Open(options.OutputFile, width, height, frameRate, VideoCodec.MPEG4);
			} else {
				videoWriter.Open(options.OutputFile, width, height, frameRate, VideoCodec.MPEG4, options.BitRate);
			}

			compositeImageGraphics.DrawImage(backgroundImage, Point.Empty);
			compositeImageGraphics.Save();
			videoWriter.WriteVideoFrame(compositeImage);

			var alphaFade = frameRate / options.Duration;

			var heatMapFadeMatrix = new ColorMatrix();
			heatMapFadeMatrix.Matrix33 = 0.95f;// alphaFade;

			var heatMapFadeImageAttributes = new ImageAttributes();
			heatMapFadeImageAttributes.SetColorMatrix(heatMapFadeMatrix);

			var residualFadeMatrix = new ColorMatrix();
			residualFadeMatrix.Matrix00 = 0.45f;
			residualFadeMatrix.Matrix01 = 0.45f;
			residualFadeMatrix.Matrix02 = 0.45f;
			residualFadeMatrix.Matrix10 = 0.45f;
			residualFadeMatrix.Matrix11 = 0.45f;
			residualFadeMatrix.Matrix12 = 0.45f;
			residualFadeMatrix.Matrix20 = 0.45f;
			residualFadeMatrix.Matrix21 = 0.45f;
			residualFadeMatrix.Matrix22 = 0.45f;

			var residualFadeImageAttributes = new ImageAttributes();
			residualFadeImageAttributes.SetColorMatrix(residualFadeMatrix);

			var lastTime = 0u;
			var endPadding = 8 * options.Duration * frameRate;

			var font = new Font("Consolas", 10.0f);

			while ((heatMapDataDone.Any(isDone => !isDone)) || (currentTime < (lastTime + endPadding))) {
				// Process the accumulation buffer.
				tempBufferGraphics.FillRectangle(Brushes.White, 0, 0, width, height);
				tempBufferGraphics.CompositingMode = CompositingMode.SourceCopy;
				tempBufferGraphics.DrawImage(residualBuffer, fullRect, 0, 0, width, height, GraphicsUnit.Pixel, residualFadeImageAttributes);
				tempBufferGraphics.Save();

				residualBufferGraphics.FillRectangle(Brushes.Transparent, 0, 0, width, height);
				residualBufferGraphics.CompositingMode = CompositingMode.SourceCopy;
				residualBufferGraphics.DrawImage(tempBuffer, Point.Empty);
				residualBufferGraphics.CompositingMode = CompositingMode.SourceOver;

				// Process the accumulation buffer.
				tempBufferGraphics.FillRectangle(Brushes.White, 0, 0, width, height);
				tempBufferGraphics.CompositingMode = CompositingMode.SourceCopy;
				tempBufferGraphics.DrawImage(heatMapBuffer, fullRect, 0, 0, width, height, GraphicsUnit.Pixel, heatMapFadeImageAttributes);
				tempBufferGraphics.Save();

				heatMapBufferGraphics.FillRectangle(Brushes.Transparent, 0, 0, width, height);
				heatMapBufferGraphics.CompositingMode = CompositingMode.SourceCopy;
				heatMapBufferGraphics.DrawImage(tempBuffer, Point.Empty);
				heatMapBufferGraphics.CompositingMode = CompositingMode.SourceOver;

				// Write the new heat map data into the heat map buffer.
				for (var i = 0; i < timeDelta; ++i) {
					++currentTime;

					var heatMapIndex = 0;
					var spriteIndex = 0;

					foreach (var heatMapDataInstance in heatMapData) {
						var currentIndex = currentIndices[heatMapIndex];

						while ((currentIndex < heatMapDataInstance.Timestamps.Count) && (heatMapDataInstance.Timestamps[currentIndex] < currentTime)) {
							lastTime = heatMapDataInstance.Timestamps[currentIndex];

							var x = (heatMapDataInstance.X[currentIndex] - dataOrigin.X) * xScaling + mapOrigin.X - halfSpriteSize[spriteIndex].Width;
							var y = (heatMapDataInstance.Y[currentIndex] - dataOrigin.Y) * yScaling + mapOrigin.Y - halfSpriteSize[spriteIndex].Height;

							residualBufferGraphics.DrawImage(residualSpriteImage, x, y);
							heatMapBufferGraphics.DrawImage(spriteImages[spriteIndex], x, y);

							++currentIndex;
						}

						currentIndices[heatMapIndex] = currentIndex;

						if (currentIndex >= heatMapDataInstance.Timestamps.Count) {
							heatMapDataDone[heatMapIndex] = true;
						}

						if (spriteIndex < spriteImages.Count - 1) {
							++spriteIndex;
						}

						++heatMapIndex;
					}
				}

				residualBufferGraphics.Save();
				heatMapBufferGraphics.Save();

				compositeImageGraphics.DrawImage(backgroundImage, Point.Empty);
				compositeImageGraphics.DrawImage(residualBuffer, Point.Empty);
				compositeImageGraphics.DrawImage(heatMapBuffer, Point.Empty);

				var text = new TimeSpan(0, 0, 0, 0, currentTime).ToString(@"h\:mm\:ss");

				for (var i = -1; i <= 1; ++i) {
					for (var j = -1; j <= 1; ++j) {
						compositeImageGraphics.DrawString(text, font, Brushes.Black, 2 + i, 2 + j);
					}
				}

				compositeImageGraphics.DrawString(text, font, Brushes.White, 2, 2);

				compositeImageGraphics.Save();

				videoWriter.WriteVideoFrame(compositeImage);
			}

			videoWriter.Close();
		}

		private static Point ParsePoint(string point) {
			var parts = point.Split(new char[] { ',' }, 2);

			return new Point(
				int.Parse(parts[0]),
				int.Parse(parts[1]));
		}

		private static Size ParseSize(string point) {
			var parts = point.Split(new char[] { ',' }, 2);

			return new Size(
				int.Parse(parts[0]),
				int.Parse(parts[1]));
		}
	}
}
