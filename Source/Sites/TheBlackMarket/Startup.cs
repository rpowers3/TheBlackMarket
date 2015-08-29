using System.IO;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Configuration.Json;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Runtime;

namespace TheBlackMarket {
	public class Startup {
		public IConfiguration Configuration {
			get;
			private set;
		}

		public void ConfigureServices(IServiceCollection services) {
		}

		public void Configure(IApplicationBuilder app) {
			var applicationEnvironment = app.ApplicationServices.GetRequiredService<IApplicationEnvironment>();
			var configurationFile = Path.Combine(applicationEnvironment.ApplicationBasePath, applicationEnvironment.ApplicationName) + ".json";

			var configurationBuilder = new ConfigurationBuilder();
			configurationBuilder.AddJsonFile(configurationFile);

			Configuration = configurationBuilder.Build();

			ConfigureFileServer(app);
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
