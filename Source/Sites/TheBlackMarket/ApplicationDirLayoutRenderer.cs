using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.LayoutRenderers;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Runtime;

namespace TheBlackMarket
{
	[LayoutRenderer("applicationdir")]
	public class ProjectDirLayoutRenderer : LayoutRenderer {
		protected override void Append(StringBuilder builder, LogEventInfo logEvent) {
			var applicationEnvironment = Startup.ServiceProvider.GetRequiredService<IApplicationEnvironment>();
			builder.Append(applicationEnvironment.ApplicationBasePath.Replace("\\", "/"));
		}
	}
}
