(function() {
	'use strict';

	// Site module that adds in access to browsing champions and
	// viewing aggregate data for them over the Black Market Brawler
	// matches.
	var ChampionsModule = angular.module('Champions', [
		'TheBlackMarketSite',
		'Items',
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap',
		'ui.checkbox',
		'nvd3ChartDirectives']);

	// Constants
	var kdaColors = ['blue', 'green', 'red'];
	var killChartColors = ['blue', 'cyan', 'green', 'orange', 'red'];
	var winRateChartColors = ['red', 'green'];

	var customSkinSounds = {
		// Diana.
		131: {
			any: ['/Music/DianasLoginMusic.mp3']
		},
		// Jinx
		222: {
			any: ['/Music/JinxLoginMusic.mp3'],
			skins: {
				2: ['/Music/JinxFirecracker.mp3']
			}
		}
	};

	ChampionsModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/champions",
			name: "Champions"
		});

		$routeProvider
			.when('/champions', {
				templateUrl: 'Champions/ChampionList.html',
				controller: 'ChampionListController'
			})
			.when('/champions/:championId', {
				templateUrl: 'Champions/ChampionInfo.html',
				controller: 'ChampionHomeController'
			})
			.when('/champions/:championId/gold', {
				templateUrl: 'Champions/ChampionGold.html',
				controller: 'ChampionGoldController'
			})
			.when('/champions/:championId/items', {
				templateUrl: 'Champions/ChampionItems.html',
				controller: 'ChampionItemsController'
			})
			.when('/champions/:championId/item/:itemId', {
				templateUrl: 'Champions/ChampionItemInfo.html',
				controller: 'ChampionItemInfoController'
			})
			.when('/champions/:championId/skills', {
				templateUrl: 'Champions/ChampionSkills.html',
				controller: 'ChampionSkillsController'
			})
			.when('/champions/:championId/combat', {
				templateUrl: 'Champions/ChampionCombat.html',
				controller: 'ChampionCombatController'
			})
			.when('/champions/:championId/objectives', {
				templateUrl: 'Champions/ChampionObjectives.html',
				controller: 'ChampionObjectivesController'
			});
	}]);

	// Service providing item related utilities
	ChampionsModule.service('championsService', ['$rootScope', 'riotResourceService', 'dataService', 'audioService', function($rootScope, riotResourceService, dataService, audioService) {
		this.activeChampion = 0;
		this.activeChampionSkinIndex = -1;
		this.activeChampionSplashImageUrl = null;

		var self = this;

		var isSameChampionPage = function(args, newLocation, oldLocation) {
			if (!(newLocation && self.activeChampion && newLocation.params.championId == self.activeChampion.key)) {
				return false;
			}

			if (newLocation && (newLocation.loadedTemplateUrl) && ((newLocation.loadedTemplateUrl.indexOf('Champions/') != 0) || (newLocation.loadedTemplateUrl == 'Champions/ChampionList.html'))) {
				return false;
			}

			return true;
		};

		this.enterChampionSection = function(champion, isPrimaryPage) {
			if (!champion) {
				return false;
			}

			if (champion == self.activeChampion) {
				return true;
			}

			var hadActiveChampion = (self.activeChampion != undefined);

			self.activeChampion = champion;

			if (isPrimaryPage || hadActiveChampion) {
				// If sounds are enabled, set the champion sound so it plays.
				if (audioService.playSounds && audioService.playChampionSounds) {
					audioService.playSound(riotResourceService.baseLocalizedSoundUrl + 'champions/' + champion.id + '.mp3');
				}

				var skinCount = champion.skins.length;
				var skinIndex = Math.floor(Math.random() * skinCount);
				var skinInfo = champion.skins[skinIndex];

				if (audioService.playMusic) {
					var customTrack = self.getChampionMusic(champion.key, skinIndex);

					if (customTrack) {
						audioService.playTrackOverride(customTrack, isSameChampionPage);
					}
				}

				self.activeChampionSkinIndex = skinIndex;

				self.activeChampionSplashImageUrl = riotResourceService.baseSharedImageUrl + 'champion/splash/' + champion.id + '_' + skinIndex + '.jpg';
			}

			return true;
		};

		$rootScope.$on('$routeChangeSuccess', function(args, newLocation, oldLocation) {
			if (!isSameChampionPage(args, newLocation, oldLocation)) {
				self.activeChampion = 0;
				self.activeChampionSkinIndex = -1;
				self.activeChampionSplashImageUrl = null;
			}
		});

		this.buildChampionStatChartData = function(data, statName) {
			if (statName == "_id" || statName == "times") {
				return;
			}

			var chartData = [];

			var timeFunction = dataService.unpackMonthDayHourTime;

			for (var i = 0; i < data.times.length; ++i) {
				var time = timeFunction(data.times[i]);
				var value = data[statName][i];

				chartData.push({ x: time, y: value });
			}

			return chartData;
		};

		this.getChampionMusic = function(championId, skinId) {
			var sourceMusic;
			var championRecord = customSkinSounds[championId];

			if (championRecord) {
				var skinsRecord = championRecord.skins;

				if (skinsRecord) {
					sourceMusic = skinsRecord[skinId]
				}

				sourceMusic = sourceMusic || championRecord.any;
			}

			if (!sourceMusic) {
				return undefined;
			}

			return sourceMusic[Math.floor(Math.random() * sourceMusic.length)];
		};
	}]);

	function initializeScope($scope) {
		$scope.getSparkLineColor = function() {
			return function(d, i) {
				return '#FFFFFF';
			}
		};

		$scope.empty = function() {
			return function(d, i) {
				return '';
			}
		};

		$scope.labelFunction = function() {
			return function(d) {
				return d.label;
			}
		};

		$scope.valueFunction = function() {
			return function(d) {
				return d.value;
			}
		};

		$scope.getPieSliceTooltip = function() {
			return function(key, value, e, graph) {
				return '<span style="color: black"><h3>' + key + '</h3><p>' + value + '</p></span>';
			}
		};
	};

	function registerForFilterChanges($scope, $rootScope, dataService) {
		$scope.showAllStats = dataService.showAllStats

		var unregisterRegionFilterChanged = $rootScope.$on('DataFilterService.RegionFilterChanged', function() {
			$scope.refresh();
		});

		var unregisterTeamFilterChanged = $rootScope.$on('DataFilterService.TeamFilterChanged', function() {
			$scope.refresh();
		});

		var unregisterShowAllStatsChanged = $rootScope.$on('DataFilterService.ShowAllStatsChanged', function() {
			$scope.showAllStats = dataService.showAllStats
		});

		// Clean up so events don't leak.
		$scope.$on('$destroy', function() {
			unregisterRegionFilterChanged();
			unregisterTeamFilterChanged();
			unregisterShowAllStatsChanged();
		});
	};

	// Controller used to provide a list of champions and allows
	// for sorting and filtering of the list.
	ChampionsModule.controller('ChampionListController', ['$scope', 'riotResourceService', 'dataService', function($scope, riotResourceService, dataService) {
		// Fetch the list of champion.
		riotResourceService.getChampionsAsync().then(function(championList) {
			// The champions is in a map that needs to be converted into
			// two arrays. The names array is for autocompletion and the
			// second array is because filtering and sorting in angular
			// only works on arrays, not maps.
			var championsNames = [];
			var championsArray = [];

			for (var championId in championList) {
				var champion = championList[championId];
				championsArray.push(champion);
				championsNames.push(champion.name);
			}

			$scope.champions = championsArray;
			$scope.championNames = championsNames;
		});

		// Flag to show/hide filters.
		$scope.displayFilters = dataService.showFilters;

		$scope.$watch('displayFilters', function(value) {
			dataService.setShowFilters(value);
		});

		// Default to sorting alphabetically.
		$scope.sortProperty = 'name';
		$scope.sortDirection = false;

		// Default to nothing filtered.
		$scope.nameFilter = "";
		$scope.filter = {
			assassin: false,
			fighter: false,
			mage: false,
			marksman: false,
			support: false,
			tank: false
		};

		// Perform item filtering by checking the name and tags of the champions.
		$scope.championFilter = function(item) {
			return (($scope.nameFilter == "") || 0 <= item.name.toLowerCase().indexOf($scope.nameFilter.toLowerCase())) &&
				(!$scope.filter.assassin || 0 <= item.tags.indexOf("Assassin")) &&
				(!$scope.filter.fighter || 0 <= item.tags.indexOf("Fighter")) &&
				(!$scope.filter.mage || 0 <= item.tags.indexOf("Mage")) &&
				(!$scope.filter.marksman || 0 <= item.tags.indexOf("Marksman")) &&
				(!$scope.filter.support || 0 <= item.tags.indexOf("Support")) &&
				(!$scope.filter.tank || 0 <= item.tags.indexOf("Tank"));
		};

		// Helper to construct the item url for browsing to a specific champion.
		$scope.getChampionUrl = function(champion) {
			return "#/champions/" + champion.key;
		};

		// Helper to get the champion image for display.
		$scope.getChampionImage = function(champion) {
			return riotResourceService.baseImageUrl + "champion/" + champion.image.full;
		};
	}]);

	// Controller used to display specific champion information.
	ChampionsModule.controller('ChampionHomeController', ['$scope', '$rootScope', '$routeParams', 'audioService', 'riotResourceService', 'dataService', 'championsService', 'itemsService', function($scope, $rootScope, $routeParams, audioService, riotResourceService, dataService, championsService, itemsService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo, true)) {
				return;
			}

			$scope.champion = fullChampionInfo;

			// Update the background splash.
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;

			// Start requesting aggregate data.
			$scope.refresh();
		});

		$scope.showAllStats = dataService.showAllStats;
		$scope.getSummonerSpellImageUrl = riotResourceService.getSummonerSpellImageUrl;

		$scope.summonerSpellSortProperty = 'weightedWinRate';
		$scope.summonerSpellSortReverse = true;

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'ChampionStats',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStats = data;

				$scope.winLoss = [
					{
						value: Math.round(100 * ((data.timesPlayed - data.wins) / data.timesPlayed)),
						type: 'danger'
					},
					{
						value: Math.round(100 * (data.wins / data.timesPlayed)),
						type: 'success'
					}
				];
			});

			// Get the over time stats for spark lines.
			dataService.getDataAsync({
				dataSource: 'ChampionStatsOverTime',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStatsOverTime = data;

				$scope.charts = {};

				// Generate ALL the spark line data. BAM!
				for (var key in data) {
					$scope.charts[key] = championsService.buildChampionStatChartData(data, key);
				}
			});

			// Get the over time stats for spark lines.
			riotResourceService.getSummonerSpellsAsync().then(function() {
				dataService.getDataAsync({
					dataSource: 'SummonerSpellUse',
					championId: $scope.champion.key,
				}).then(function(summonerSpells) {
					var summonerSpellInfos = [];

					var maxUse = 0;
					for (var i = 0; i < summonerSpells.spell.length; ++i) {
						if (maxUse < summonerSpells.count[i]) {
							maxUse = summonerSpells.count[i];
						}
					}

					for (var i = 0; i < summonerSpells.spell.length; ++i) {
						var count = summonerSpells.count[i];
						var timesWon = summonerSpells.timesWon[i];
						var winRate = timesWon / count;
						var pickRate = (count / maxUse);

						summonerSpellInfos.push({
							spell: riotResourceService.getSummonerSpell(summonerSpells.spell[i]),
							count: count,
							timesWon: timesWon,
							winRate: winRate,
							pickRate: pickRate,
							weightedWinRate: winRate * pickRate
						});
					}

					$scope.summonerSpellInfos = summonerSpellInfos;
				});
			});
		};

		initializeScope($scope);
		registerForFilterChanges($scope, $rootScope, dataService);
	}]);

	ChampionsModule.controller('ChampionGoldController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'ChampionStats',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStats = data;
			});

			// Get the over time stats for spark lines.
			dataService.getDataAsync({
				dataSource: 'ChampionStatsOverTime',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStatsOverTime = data;

				$scope.charts = {};

				// Generate ALL the spark line data. BAM!
				for (var key in data) {
					$scope.charts[key] = championsService.buildChampionStatChartData(data, key);
				}
			});
		};

		initializeScope($scope);
		registerForFilterChanges($scope, $rootScope, dataService);
	}]);

	ChampionsModule.controller('ChampionItemsController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'itemsService', 'championsService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, itemsService, championsService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.itemsSortProperty = 'winRate';
		$scope.itemsSortReverse = true;

		// Helper to construct the item url for browsing to a specific item.
		$scope.getItemUrl = function(itemId, championId) {
			return '#/champions/' + championId + '/item/' + itemId;
		};

		// Helper to get the item image for display.
		$scope.getItemImage = riotResourceService.getItemImageUrl;

		$scope.filterBaseItems = function(itemInfo) {
			return (itemInfo.item.into) && (itemInfo.item.into.length == 0) &&
				(itemInfo.item.from) && (itemInfo.item.from.length > 0);
		};

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the item statistics.
			riotResourceService.getItemsAsync().then(function(items) {
				dataService.getDataAsync({
					dataSource: 'ItemWinRates',
					championId: $scope.champion.key,
				}).then(function(data) {
					var maxWins = 0;
					var maxPlayed = 0;

					for (var i = 0; i < data.items.length; ++i) {
						if (maxWins < data.timesWon[i]) {
							maxWins = data.timesWon[i];
						}

						if (maxPlayed < data.timesUsed[i]) {
							maxPlayed = data.timesUsed[i];
						}
					}

					// Time to restructure the data.
					var itemInfo = [];

					for (var i = 0; i < data.items.length; ++i) {
						var winRate = data.timesWon[i] / data.timesUsed[i];
						var pickRate = data.timesUsed[i] / maxPlayed;
						var winPickRate = data.timesWon[i] / maxWins;

						var itemRecord = {
							itemId: data.items[i],
							item: riotResourceService.getItem(data.items[i]),
							timesUsed: data.timesUsed[i],
							timesWon: data.timesWon[i],
							winRate: winRate,
							pickRate: pickRate,
							winPickRate: winPickRate,
							weightedWinRate: winRate * pickRate,
							charts: []
						};

						(function(itemRecord) {
							dataService.getDataAsync({
								dataSource: 'ItemWinRatesOverTime',
								championId: $scope.champion.key,
								itemId: itemRecord.itemId
							}).then(function(itemData) {
								itemData.winRates = [];
								itemData.pickRates = [];
								itemData.winPickRates = [];

								for (var j = 0; j < itemData.times.length; ++j) {
									itemData.winRates.push(itemData.timesWon[j] / itemData.timesUsed[j]);
									itemData.pickRates.push(itemData.timesUsed[j] / maxPlayed);
									itemData.winPickRates.push(itemData.timesWon[j] / maxWins);
								}

								for (var key in itemData) {
									itemRecord.charts[key] = championsService.buildChampionStatChartData(itemData, key);
								}
							});
						})(itemRecord);

						itemInfo.push(itemRecord);
					}

					$scope.maxWins = maxWins;
					$scope.maxPlayed = maxPlayed;
					$scope.itemInfo = itemInfo;
				});
			});
		};

		initializeScope($scope);
		registerForFilterChanges($scope, $rootScope, dataService);
	}]);

	// The controller used to display item information. This controller listens
	// for global changes to the region and team filters and will update its
	// data when they change.
	ChampionsModule.controller('ChampionItemInfoController', ['$scope', '$rootScope', '$routeParams', '$sce', 'riotResourceService', 'dataService', 'championsService', function($scope, $rootScope, $routeParams, $sce, riotResourceService, dataService, championsService) {
		// Perform the async request to fetch the item info which is
		// needed before the refresh can occur.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;

			riotResourceService.getItemAsync($routeParams.itemId).then(function(item) {
				$scope.item = item;
				$scope.trustedDescription = $sce.trustAsHtml(item.description);

				// Update the image url for the item.
				$scope.itemImageUrl = (riotResourceService.baseImageUrl + "item/" + $scope.item.image.full);

				$scope.refresh()
			});
		});

		$scope.winRateChartColors = winRateChartColors;

		// Utility to reset scope data.
		var resetData = function() {
			$scope.winRatesOverTimeChart = [{ key: '', values: [[0, 0]] }];
			$scope.winRatesPerMinuteChart = [{ key: '', values: [[0, 0]] }];
		};

		resetData();

		$scope.xAxisTickFormat = function() {
			return function(d) {
				return d3.time.format('%m/%e %H:%M')(new Date(d));
			}
		};

		$scope.xAxisTickFormat1 = function() {
			return function(d) {
				return d;
			}
		};

		$scope.colorF = function() {
			return function(d, i) {
				return d.color;
			}
		};

		$scope.toolTipContentFunction = function() {
			return function(key, x, y, e, graph) {
				return '<h1>' + key + '</h1>' + '<p>' + y + '</p>'
			}
		};

		$scope.refresh = function() {
			resetData();

			if (!$scope.item) {
				return;
			}

			// Perform the async request to fetch the item stats.
			dataService.getDataAsync({
				dataSource: 'ItemWinRates',
				itemId: $scope.item.id,
				championId: ($scope.champion || {}).key
			}).then(function(data) {
				$scope.itemStats = data;
			});

			// Perform the async request to fetch the item win
			// rates over real world time.
			dataService.getDataAsync({
				dataSource: 'ItemWinRatesOverTime',
				itemId: $scope.item.id,
				championId: ($scope.champion || {}).key
			}).then(function(data) {
				$scope.ItemWinRatesOverTime = data;

				$scope.winRatesOverTimeChart = dataService.buildWinLossChartData(data, {
					timeFunction: dataService.unpackMonthDayHourTime
				});
			});

			dataService.getDataAsync({
				dataSource: 'ItemPerMinuteWinRates',
				itemId: $scope.item.id,
				championId: ($scope.champion || {}).key
			}).then(function(data) {
				$scope.itemPerMinuteWinRates = data;
				$scope.winRatesPerMinuteChart = dataService.buildWinLossChartData(data);
			});
		};

		// Register for filter changes
		var unregisterRegionFilterChanged = $rootScope.$on('DataFilterService.RegionFilterChanged', function() {
			$scope.refresh();
		});

		var unregisterTeamFilterChanged = $rootScope.$on('DataFilterService.TeamFilterChanged', function() {
			$scope.refresh();
		});

		var unregisterShowAllStatsChanged = $rootScope.$on('DataFilterService.ShowAllStatsChanged', function() {
			$scope.showAllStats = dataService.showAllStats
		});

		// Clean up so events don't leak.
		$scope.$on('$destroy', function() {
			unregisterRegionFilterChanged();
			unregisterTeamFilterChanged();
			unregisterShowAllStatsChanged();
		});
	}]);

	ChampionsModule.controller('ChampionCombatController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.kdaColors = kdaColors;
		$scope.killChartColors = killChartColors;

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			$scope.deathVideoUrl = dataService.getDataPath({
				dataSource: 'DeathLocations',
				type: 'mp4',
				useMerge: true,
				championId: $scope.champion.key
			});

			$scope.killVideoUrl = dataService.getDataPath({
				dataSource: 'KillLocations',
				type: 'mp4',
				useMerge: true,
				championId: $scope.champion.key
			});

			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'ChampionStats',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStats = data;

				$scope.winLoss = [
					{
						value: Math.round(100 * ((data.timesPlayed - data.wins) / data.timesPlayed)),
						type: 'danger'
					},
					{
						value: Math.round(100 * (data.wins / data.timesPlayed)),
						type: 'success'
					}
				];

				$scope.kdaChart = [
					{ label: "Kills", value: data.killsAvg },
					{ label: "Assits", value: data.deathsAvg },
					{ label: "Deaths", value: data.assistsAvg }
				];

				$scope.killChart = [
					{ label: "Kills", value: data.killsAvg },
					{ label: "Double Kills", value: data.doubleKillsAvg },
					{ label: "Triple Kills", value: data.tripleKillsAvg },
					{ label: "Quadra Kills", value: data.quadraKillsAvg },
					{ label: "Penta Kills", value: data.pentaKillsAvg },
					{ label: "Ultra Kills", value: data.unrealKillsAvg },
				];

				$scope.winningKdaChart = [
					{ label: "Kills", value: data.killsAvgWin },
					{ label: "Assits", value: data.deathsAvgWin },
					{ label: "Deaths", value: data.assistsAvgWin }
				];

				$scope.winningKillChart = [
					{ label: "Kills", value: data.killsAvgWin },
					{ label: "Double Kills", value: data.doubleKillsAvgWin },
					{ label: "Triple Kills", value: data.tripleKillsAvgWin },
					{ label: "Quadra Kills", value: data.quadraKillsAvgWin },
					{ label: "Penta Kills", value: data.pentaKillsAvgWin },
					{ label: "Ultra Kills", value: data.unrealKillsAvgWin },
				];

				$scope.popupChart = {
					content: 'Testing',
					templateUrl: '/Champions/SparkChartPopup.html',
					title: 'DATA!'
				};

				$scope.labelFunction = function() {
					return function(d) {
						return d.label;
					}
				};

				$scope.valueFunction = function() {
					return function(d) {
						return d.value;
					}
				};

				$scope.getPieSliceTooltip = function() {
					return function(key, value, e, graph) {
						return '<span style="color: black"><h3>' + key + '</h3><p>' + value + '</p></span>';
					}
				};
			});

			// Get the over time stats for spark lines.
			dataService.getDataAsync({
				dataSource: 'ChampionStatsOverTime',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStatsOverTime = data;

				$scope.charts = {};

				// Generate ALL the spark line data. BAM!
				for (var key in data) {
					$scope.charts[key] = championsService.buildChampionStatChartData(data, key);
				}
			});
		};

		initializeScope($scope);
		registerForFilterChanges($scope, $rootScope, dataService);
	}]);
})();