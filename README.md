# TheBlackMarket

This project was created by Rodney (KearinDragon) Powers and Tom (Agihor) Allen.

This is a contest entry for the Riot API Challenge 2.0. This entry makes use of the match history data provided by all the matches from all of the regions to generate some interesting aggregate data for inspection and comparison.

Data is kind of awesome to look at and it becomes infinitely easier to find patterns and trends if you can at least see the data. What we did was grab all of the match data from the list of matches that Riot provided, threw them all up into a database, generated tons of data files with results from all combinations of queries, and then added a site to all the browsing of it all. You can view the data in different was using site filters to compare regions and teams. (By the way, blue team advatage is alive and well, at least from this data.)

## Design ##

Since this project was operating on static data, there was not really need need to use the majority of the Riot endpoints, mainly the Match endpoint to obtain the data and then to process the match data. Because no new matches were being made available the decission was made to preprocess all of the data and then bake the results into permutations of JSON data files to make requesting these files as fast as possible. This was preferrable to hitting a database on the back end for each request and it turns the web server into just a file server.

The majority of the application logic is split between the tools that fetched and preprocessed the data into data files and the website that is a single page app to view the data.

The data was processed using the following process:

* The data was downloaded using the MatchDownloader tool using the list of match Ids.
* A MongoDB was set up and a database named 'TheBlackMarket' was created.
* All of this data was then imported into a Mongo DB using MongoImport into 'TheBlackMarket'.
* The PrepareMatchEvents and PrepareParticipants scripts were run on the database to flatten and split the match data.
* The CalculateChampionStatsScriptGenerator was used to generate the ChampionStats scripts (due to the number of fields to prevent errors.)
* The RunGenerationScripts powershell script then executed EVERY Generate* script in the Scripts folder.
* MongoExtract was used to export all of the generated collections to JSON files o disk. (~2 million)
* The HeatMapBatchBuilder was used with the HeatMapVideoBuilder (Poorly named, they're death maps right now but they can do heat maps with minimal changes) to generate death and kill maps from the DeathLocation* KillLocation* data.
* All of this data is raw files for use by the site now.

The website is a simple ASP.NET vNext server configured with a few file providers to access its wwwroot and the Json, Sounds, Music, and Video data. These locations are configured in the TheBlackMarket.json file.

## Technologies Used ##

Thanks to the following 3rd party projects that were used for the tools and the site.

``` [Aforge](https://code.google.com/p/aforge/)
``` [Angular](https://angularjs.org/)
``` [D3](http://d3js.org/)
``` [Howler](https://github.com/goldfire/howler.js/)
``` [MongoDB](https://www.mongodb.com/)
``` [NVD3](http://nvd3.org/)
``` [SASS](http://sass-lang.com/)
``` [Visual Studio 2015 Community Edition](https://www.visualstudio.com/en-us/products/vs-2015-product-editions.aspx)
