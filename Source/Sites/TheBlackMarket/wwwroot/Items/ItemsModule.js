(function() {
	'use strict';

	// Site module that adds in access to browsing store items and
	// viewing aggregate data for them over the Black Market Brawler
	// matches.
	var ItemsModule = angular.module('Items', [
		'TheBlackMarketSite',
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap',
		'ui.checkbox',
		'nvd3ChartDirectives']);

	// Constants.
	var winRateChartColors = ['red', 'green'];

	ItemsModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/items",
			name: "Items",
			flag: '/Items/ItemsFlag.jpg',
			image: '/Items/ItemsMenu.png'
		});

		$routeProvider
			.when('/items', {
			templateUrl: 'Items/ItemsList.html',
			controller: 'ItemsController'
			})
		.when('/items/:itemId', {
			templateUrl: 'Items/ItemInfo.html',
			controller: 'ItemController'
		});
	}]);

	// Service providing item related utilities
	ItemsModule.service('itemsService', [function() {
		// Gets the item url for an item.
		this.getItemUrl = function(item) {
			var itemId = (typeof item == "number") ? item : item.id;
			return "#/items/" + itemId;
		};
	}]);

	// The controler used to display a list of items that can be sorted
	// and filtered.
	ItemsModule.controller('ItemsController', ['$scope', 'riotResourceService', 'dataService', 'itemsService', 'audioService', function($scope, riotResourceService, dataService, itemsService, audioService) {
		// Initiate the request to fetch the items list.
		riotResourceService.getItemsAsync().then(function(items) {
			$scope.items = items;

			// Construct an itemNames array for use with autocomplete
			// input fields.
			var itemNames = [];

			for (var item in items) {
				itemNames.push(items[item].name);
			}

			$scope.itemNames = itemNames;
		});

		$scope.playItemSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

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
			health: false,
			healthRegen: false,
			armor: false,
			magicResist: false,
			tenacity: false,
			damage: false,
			criticalStrike: false,
			attackSpeed: false,
			lifeSteal: false,
			abilityPower: false,
			cooldownReduction: false,
			spellVamp: false,
			mana: false,
			manaRegen: false,
			boots: false,
			otherMovementItems: false
		};

		// Perform item filtering by checking the name and tags of the items.
		$scope.itemFilter = function(item) {
			return (($scope.nameFilter == "") || 0 <= item.name.toLowerCase().indexOf($scope.nameFilter.toLowerCase())) &&
				(!$scope.filter.health || 0 <= item.tags.indexOf("Health")) &&
				(!$scope.filter.healthRegen || 0 <= item.tags.indexOf("HealthRegen")) &&
				(!$scope.filter.armor || 0 <= item.tags.indexOf("Armor")) &&
				(!$scope.filter.magicResist || 0 <= item.tags.indexOf("SpellBlock")) &&
				(!$scope.filter.tenacity || 0 <= item.tags.indexOf("Tenacity")) &&
				(!$scope.filter.damage || 0 <= item.tags.indexOf("Damage")) &&
				(!$scope.filter.criticalStrike || 0 <= item.tags.indexOf("CriticalStrike")) &&
				(!$scope.filter.attackSpeed || 0 <= item.tags.indexOf("AttackSpeed")) &&
				(!$scope.filter.lifeSteal || 0 <= item.tags.indexOf("LifeSteal")) &&
				(!$scope.filter.abilityPower || 0 <= item.tags.indexOf("SpellDamage")) &&
				(!$scope.filter.cooldownReduction || 0 <= item.tags.indexOf("CooldownReduction")) &&
				(!$scope.filter.spellVamp || 0 <= item.tags.indexOf("SpellVamp")) &&
				(!$scope.filter.mana || 0 <= item.tags.indexOf("Mana")) &&
				(!$scope.filter.manaRegen || 0 <= item.tags.indexOf("ManaRegen")) &&
				(!$scope.filter.boots || item.isBoots) &&
				(!$scope.filter.otherMovementItems || 0 <= item.tags.indexOf("NonbootsMovement"));
		};

		// Helper to construct the item url for browsing to a specific item.
		$scope.getItemUrl = itemsService.getItemUrl;

		// Helper to get the item image for display.
		$scope.getItemImage = riotResourceService.getItemImageUrl;
	}]);

	// The controller used to display item information. This controller listens
	// for global changes to the region and team filters and will update its
	// data when they change.
	ItemsModule.controller('ItemController', ['$scope', '$rootScope', '$routeParams', '$sce', 'riotResourceService', 'dataService', function($scope, $rootScope, $routeParams, $sce, riotResourceService, dataService) {
		// Perform the async request to fetch the item info which is
		// needed before the refresh can occur.
		riotResourceService.getItemAsync($routeParams.itemId).then(function(item) {
			$scope.item = item;
			$scope.trustedDescription = $sce.trustAsHtml(item.description);

			// Update the image url for the item.
			$scope.itemImageUrl = (riotResourceService.baseImageUrl + "item/" + $scope.item.image.full);

			$scope.refresh();
		});

		$scope.winRateChartColors = winRateChartColors;

		// Utility to reset scope data.
		var resetData = function() {
			$scope.winRatesOverTimeChart = [{key:'',values:[[0,0]]}];
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
			}).then(function(data) {
				$scope.itemStats = data;
			});

			// Perform the async request to fetch the item win
			// rates over real world time.
			dataService.getDataAsync({
				dataSource: 'ItemWinRatesOverTime',
				itemId: $scope.item.id,
			}).then(function(data) {
				$scope.ItemWinRatesOverTime = data;

				$scope.winRatesOverTimeChart = dataService.buildWinLossChartData(data, {
					timeFunction: dataService.unpackMonthDayHourTime
				});
			});

			dataService.getDataAsync({
				dataSource: 'ItemPerMinuteWinRates',
				itemId: $scope.item.id,
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
})();