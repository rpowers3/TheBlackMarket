using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TheBlackMarket {
	public static class PathUtils {
		private static readonly Regex directorySeparatorRegex = new Regex(@"\\|\/");
		private static readonly Regex directoryNormalizerRegex = new Regex(@"\\|\/|(?<!(?:\\|\/))$");

		public static string NormalizeDirectory(string path) {
			return directoryNormalizerRegex.Replace(path, Path.DirectorySeparatorChar.ToString());
		}

		public static string FindPath(IEnumerable<string> paths, string filename) {
			foreach (var path in paths) {
				var fullPath = Combine(path, filename);

				if (File.Exists(fullPath)) {
					return fullPath;
				}
			}

			return null;
		}

		public static string Combine(params string[] parts) {
			var path = parts.FirstOrDefault();

			if (parts.Length > 1) {
				foreach (var part in parts.Skip(1)) {
					path = Path.Combine(path, part);
				}
			}

			return Clean(path);
		}

		private static readonly Regex hasPathNavigationElementsRegex = new Regex(@"(\.\.|\.)");

		public static string Clean(string path) {
			if (path == null) {
				throw new ArgumentNullException(nameof(path));
			}

			path = path.Replace('/', Path.DirectorySeparatorChar);
			path = path.Replace('\\', Path.DirectorySeparatorChar);

			if (hasPathNavigationElementsRegex.IsMatch(path)) {
				var isRooted = Path.IsPathRooted(path);
				var components = path.Split(Path.DirectorySeparatorChar);
				var newComponents = new List<string>();

				for (var i = 0; i < components.Length; ++i) {
					var component = components[i];

					if (component == ".") {
						continue;
					}

					if (component == "..") {
						if (newComponents.Count == 0) {
							throw new ArgumentException("Attempt to navigate to parent of rooted path.");
						}

						newComponents.RemoveAt(newComponents.Count - 1);
						continue;
					}

					newComponents.Add(component);
				}

				path = string.Join(Path.DirectorySeparatorChar.ToString(), newComponents);
			}

			return path;
		}
	}
}
