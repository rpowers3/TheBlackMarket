(function() {
	'use strict';

	var CombatModule = angular.module('Combat', ['TheBlackMarketSite', 'ngRoute']);
	
	CombatModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/combat",
			name: "Combat",
			flag: '/Combat/CombatFlag.jpg',
			image: '/Combat/CombatMenu.png'
		});

		$routeProvider
		  .when('/combat', {
		  	templateUrl: 'Combat/CombatHome.html',
		  	controller: 'CombatController'
		  });
	}]);

	// Constants
	var kdaColors = ['blue', 'green', 'red'];
	var killChartColors = ['blue', 'cyan', 'green', 'orange', 'red'];
	var winRateChartColors = ['red', 'green'];

	CombatModule.controller('CombatController', ['$scope', '$rootScope', '$routeParams', '$sce', 'riotResourceService', 'dataService', 'championsService', function($scope, $rootScope, $routeParams, $sce, riotResourceService, dataService, championsService) {
		$scope.kdaColors = kdaColors;
		$scope.killChartColors = killChartColors;
		$scope.videoTheme = '/Libraries/videogular-themes-default/videogular.css';

		$scope.isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			$scope.dataUnavailable = dataService.regionFilter == 'ALL';

			$scope.deathHeatMap = dataService.getDataPath({
				dataSource: 'DeathLocations',
				basePath: 'Images',
				type: 'png',
				useMerge: true
			});

			var deathVideoUrl = dataService.getDataPath({
				dataSource: 'DeathLocations',
				basePath: 'Videos',
				type: '',
				useMerge: true
			});

			$scope.ieDeathVideoUrl = deathVideoUrl + '.mp4';

			$scope.deathSources = [
				{
					src: $sce.trustAsResourceUrl(deathVideoUrl + '.webm'),
					type: 'video/webm'
				},
				{
					src: $sce.trustAsResourceUrl(deathVideoUrl + '.mp4'),
					type: 'video/mp4'
				}
			];

			$scope.killshHeatMap = dataService.getDataPath({
				dataSource: 'KillLocations',
				basePath: 'Images',
				type: 'png',
				useMerge: true
			});

			var killVideoUrl = dataService.getDataPath({
				dataSource: 'KillLocations',
				basePath: 'Videos',
				type: '',
				useMerge: true
			});

			$scope.ieKillVideoUrl = killVideoUrl + '.mp4';

			$scope.killSources = [
				{
					src: $sce.trustAsResourceUrl(killVideoUrl + '.webm'),
					type: 'video/webm'
				},
				{
					src: $sce.trustAsResourceUrl(killVideoUrl + '.mp4'),
					type: 'video/mp4'
				}
			];

			dataService.getDataAsync({
				dataSource: 'ChampionStats'
			}).then(function(data) {
				$scope.championStats = data;

				$scope.kdaBar = dataService.addNormalizedBarValues([
					{ value: data.killsAvg, type: 'info', title: data.killsAvg + ' Kills' },
					{ value: data.assistsAvg, type: 'success', title: data.assistsAvg + ' Assists' },
					{ value: data.deathsAvg, type: 'danger', title: data.deathsAvg + ' Deaths' }
				]);

				$scope.killBar = dataService.addNormalizedBarValues([
					//{ value: data.killsAvg, type: 'kill', title: data.killsAvg + ' Kills' },
					{ value: data.doubleKillsAvg, type: 'doubleKill', title: data.doubleKillsAvg + ' Double Kills' },
					{ value: data.tripleKillsAvg, type: 'tripleKill', title: data.tripleKillsAvg + ' Triple Kills' },
					{ value: data.quadraKillsAvg, type: 'quadraKill', title: data.quadraKillsAvg + ' Quadra Kills' },
					{ value: data.pentaKillsAvg, type: 'pentaKill', title: data.pentaKillsAvg + ' Penta Kills' },
					{ value: data.unrealKillsAvg, type: 'ultraKill', title: data.unrealKillsAvg + ' Ultra Kills' }
				]);

				$scope.kdaWinBar = dataService.addNormalizedBarValues([
					{ value: data.killsAvgWin, type: 'info', title: data.killsAvgWin + ' Kills' },
					{ value: data.assistsAvgWin, type: 'success', title: data.assistsAvgWin + ' Assists' },
					{ value: data.deathsAvgWin, type: 'danger', title: data.deathsAvgWin + ' Deaths' }
				]);

				$scope.killWinBar = dataService.addNormalizedBarValues([
					//{ value: data.killsAvgWin, type: 'kill', title: data.killsAvgWin + ' Kills' },
					{ value: data.doubleKillsAvgWin, type: 'doubleKill', title: data.doubleKillsAvgWin + ' Double Kills' },
					{ value: data.tripleKillsAvgWin, type: 'tripleKill', title: data.tripleKillsAvgWin + ' Triple Kills' },
					{ value: data.quadraKillsAvgWin, type: 'quadraKill', title: data.quadraKillsAvgWin + ' Quadra Kills' },
					{ value: data.pentaKillsAvgWin, type: 'pentaKill', title: data.pentaKillsAvgWin + ' Penta Kills' },
					{ value: data.unrealKillsAvgWin, type: 'ultraKill', title: data.unrealKillsAvgWin + ' Ultra Kills' }
				]);
			});

			// Get the over time stats for spark lines.
			dataService.getDataAsync({
				dataSource: 'ChampionStatsOverTime'
			}).then(function(data) {
				$scope.championStatsOverTime = data;

				$scope.charts = {};

				// Generate ALL the spark line data. BAM!
				for (var key in data) {
					$scope.charts[key] = championsService.buildChampionStatChartData(data, key);
				}
			});
		};

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