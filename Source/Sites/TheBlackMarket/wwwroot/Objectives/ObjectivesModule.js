(function() {
	'use strict';

	var ObjectivesModule = angular.module('Objectives', ['TheBlackMarketSite', 'ngRoute']);
	
	ObjectivesModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/objectives",
			name: "Objectives",
			flag: '/Objectives/ObjectivesFlag.jpg',
			image: '/Objectives/ObjectivesMenu.png'
		});

		$routeProvider
		  .when('/objectives', {
		  	templateUrl: 'Objectives/ObjectivesHome.html',
		  	controller: 'ObjectivesController'
		  });
	}]);

	var buildingIdMap = {
		bn1: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'NexusTurret'
		},
		bn2: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'NexusTurret'
		},
		rn1: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'NexusTurret'
		},
		rn2: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'NexusTurret'
		},
		btb: {
			lane: 'TOP_LANE',
			type: 'BASE_TURRET',
			name: 'TopInhibitorTurret'
		},
		rtb: {
			lane: 'TOP_LANE',
			type: 'BASE_TURRET',
			name: 'TopInhibitorTurret'
		},
		bti: {
			lane: 'TOP_LANE',
			type: 'INNER_TURRET',
			name: 'TopInnerTurret'
		},
		rti: {
			lane: 'TOP_LANE',
			type: 'INNER_TURRET',
			name: 'TopInnerTurret'
		},
		bto: {
			lane: 'TOP_LANE',
			type: 'OUTER_TURRET',
			name: 'TopOuterTurret'
		},
		rto: {
			lane: 'TOP_LANE',
			type: 'OUTER_TURRET',
			name: 'TopOuterTurret'
		},
		bmb: {
			lane: 'MID_LANE',
			type: 'BASE_TURRET',
			name: 'MidInhibitorTurret'
		},
		rmb: {
			lane: 'MID_LANE',
			type: 'BASE_TURRET',
			name: 'MidInhibitorTurret'
		},
		bmi: {
			lane: 'MID_LANE',
			type: 'INNER_TURRET',
			name: 'MidInnerTurret'
		},
		rmi: {
			lane: 'MID_LANE',
			type: 'INNER_TURRET',
			name: 'MidInnerTurret'
		},
		bmo: {
			lane: 'MID_LANE',
			type: 'OUTER_TURRET',
			name: 'MidOuterTurret'
		},
		rmo: {
			lane: 'MID_LANE',
			type: 'OUTER_TURRET',
			name: 'MidOuterTurret'
		},
		bbb: {
			lane: 'BOT_LANE',
			type: 'BASE_TURRET',
			name: 'BottomInhibitorTurret'
		},
		rbb: {
			lane: 'BOT_LANE',
			type: 'BASE_TURRET',
			name: 'BottomInhibitorTurret'
		},
		bbi: {
			lane: 'BOT_LANE',
			type: 'INNER_TURRET',
			name: 'BottomInnerTurret'
		},
		rbi: {
			lane: 'BOT_LANE',
			type: 'INNER_TURRET',
			name: 'BottomInnerTurret'
		},
		bbo: {
			lane: 'BOT_LANE',
			type: 'OUTER_TURRET',
			name: 'BottomOuterTurret'
		},
		rbo: {
			lane: 'BOT_LANE',
			type: 'OUTER_TURRET',
			name: 'BottomOuterTurret'
		},
	};

	ObjectivesModule.controller('ObjectivesController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'audioService', 'championsService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, audioService, championsService) {
		$scope.playSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

		$scope.selectedObjective = 'bn1';

		var updateSelectedInfo = function() {
			$scope.selectedObjectImageUrl = '/Resources/Blank.png';

			if (!$scope.buildingInfos) {
				return;
			}

			if (
				$scope.eliteMonsterInfo &&
				(($scope.selectedObjective == "baron") || ($scope.selectedObjective == "dragon"))
			) {
				var monsterType;

				if ($scope.selectedObjective == "baron") {
					monsterType = "BARON_NASHOR";
					$scope.selectedObjectName = "BaronNashor";
					$scope.selectedObjectImageUrl = '/Resources/BaronNashor.png';
				} else {
					monsterType = "DRAGON";
					$scope.selectedObjectName = "Dragon";
					$scope.selectedObjectImageUrl = '/Resources/Dragon.png';
				}

				if ($scope.eliteMonsterInfo) {
					for (var i = 0; i < $scope.eliteMonsterInfo.monsterType.length; ++i) {
						if ($scope.eliteMonsterInfo.monsterType[i] == monsterType) {
							$scope.activeStats = {
								kills: $scope.eliteMonsterInfo.kills[i],
								timesWon: $scope.eliteMonsterInfo.timesWon[i]
							};
						}
					}
				}

				if ($scope.monsterInfos) {
					for (var i = 0; i < $scope.monsterInfos.length; ++i) {
						if ($scope.monsterInfos[i].monsterType == monsterType) {
							$scope.activeChart = $scope.monsterInfos[i].chart;
						}
					}
				}

				return;
			}

			var buildingInfo;
			for (var item in buildingIdMap) {
				if (item == $scope.selectedObjective) {
					buildingInfo = buildingIdMap[item];
					break;
				}
			}

			if (!buildingInfo) {
				return;
			}

			$scope.selectedObjectName = buildingInfo.name;

			if (!$scope.buildingStats) {
				$scope.activeStats = undefined;
			} else {
				for (var i = 0; i < $scope.buildingStats.count.length; ++i) {
					if (
						($scope.buildingStats.laneTypes[i] == buildingInfo.lane) &&
						($scope.buildingStats.towerTypes[i] == buildingInfo.type)) {
						$scope.activeStats = {
							kills: $scope.buildingStats.count[i],
							timesWon: $scope.buildingStats.timesWon[i]
						};
					}
				}
			}

			if (!$scope.activeStats) {
				$scope.winLoss = undefined;
			} else {
				var kills = $scope.activeStats.kills;
				var timesWon = $scope.activeStats.timesWon;
				var losses = (kills - timesWon);

				$scope.winLoss = [
					{
						value: Math.round(100 * (losses / kills)),
						title: losses,
						type: 'danger'
					},
					{
						value: Math.round(100 * (timesWon / kills)),
						title: timesWon,
						type: 'success'
					}
				];
			}

			for (var i = 0; i < $scope.buildingInfos.length; ++i) {
				if (
					($scope.buildingInfos[i].lane == buildingInfo.lane) &&
					($scope.buildingInfos[i].type == buildingInfo.type)) {
					$scope.activeChart = $scope.buildingInfos[i].chart;
				}
			}
		};

		$scope.$watchCollection('selectedObjective', updateSelectedInfo);

		$scope.xAxisTickFormat = function() {
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

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'ChampionStats'
			}).then(function(data) {
				$scope.championStats = data;
			});

			dataService.getDataAsync({
				dataSource: 'ChampionStatsOverTime'
			}).then(function(data) {
				$scope.championStatsOverTime = data;

				$scope.charts = {};

				var neededChartKeys = [
					'firstTowerKillSum',
					'firstTowerKillSumWin',
					'firstTowerAssistSum',
					'firstTowerAssistSumWin',
					'firstInhibitorAssistSum',
					'firstInhibitorAssistSumWin',
					'inhibitorKillsMin',
					'inhibitorKillsAvg',
					'inhibitorKillsMax',
					'inhibitorKillsSum',
					'inhibitorKillsMinWin',
					'inhibitorKillsAvgWin',
					'inhibitorKillsMaxWin',
					'inhibitorKillsSumWin',
					'towerKillsMin',
					'towerKillsAvg',
					'towerKillsMax',
					'towerKillsSum',
					'towerKillsMinWin',
					'towerKillsAvgWin',
					'towerKillsMaxWin',
					'towerKillsSumWin',
				];

				for (var i in neededChartKeys) {
					var key = neededChartKeys[i];
					$scope.charts[key] = championsService.buildChampionStatChartData(data, key);
				}
			});

			dataService.getDataAsync({
				dataSource: 'BuildingKill'
			}).then(function(data) {
				$scope.buildingStats = data;
				updateSelectedInfo();
			});

			dataService.getDataAsync({
				dataSource: 'BuildingPerMinuteKill'
			}).then(function(data) {
				var buildingInfos = [];

				for (var i = 0; i < data.buildings.length; ++i) {
					var buildingData = data.buildings[i];
					var lane = buildingData.lane;
					var type = buildingData.type;

					buildingInfos.push({
						lane: lane,
						type: type,
						chart: dataService.buildWinLossChartData(buildingData)
					});
				}

				$scope.buildingInfos = buildingInfos;
				updateSelectedInfo();
			});

			dataService.getDataAsync({
				dataSource: 'EliteMonsterKill'
			}).then(function(data) {
				$scope.eliteMonsterInfo = data;
				updateSelectedInfo();
			});

			dataService.getDataAsync({
				dataSource: 'EliteMonsterPerMinuteKill'
			}).then(function(data) {
				var monsterInfos = [];

				for (var i = 0; i < data.monsters.length; ++i) {
					var monster = data.monsters[i];

					monsterInfos.push({
						monsterType: monster.monsterType,
						chart: dataService.buildWinLossChartData(monster)
					});
				}

				$scope.monsterInfos = monsterInfos;
				updateSelectedInfo();
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