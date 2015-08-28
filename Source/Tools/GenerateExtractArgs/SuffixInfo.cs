namespace GenerateExtractArgs {
	/// <summary>
	///		Wrapper for information about file suffixes and how they map
	///		to the id fields in the Mongo documents and what the prefix
	///		is for the filenames when exporting the documents.
	/// </summary>
	internal class SuffixInfo {
		#region Properties

		public string IdPath {
			get;
			private set;
		}

		public string FormatPrefix {
			get;
			private set;
		}

		#endregion

		#region Constructors

		public SuffixInfo(string idPath, string formatPrefix) {
			IdPath = idPath;
			FormatPrefix = formatPrefix;
		}

		#endregion
	}
}
