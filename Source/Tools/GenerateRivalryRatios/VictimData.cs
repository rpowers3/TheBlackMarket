using System.Collections.Generic;
using Newtonsoft.Json;

namespace GenerateRivalryRatios {
	public class VictimData {
		[JsonProperty("_id")]
		public VictimDataId Id {
			get;
			set;
		}

		public IList<int> Victims {
			get;
			set;
		}

		public IList<int> Kills {
			get;
			set;
		}
	}
}
