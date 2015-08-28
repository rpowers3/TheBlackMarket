using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.FileProviders;

namespace TheBlackMarket {
	internal class NotFoundFileInfo : IFileInfo {
		#region Methods

		private readonly string name;

		#endregion

		#region Properties

		public bool Exists {
			get {
				return false;
			}
		}

		public bool IsDirectory {
			get {
				return false;
			}
		}

		public DateTimeOffset LastModified {
			get {
				return DateTimeOffset.MinValue;
			}
		}

		public long Length {
			get {
				return -1;
			}
		}

		public string Name {
			get {
				return name;
			}
		}

		public string PhysicalPath {
			get {
				return null;
			}
		}

		#endregion

		#region Constructors

		public NotFoundFileInfo(string name) {
			this.name = name;
		}

		#endregion

		#region Methods

		public Stream CreateReadStream() {
			throw new FileNotFoundException(string.Format("The file {0} does not exist.", Name));
		}

		#endregion
	}
}
