namespace CalculateChampionStatsScriptGenerator {
	public class FieldInfo {
		#region Properties

		public string Name {
			get;
			private set;
		}

		public bool IsBoolean {
			get;
			private set;
		}

		public bool CalculateMin {
			get;
			private set;
		}

		public bool CalculateMax {
			get;
			private set;
		}

		public bool CalculateTotal {
			get;
			private set;
		}

		#endregion

		#region Constructors

		public FieldInfo(string name, bool isBoolean = false, bool calculateMin = true, bool calculateMax = true, bool calculateTotal = true) {
			Name = name;
			IsBoolean = isBoolean;
			CalculateMin = !isBoolean && calculateMin;
			CalculateMax = !isBoolean && calculateMax;
			CalculateTotal = calculateTotal;
		}

		#endregion
	}
}
