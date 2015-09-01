using System;
using System.IO;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Configuration.Json;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;
using Microsoft.Framework.Runtime;

using NLog.Config;

namespace TheBlackMarket {
	public class Startup {
		private ILogger AccessLog {
			get;
			set;
		}

		private ILogger HtmlAccessLog {
			get;
			set;
		}

		private ILogger ApplicationLog {
			get;
			set;
		}

		public IConfiguration Configuration {
			get;
			private set;
		}

		public static IServiceProvider ServiceProvider {
			get;
			set;
		}

		public void ConfigureServices(IServiceCollection services) {
			var loggerFactory = new LoggerFactory();
			services.AddInstance(loggerFactory);
		}

		public void Configure(IApplicationBuilder app) {
			ServiceProvider = app.ApplicationServices;

			var applicationEnvironment = app.ApplicationServices.GetRequiredService<IApplicationEnvironment>();
			var configurationFile = Path.Combine(applicationEnvironment.ApplicationBasePath, applicationEnvironment.ApplicationName) + ".json";

			var configurationBuilder = new ConfigurationBuilder();
			configurationBuilder.AddJsonFile(configurationFile);

			Configuration = configurationBuilder.Build();

			ConfigureLogging(app);

			// Add site logging.
			app.Use(async (request, next) => {
				var accessLine = "<Unknown>";

				try {
					accessLine = string.Format(
						"{0} {1} {2} {3}{4}{5}",
						request.Connection.RemoteIpAddress,
						request.Request.Method,
						request.Request.Protocol,
						request.Request.Path,
						request.Request.QueryString.HasValue ? "?" : "",
						request.Request.QueryString);

					var isHtml = Path.GetExtension(request.Request.Path).Equals(".html");

					if (isHtml) {
						HtmlAccessLog.LogInformation(accessLine);
					}

					AccessLog.LogInformation(accessLine);

					await next();
				} catch (Exception e) {
					var message = string.Format("Exception processing request {0}", accessLine);
					ApplicationLog.LogError(message, e);
				}
			});

			ConfigureFileServer(app);
		}

		protected virtual void ConfigureLogging(IApplicationBuilder app) {
			var hostingEnvironment = app.ApplicationServices.GetRequiredService<IHostingEnvironment>();
			var applicationEnvironment = app.ApplicationServices.GetRequiredService<IApplicationEnvironment>();
			var loggerFactory = app.ApplicationServices.GetRequiredService<LoggerFactory>();

			var nlogConfigFileGenerated = false;
			var nlogConfigFilename = "NLog.config";
			var nlogConfigSearchPaths = new string[] {
				".",
				applicationEnvironment.ApplicationBasePath
			};

			var nlogConfigFilePath = PathUtils.FindPath(nlogConfigSearchPaths, nlogConfigFilename);

			// If no NLog.config file is found, generate one to use.
			// The stub is created so that admins can edit and configure
			// logging even in cases where a file was not provided.
			if (nlogConfigFilePath == null) {
				nlogConfigFileGenerated = true;
				nlogConfigFilePath = Path.Combine(applicationEnvironment.ApplicationBasePath, "NLog.config");
				File.WriteAllText(nlogConfigFilePath, @"<?xml version=""1.0"" encoding=""utf-8"" ?>
<nlog
	xmlns=""http://www.nlog-project.org/schemas/NLog.xsd""
	xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance""
	autoReload=""true""
>
	<targets>
		<target
			name=""Console""
			xsi:type=""ColoredConsole""
			layout=""[${pad:padding=7:inner=${level:uppercase=true}}] ${logger}: ${message}""/>
	</targets>

	<rules>
		<logger name=""*"" minlevel=""Info"" writeTo=""console"" />
	</rules>
</nlog>
");
			}

			var nlogFactory = new NLog.LogFactory(new XmlLoggingConfiguration(nlogConfigFilePath) {
				AutoReload = true
			});

			loggerFactory.AddNLog(nlogFactory);

			ApplicationLog = loggerFactory.CreateLogger("Application");
			ApplicationLog.LogInformation("Log file opened at {0}.", DateTime.Now);

			if (nlogConfigFileGenerated) {
				ApplicationLog.LogWarning("NLog configuration file could not be found. A new one has been generated.");
			}

			ApplicationLog.LogInformation("Logging configuration file: {0}", nlogConfigFilePath);

			AccessLog = loggerFactory.CreateLogger("Access");
			AccessLog.LogInformation("Log file opened at {0}.", DateTime.Now);

			HtmlAccessLog = loggerFactory.CreateLogger("HtmlAccess");
			HtmlAccessLog.LogInformation("Log file opened at {0}.", DateTime.Now);
		}

		protected virtual void ConfigureFileServer(IApplicationBuilder app) {
			var contentTypes = new FileExtensionContentTypeProvider();
			contentTypes.Mappings[".js"] = "application/js";
			contentTypes.Mappings[".json"] = "application/json";
			contentTypes.Mappings[".map"] = "text/x-map";
			contentTypes.Mappings[".scss"] = "text/x-scss";

			var hostingEnvironment = app.ApplicationServices.GetService<IHostingEnvironment>();

			var absoluteWebRootPath = Path.GetFullPath(hostingEnvironment.WebRootPath);

			var fileProviderList = new FileProviderList();
			fileProviderList.Add(new PhysicalFileProvider(absoluteWebRootPath));

			var jsonDataPath = Configuration.Get("jsonDataPath");
			fileProviderList.Add(
				new RerootedFileProvider(
					new PhysicalFileProvider(jsonDataPath),
					"Json"));

			var videoPath = Configuration.Get("videoPath");
			fileProviderList.Add(
				new RerootedFileProvider(
					new PhysicalFileProvider(videoPath),
					"Videos"));

			var videoPath2 = Configuration.Get("videoPath2");

			if (!string.IsNullOrWhiteSpace(videoPath2)) {
				fileProviderList.Add(
					new RerootedFileProvider(
						new PhysicalFileProvider(videoPath2),
						"Videos"));
			}

			var soundsPath = Configuration.Get("soundsPath");
			fileProviderList.Add(
				new RerootedFileProvider(
					new PhysicalFileProvider(soundsPath),
					"Sounds"));

			var musicPath = Configuration.Get("musicPath");
			fileProviderList.Add(
				new RerootedFileProvider(
					new PhysicalFileProvider(musicPath),
					"Music"));

			var imagesPath = Configuration.Get("imagesPath");
			fileProviderList.Add(
				new RerootedFileProvider(
					new PhysicalFileProvider(imagesPath),
					"Images"));

			var fileServerOptions = new FileServerOptions() {
				FileProvider = fileProviderList,
				EnableDirectoryBrowsing = (Configuration.Get("enableDirectoryBrowsing").ToLower().Equals("true")),
				EnableDefaultFiles = true,
			};

			fileServerOptions.DefaultFilesOptions.DefaultFileNames = new[] {
				"Index.html",
				"index.html",
			};

			fileServerOptions.DirectoryBrowserOptions.FileProvider = fileProviderList;
			fileServerOptions.StaticFileOptions.ContentTypeProvider = contentTypes;

			app.UseFileServer(fileServerOptions);
		}
	}
}
