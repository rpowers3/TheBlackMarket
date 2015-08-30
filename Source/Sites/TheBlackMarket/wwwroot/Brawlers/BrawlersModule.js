(function() {
	'use strict';

	var BrawlersModule = angular.module('Brawlers', [
		'TheBlackMarketSite',
		'Items',
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap',
		'ui.checkbox',
		'nvd3ChartDirectives']);

	BrawlersModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/brawlers",
			name: "Brawlers",
			flag: '/Brawlers/BrawlersFlag.png',
			image: '/Brawlers/BrawlersMenu.png'
		});

		$routeProvider
			.when('/brawlers', {
				templateUrl: 'Brawlers/BrawlersHome.html',
				controller: 'BrawlersHomeController'
			})
			.when('/brawlers/compositions', {
				templateUrl: 'Brawlers/BrawlerCompositions.html',
				controller: 'BrawlersCompositionsController'
			});
	}]);

	// The controler used for the brawlers home.
	BrawlersModule.controller('BrawlersHomeController', ['$scope', 'riotResourceService', 'dataService', 'itemsService', 'audioService', function($scope, riotResourceService, dataService, itemsService, audioService) {
		riotResourceService.getBrawlersAsync().then(function(brawlers) {
			$scope.brawlers = brawlers;
		});

		riotResourceService.getBrawlerUpgradesAsync().then(function(brawlerUpgrades) {
			$scope.brawlerUpgrades = brawlerUpgrades;
		});

		riotResourceService.getBlackMarketItemsAsync().then(function(blackMarketItems) {
			$scope.blackMarketItems = blackMarketItems;
		});

		// Helper to construct the item url for browsing to a specific item.
		$scope.getItemUrl = itemsService.getItemUrl;

		// Helper to get the item image for display.
		$scope.getItemImageUrl = riotResourceService.getItemImageUrl;

		$scope.playBrawlerSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound({ url: '/Sounds/newSounds/air_button_press_10.mp3', volume: 0.5 });
			}
		};

		$scope.playItemSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound({ url: '/Sounds/newSounds/air_button_press_1.mp3', volume: 0.5 });
			}
		};

		$scope.brawlerCompositionsLink = '#/brawlers/compositions';
	}]);

	BrawlersModule.controller('BrawlersCompositionsController', ['$scope', '$rootScope', 'riotResourceService', 'dataService', 'itemsService', function($scope, $rootScope, riotResourceService, dataService, itemsService) {
		// Make sure the brawlers are loaded so we can use their images.
		riotResourceService.getBrawlersAsync().then(function(items) {
			$scope.refresh();
		});

		$scope.getItemUrl = itemsService.getItemUrl;
		$scope.getItemName = function(itemId) {
			var item = riotResourceService.getItem(itemId);

			return (item || {}).name;
		};

		// Flag to show/hide filters.
		$scope.displayFilters = dataService.showFilters;

		$scope.$watch('displayFilters', function(value) {
			dataService.setShowFilters(value);
		});

		$scope.sortProperty = 'weightedWinRate';
		$scope.sortDirection = true;
		$scope.getItemImageUrl = riotResourceService.getItemImageUrl;

		$scope.refresh = function() {
			// Perform the async request to fetch the item stats.
			dataService.getDataAsync({
				dataSource: 'BrawlerGroups'
			}).then(function(data) {
				var rawBrawlerGroups = data.brawlerGroups;
				var maxPlays = 0;

				for (var i in rawBrawlerGroups) {
					var plays = rawBrawlerGroups[i].count;

					if (maxPlays < plays) {
						maxPlays = plays;
					}
				}

				var brawlerGroups = [];

				for (var i in rawBrawlerGroups) {
					var brawleyGroup = rawBrawlerGroups[i];
					var winRate = (brawleyGroup.timesWon / brawleyGroup.count);

					brawlerGroups.push({
						brawlers: brawleyGroup.brawlers,
						timesPlayed: brawleyGroup.count,
						timesWon: brawleyGroup.timesWon,
						winRate: winRate,
						weightedWinRate: winRate * (brawleyGroup.count / maxPlays),
						bars: [
							{
								value: Math.round(100 * ((brawleyGroup.count - brawleyGroup.timesWon) / maxPlays)),
								type: 'danger'
							},
							{
								value: Math.round(100 * (brawleyGroup.timesWon / maxPlays)),
								type: 'success'
							}
						]
					});
				}

				brawlerGroups.sort(function(a, b) {
					if (a.timesPlayed == b.timesPlayed) {
						if (a.timesWon == b.timesWon) {
							return a.brawlers.length - b.brawlers.length;
						}

						return b.timesWon - a.timesWon;
					}

					return b.timesPlayed - a.timesPlayed;
				});

				$scope.maxPlays = maxPlays;
				$scope.brawlerGroups = brawlerGroups;
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
})();