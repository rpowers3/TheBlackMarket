using Microsoft.AspNet.FileProviders;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Reflection;
using Microsoft.Framework.Caching;

namespace TheBlackMarket {
	public class FileProviderList : IList<IFileProvider>, IFileProvider {
		private IList<IFileProvider> fileProviders = new List<IFileProvider>();

		public IFileProvider this[int index] {
			get {
				return fileProviders[index];
			}
			set {
				fileProviders[index] = value;
			}
		}

		public int Count {
			get {
				return fileProviders.Count;
			}
		}

		public bool IsReadOnly {
			get {
				return false;
			}
		}

		public void Add(IFileProvider item) {
			fileProviders.Add(item);
		}

		public void Clear() {
			fileProviders.Clear();
		}

		public bool Contains(IFileProvider item) {
			return fileProviders.Contains(item);
		}

		public void CopyTo(IFileProvider[] array, int arrayIndex) {
			fileProviders.CopyTo(array, arrayIndex);
		}

		public IEnumerator<IFileProvider> GetEnumerator() {
			return fileProviders.GetEnumerator();
		}

		public int IndexOf(IFileProvider item) {
			return fileProviders.IndexOf(item);
		}

		public void Insert(int index, IFileProvider item) {
			fileProviders.Insert(index, item);
		}

		public bool Remove(IFileProvider item) {
			return fileProviders.Remove(item);
		}

		public void RemoveAt(int index) {
			fileProviders.RemoveAt(index);
		}

		public IDirectoryContents GetDirectoryContents(string subpath) {
			var contents = Enumerable.Empty<IFileInfo>();

			foreach (var fileProvider in this) {
				var currentContents = fileProvider.GetDirectoryContents(subpath);
				if ((currentContents != null) && currentContents.Exists) {
					contents = contents.Union(currentContents);
				}
			}

			if (contents.Any()) {
				return new EnumerableDirectoryContents(contents.Distinct(new FileInfoEqualityComparer()));
			}

			return new NotFoundDirectoryContents();
		}

		public IFileInfo GetFileInfo(string subpath) {
			foreach (var fileProvider in this) {
				var fileInfo = fileProvider.GetFileInfo(subpath);
				if ((fileInfo != null) && !(fileInfo is NotFoundFileInfo) && (fileInfo.Exists)) {
					return fileInfo;
				}
			}

			return new NotFoundFileInfo(subpath);
		}

		IEnumerator IEnumerable.GetEnumerator() {
			return fileProviders.GetEnumerator();
		}

		public IExpirationTrigger Watch(string filter) {
			return null;
		}

		private class FileInfoEqualityComparer : IEqualityComparer<IFileInfo> {
			public bool Equals(IFileInfo x, IFileInfo y) {
				return string.Equals(x.Name, y.Name);
			}

			public int GetHashCode(IFileInfo obj) {
				return obj.Name.GetHashCode();
			}
		}
	}
}
