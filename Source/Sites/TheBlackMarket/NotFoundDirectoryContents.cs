using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.FileProviders;

namespace TheBlackMarket {
	internal class NotFoundDirectoryContents : IDirectoryContents {
		#region Properties

		public bool Exists {
			get {
				return false;
			}
		}

		#endregion

		#region Constructors

		public NotFoundDirectoryContents() {
		}

		#endregion

		#region Methods

		public IEnumerator<IFileInfo> GetEnumerator() {
			return Enumerable.Empty<IFileInfo>().GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator() {
			return GetEnumerator();
		}

		#endregion
	}
}
