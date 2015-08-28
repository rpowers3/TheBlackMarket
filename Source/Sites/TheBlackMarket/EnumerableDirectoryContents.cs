using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.FileProviders;

namespace TheBlackMarket {
	internal class EnumerableDirectoryContents : IDirectoryContents {
		#region Members

		private readonly IEnumerable<IFileInfo> entries;

		#endregion

		#region Properties

		public bool Exists {
			get {
				return true;
			}
		}

		#endregion

		#region Constructors

		public EnumerableDirectoryContents(IEnumerable<IFileInfo> entries) {
			this.entries = entries;
		}

		#endregion

		#region Methods

		public IEnumerator<IFileInfo> GetEnumerator() {
			return entries.GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator() {
			return entries.GetEnumerator();
		}

		#endregion
	}
}
