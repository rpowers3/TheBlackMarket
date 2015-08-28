using System.Collections.Generic;

namespace HeatMapVideoBuilder {
	public class HeatMapData {
		public IList<uint> Timestamps {
			get;
			set;
		}

		public IList<int> X {
			get;
			set;
		}

		public IList<int> Y {
			get;
			set;
		}
	}
}
