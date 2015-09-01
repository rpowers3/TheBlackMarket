(function() {
	'use strict';

	var RivalriesModule = angular.module('Rivalries', ['TheBlackMarketSite', 'ngRoute']);
	
	RivalriesModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/rivalries",
			name: "Rivalries",
			flag: '/Rivalries/RivalriesFlag.png',
			image: '/Rivalries/RivalriesMenu.png'
		});

		$routeProvider
		  .when('/rivalries', {
		  	templateUrl: 'Rivalries/RivalriesHome.html',
		  	controller: 'RivalriesController'
		  });
	}]);

	RivalriesModule.controller('RivalriesController', ['$scope', '$rootScope', '$routeParams', '$sce', 'riotResourceService', 'dataService', 'championsService', function($scope, $rootScope, $routeParams, $sce, riotResourceService, dataService, championsService) {
		$scope.isIEorEdge = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Edge') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			if ($scope.isIEorEdge) {
				return;
			}

			riotResourceService.getChampionsAsync().then(function(championList) {
				dataService.getDataAsync({
					dataSource: 'Rivalries'
				}).then(function(rawData) {
					var championIds = rawData.championIds;
					var champions = [];

					for (var i = 0; i < championIds.length; ++i) {
						champions.push(riotResourceService.getChampionById(championIds[i]));
					}

					var killRatios = rawData.killRatios;
					var processedData = [];

					var nameSanitizer = /[^A-Za-z]/;

					for (var i = 0; i < killRatios.length; ++i) {
						var imports = [];

						for (var j = 0; j < killRatios[i].length; ++j) {
							if (killRatios[i][j] >= 1.0) {
								imports.push(champions[j].name.replace(nameSanitizer, ""));
							}
						}

						processedData.push({
							name: champions[i].name.replace(nameSanitizer, ""),
							rawName: champions[i].name,
							champion: champions[i],
							image: riotResourceService.getChampionImageUrl(champions[i]),
							killRatios: killRatios[i],
							size: 10,
							imports: imports
						});
					}

					$scope.killRatios = processedData;
				});
			});
		};

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

		$scope.refresh();
	}]);
})();