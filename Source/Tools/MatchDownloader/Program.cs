using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;

using CommandLine;
using CommandLine.Text;
using Newtonsoft.Json.Linq;

namespace MatchDownloader {
	public class Program {
		#region Methods

		public void Main(string[] args) {
			var parserResults = Parser.Default.ParseArguments<Options>(args);

			if (parserResults.Tag == ParserResultType.NotParsed) {
				Console.WriteLine(
					new HelpText { AddDashesToOption = true }
						.AddPreOptionsLine("MatchDownloader")
						.AddPreOptionsLine("")
						.AddOptions(parserResults).ToString());

				return;
			}

			var options = (parserResults as Parsed<Options>).Value;

			// Initialize the set of match ids to process.
			var matchIds = Enumerable.Empty<uint>();

			if (options.Match != 0) {
				matchIds = matchIds.Concat(new[] { options.Match });
			}

			var duplicatesCount = 0;

			if (!string.IsNullOrWhiteSpace(options.MatchList)) {
				if (!File.Exists(options.MatchList)) {
					Console.Error.WriteLine("File does not exist: {0}", options.MatchList);
				} else {
					try {
						var contents = File.ReadAllText(options.MatchList);
						var json = JToken.Parse(contents);
						matchIds = matchIds.Concat(json.ToObject<List<uint>>());

						var duplicates =
							from match in matchIds
							group match by match into m
							where m.Count() > 1
							select new {
								Id = m.Key,
								Count = m.Count()
							};

						if (duplicates.Any()) {
							duplicatesCount = duplicates.Count();

							Console.WriteLine(
								"The match list \"{0}\" contained the following duplicated:\n\t{1}\n",
								options.MatchList,
								string.Join("\n\t", duplicates.Select(d => d.Id.ToString())));

							matchIds = matchIds.Distinct();
						}
					} catch (Exception e) {
						Console.Error.WriteLine("Failed to parse array of match ids from \"{0}\": {1}", options.MatchList, e.Message);
					}
				}
			}

			// Create the output directory and ensure it was created.
			try {
				if (string.IsNullOrWhiteSpace(options.OutputDirectory)) {
					options.OutputDirectory = ".";
				} else if (!Directory.Exists(options.OutputDirectory)) {
					Directory.CreateDirectory(options.OutputDirectory);
				}
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to create output directory \"{0}\": {1}", options.OutputDirectory, e.Message);
				return;
			}

			// Download the requested matches.
			var successes = 0;
			var expected = matchIds.Count();
			var current = 0;
			var retries = 10;

			while ((current++ < retries) && (successes != expected)) {
				successes = DownloadMatches(options, matchIds);
			}

			Console.WriteLine();
			Console.WriteLine("Download complete. {0} matches downloaded of {1} requested.", successes, expected);
			Console.WriteLine();
		}

		private int DownloadMatches(Options options, IEnumerable<uint> matchIds) {
			Console.WriteLine("Downloading match data ({0})", options.Region);

			var region = options.Region.ToString().ToLower();
			var currentRequest = 0;
			var requestCount = matchIds.Count();
			var pendingRequests = 0;

			var runningTimeStopwatch = new Stopwatch();
			runningTimeStopwatch.Start();

			var requestDelayStopwatch = new Stopwatch();

			// Using a message queue since the responses are processed on
			// a worker thread.
			var completedMatchRequests = Queue.Synchronized(new Queue());

			// Choose a timer delay time that will keep the timer updating
			// without additionally throttling the delay.
			var timerDelay = Math.Min(50, options.Delay);

			var successes = 0;

			Action processCompletedRequestsAndWait = () => {
				while (completedMatchRequests.Count > 0) {
					var completedRequest = (MatchRequest) completedMatchRequests.Dequeue();

					--pendingRequests;

					if (completedRequest.Exception != null) {
						Console.Error.WriteLine("  Failed to download match {0}: {1}", completedRequest.MatchId, completedRequest.Exception.Message);
					} else {
						++successes;

						if (options.Verbose) {
							Console.WriteLine("  Downloaded match {0} to \"{1}\"", completedRequest.MatchId, completedRequest.MatchFile);
						}
					}
				}

				// This is a bit of a busy wait just to keep the timer running
				// which make the app feel responsive. Still sleeping so it doesn't
				// suck up all the processor time.
				requestDelayStopwatch.Restart();

				while (requestDelayStopwatch.ElapsedMilliseconds < options.Delay) {
					Console.Write("{2}: {0,6} of {1,6}", currentRequest, requestCount, runningTimeStopwatch.Elapsed);
					Thread.Sleep(timerDelay);
					Console.Write("\r                                                          \r");
				}
			};

			foreach (var matchId in matchIds) {
				++currentRequest;

				var matchFile = Path.Combine(options.OutputDirectory, string.Format("{0}.json", matchId));

				if (!options.Force && File.Exists(matchFile)) {
					++successes;
					continue;
				}

				try {
					++pendingRequests;

					// Construct a web request to fetch the data.
					var matchIdEndpoint = string.Format(
						"https://{2}.api.pvp.net/api/lol/{2}/v2.2/match/{0}?includeTimeline=true&api_key={1}",
						matchId,
						options.ApiKey,
						region);

					var request = HttpWebRequest.Create(matchIdEndpoint);

					// Perform this operation asynchronously so that multiple
					// request can happen simultaneously.
					request.BeginGetResponse(OnMatchResponse, new MatchRequest() {
						WebRequest = request,
						MatchId = matchId,
						MatchFile = matchFile,
						OnCompleted = (matchRequest) => completedMatchRequests.Enqueue(matchRequest)
					});
				} catch (Exception e) {
					--pendingRequests;
					Console.Error.WriteLine("  Failed to request match {0}: {1}", matchId, e.Message);
				}

				// Display any mesages and wait the specified delay period
				// before issuing the next request.
				processCompletedRequestsAndWait();
			}

			// Wait for any outstanding requests to finish. This checks
			// using the specified request delay period for its interval.
			while (pendingRequests > 0) {
				processCompletedRequestsAndWait();
			}

			return successes;
		}

		private void OnMatchResponse(IAsyncResult result) {
			var matchRequest = (MatchRequest) result.AsyncState;

			try {
				using (var response = matchRequest.WebRequest.EndGetResponse(result)) {
					using (var responseStream = response.GetResponseStream()) {
						using (var textReader = new StreamReader(responseStream)) {
							File.WriteAllText(matchRequest.MatchFile, textReader.ReadToEnd());
						}
					}
				}
			} catch (Exception e) {
				matchRequest.Exception = e;
			}

			if (matchRequest.OnCompleted != null) {
				matchRequest.OnCompleted(matchRequest);
			}
		}

		#endregion

		#region RequestState Class

		/// <summary>
		///		Utility class used to pass information to the request callbacks
		///		so it can save the data to the correct location and notify the
		///		main thread of any messages.
		/// </summary>
		private class MatchRequest {
			public WebRequest WebRequest {
				get;
				set;
			}

			public uint MatchId {
				get;
				set;
			}

			public string MatchFile {
				get;
				set;
			}

			public Exception Exception {
				get;
				set;
			}

			public Action<MatchRequest> OnCompleted {
				get;
				set;
			}
		}

		#endregion
	}
}
