using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.FileProviders;
using Microsoft.Framework.Caching;

namespace TheBlackMarket {
	public class RerootedFileProvider : IFileProvider {
		#region Properties

		public IFileProvider BaseFileProvider {
			get;
			private set;
		}

		public string Root {
			get;
			private set;
		}

		#endregion

		#region Constructors

		public RerootedFileProvider(IFileProvider baseFileProvider, string root) {
			if (baseFileProvider == null) {
				throw new ArgumentNullException(nameof(baseFileProvider));
			}

			if (string.IsNullOrEmpty(root)) {
				throw new ArgumentException("Invalid root.", nameof(root));
			}

			BaseFileProvider = baseFileProvider;

			Root = string.Format(
				"{0}{1}{2}",
				(root.StartsWith("/") ? "" : "/"),
				root.Replace("\\", "/"),
				(root.EndsWith("/") ? "" : "/"));
		}

		#endregion

		#region IFileProvider Members

		public IDirectoryContents GetDirectoryContents(string subpath) {
			subpath = subpath.Replace("\\", "/");

			if (!subpath.StartsWith(Root)) {
				return new NotFoundDirectoryContents();
			}

			subpath = subpath.Substring(Root.Length);

			return BaseFileProvider.GetDirectoryContents(subpath);
		}

		public IFileInfo GetFileInfo(string subpath) {
			subpath = subpath.Replace("\\", "/");

			if (!subpath.StartsWith(Root)) {
				return new NotFoundFileInfo(Path.GetFileName(subpath));
			}

			subpath = subpath.Substring(Root.Length);

			return BaseFileProvider.GetFileInfo(subpath);
		}

		public IExpirationTrigger Watch(string filter) {
			var newFilter = Path.Combine(Root, filter);
			return BaseFileProvider.Watch(newFilter);
		}

		#endregion
	}
}
