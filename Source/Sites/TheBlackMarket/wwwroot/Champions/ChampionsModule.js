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
		'nvd3ChartDirectives',
		"com.2fdevs.videogular"]);

	// Constants
	var kdaColors = ['blue', 'green', 'red'];
	var killChartColors = ['blue', 'cyan', 'green', 'orange', 'red'];
	var winRateChartColors = ['red', 'green'];

	var pentakillSoundTrack = [
		'/Music/Pentakills/01-Lightbringer.mp3',
		'/Music/Pentakills/02-DeathfireGrasp.mp3',
		'/Music/Pentakills/03-Ohmwrecker.mp3',
		'/Music/Pentakills/04-LastWhisper.mp3',
		'/Music/Pentakills/05-TheHexCore.mp3',
		'/Music/Pentakills/06-TheProphecy.mp3',
		'/Music/Pentakills/07-Thornmail.mp3',
		'/Music/Pentakills/08-OrbOfWinter.mp3',
	];

	var customSkinSounds = {
		// Annie
		1: {
			skins: {
				8: ['/Music/AnniePanda.mp3']
			}
		},
		// Olaf
		2: {
			skins: {
				4: pentakillSoundTrack
			}
		},
		// Galio
		3: {
			skins: {
				4: ['/Music/GalioUnderworld.mp3']
			}
		},
		// Xin Xhao
		5: {
			skins: {
				5: ['/Music/LunarRevel2013.mp3']
			}
		},
		// Kayle
		10: {
			skins: {
				6: ['/Music/KayleAetherWing.mp3']
			}
		},
		// Teemo
		17: {
			skins: {
				4: ['/Music/AstroTeemo.mp3'],
				8: ['/Music/TeemoOmegaSquad.mp3']
			}
		},
		// Warwick
		19: {
			skins: {
				2: ['/Music/UrfMode.mp3']
			}
		},
		// Miss Fortune
		21: {
			any: ['/Music/MissFortuneLoginMusic.mp3'],
			skins: {
				7: ['/Music/BitRush.mp3']
			}
		},
		// Ashe
		22: {
			any: ['/Music/Freljord.mp3']
		},
		// Tryndamere
		23: {
			skins: {
				6: ['/Music/LunarRevel2014.mp3']
			}
		},
		// Karthus
		30: {
			skins: {
				4: pentakillSoundTrack
			}
		},
		// Cho'gath
		31: {
			skins: {
				5: ['/Music/ChogathBattleCast.mp3']
			}
		},
		// Dr. Mundo
		36: {
			skins: {
				8: ['/Music/PoolParty.mp3']
			}
		},
		// Sona
		37: {
			skins: {
				2: pentakillSoundTrack,
				4: [
					'/Music/LunarRevel2012.mp3'
				],
				5: [
					'/Music/BitRush.mp3'
				],
				6: [
					'/Music/DJSonaConcussive.mp3',
					'/Music/DJSonaEthereal.mp3',
					'/Music/DJSonaKinetic.mp3'
				]
			}
		},
		// Gankplank
		41: {
			any: ['/Music/GangplankLoginMusic.mp3']
		},
		// Corki
		42: {
			skins: {
				6: ['/Music/LunarRevel2013.mp3']
			}
		},
		// Veigar
		45: {
			any: ['/Music/VeigarLoginMusic.mp3']
		},
		// Katarina
		55: {
			skins: {
				8: ['/Music/JinxFirecracker.mp3']
			}
		},
		// Nocturne
		56: {
			any: ['/Music/NocturneLoginMusic.mp3'],
			skins: {
				5: ['/Music/NocturneEternum.mp3']
			}
		},
		// Renekton
		58: {
			skins: {
				6: ['/Music/PoolParty.mp3']
			}
		},
		// Jarvin
		59: {
			skins: {
				5: ['/Music/LunarRevel2013.mp3']
			}
		},
		// Wukong
		62: {
			skins: {
				3: ['/Music/LunarRevel2012.mp3']
			}
		},
		// Lee Sin
		64: {
			skins: {
				3: ['/Music/LunarRevel2012.mp3'],
				5: ['/Music/PoolParty.mp3']
			}
		},
		// Rumble
		68: {
			skins: {
				3: ['/Music/RumbleSuperGalaxyRumble.mp3']
			}
		},
		// Casseopia
		69: {
			skins: {
				4: ['/Music/LunarRevel2013.mp3']
			}
		},
		// Nasus
		75: {
			skins: {
				5: ['/Music/NasusInfernal.mp3']
			}
		},
		// Nidalee
		76: {
			skins: {
				7: ['/Music/JinxFirecracker.mp3']
			}
		},
		// Ezreal
		81: {
			skins: {
				5: ['/Music/EzrealPulsefire.mp3']
			}
		},
		// Mordekaiser (Hue hue hue!)
		82: {
			skins: {
				3: pentakillSoundTrack
			}
		},
		// Yorick
		83: {
			skins: {
				2: pentakillSoundTrack
			}
		},
		// Leona
		89: {
			skins: {
				4: ['/Music/PoolParty.mp3']
			}
		},
		// Talon
		91: {
			skins: {
				3: ['/Music/LunarRevel2012.mp3']
			}
		},
		// Riven
		92: {
			skins: {
				5: ['/Music/LunarRevel2014.mp3']
			}
		},
		// Graves
		104: {
			skins: {
				5: ['/Music/PoolParty.mp3']
			}
		},
		// Rengar
		107: {
			any: ['/Music/RengarLoginMusic.mp3']
		},
		// Varus
		110: {
			any: ['/Music/VarusLoginMusic.mp3']
		},
		// Lissandra
		113: {
			any: ['/Music/Freljord.mp3']
		},
		// Ziggs
		115: {
			skins: {
				3: ['/Music/PoolParty.mp3']
			}
		},
		// Lulu
		117: {
			any: ['/Music/LuluLoginMusic.mp3'],
			skins: {
				5: ['/Music/PoolParty.mp3']
			}
		},
		// Draven
		119: {
			any: ['/Music/DravenLoginMusic.mp3'],
			skins: {
				4: ['/Music/PoolParty.mp3']
			}
		},
		// Hecarim
		120: {
			any: ['/Music/HecarimLoginScreen.mp3']
		},
		// Diana
		121: {
			any: ['/Music/KhaZixLoginMusic.mp3']
		},
		// Darius
		122: {
			any: ['/Music/DariusLoginMusic.mp3']
		},
		// Jayce
		126: {
			any: ['/Music/JayceLoginMusic.mp3']
		},
		// Lissandra
		127: {
			any: ['/Music/Freljord.mp3']
		},
		// Diana
		131: {
			any: ['/Music/DianasLoginMusic.mp3'],
			skins: {
				2: ['/Music/LunarRevel2014.mp3']
			}
		},
		// Quinn and Valor
		133: {
			any: ['/Music/QuinnLoginMusic.mp3']
		},
		// Syndra
		134: {
			any: ['/Music/SyndraLoginMusic.mp3']
		},
		// Zyra
		143: {
			any: ['/Music/ZyraLoginMusic.mp3']
		},
		// Gnar
		150: {
			any: ['/Music/Gnar.mp3']
		},
		// Zac
		154: {
			any: ['/Music/ZacLoginMusic.mp3'],
			skins: {
				2: ['/Music/PoolParty.mp3']
			}
		},
		// Yasuo
		157: {
			any: ['/Music/YasuoLoginMusic.mp3']
		},
		// Vel'Koz
		161: {
			any: ['/Music/VelKozLoginMusic.mp3']
		},
		// Braum
		201: {
			any: ['/Music/BraumLoginMusic.mp3'],
		},
		// Jinx
		222: {
			any: ['/Music/JinxLoginMusic.mp3'],
			skins: {
				2: ['/Music/JinxFirecracker.mp3']
			}
		},
		// Tahm Kench
		223: {
			any: ['/Music/TahmKenchLoginMusic.mp3'],
		},
		// Lucian
		236: {
			any: ['/Music/LucianLoginMusic.mp3'],
		},
		// Zed
		238: {
			any: ['/Music/ZedLoginMusic.mp3']
		},
		// Ekko
		245: {
			any: ['/Music/EkkoLoginMusic.mp3', '/Music/EkkoSeconds.mp3'],
		},
		// Vi
		254: {
			any: ['/Music/ViLoginMusic.mp3'],
		},
		// Aatrox
		266: {
			any: ['/Music/AatroxLoginMusic.mp3'],
		},
		// Nami
		267: {
			any: ['/Music/NamiLoginMusic.mp3', '/Music/Nami.mp3'],
		},
		// Azir
		268: {
			any: ['/Music/AzirLoginMusic.mp3'],
		},
		// Kalista
		412: {
			any: ['/Music/ThreshLoginMusic.mp3']
		},
		// Kalista
		429: {
			any: ['/Music/KalistaLoginMusic.mp3']
		},
		// Rek'Sai
		421: {
			any: ['/Music/RekSaiLoginMusic.mp3'],
			skins: {
				2: ['/Music/PoolParty.mp3']
			}
		},
		// Bard
		432: {
			any: ['/Music/BardLoginMusic.mp3'],
		}
	};

	ChampionsModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/champions",
			name: "Champions",
			flag: '/Champions/ChampionsFlag.png',
			image: '/Champions/ChampionsMenu.png'
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
			.when('/champions/:championId/rivalries', {
				templateUrl: 'Champions/ChampionRivalries.html',
				controller: 'ChampionRivalriesController'
			})
			.when('/champions/:championId/objectives', {
				templateUrl: 'Champions/ChampionObjectives.html',
				controller: 'ChampionObjectivesController'
			})
			.when('/champions/:championId/masteries', {
				templateUrl: 'Champions/ChampionMasteries.html',
				controller: 'ChampionMasteriesController'
			})
			.when('/champions/:championId/runes', {
				templateUrl: 'Champions/ChampionRunes.html',
				controller: 'ChampionRunesController'
			});
	}]);

	// Service providing item related utilities
	ChampionsModule.service('championsService', ['$rootScope', 'riotResourceService', 'dataService', 'audioService', function($rootScope, riotResourceService, dataService, audioService) {
		this.activeChampion = 0;
		this.activeChampionSkinIndex = -1;
		this.activeChampionSplashImageUrl = null;
		this.activeChampionSound = null;
		this.activeChampionTrack = null;
		this.isNotSiteTrack = false;

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

		this.rerollChampionSkin = function(champion) {
			if (!champion) {
				return;
			}

			var skinCount = champion.skins.length;
			var skinIndex = -1;

			do {
				skinIndex = Math.floor(Math.random() * skinCount);
			} while (skinIndex == this.activeChampionSkinIndex);

			var skinInfo = champion.skins[skinIndex];

			//console.info("SKIN >>> " + skinIndex);

			if (audioService.playMusic) {
				this.activeChampionTrack = self.getChampionMusic(champion.key, skinIndex);

				if (this.activeChampionTrack) {
					audioService.playTrackOverride(this.activeChampionTrack, isSameChampionPage);
				} else {
					audioService.restoreTrack();
				}

				self.isNotSiteTrack = (self.activeChampionTrack !== undefined) && (audioService.siteTrack != self.activeChampionTrack);
			}

			self.activeChampionSkinIndex = skinIndex;
			self.activeChampionSplashImageUrl = riotResourceService.baseSharedImageUrl + 'champion/splash/' + champion.id + '_' + skinIndex + '.jpg';

			$rootScope.$broadcast('championsService.SkinChanged', {
				skinIndex: self.activeChampionSkinIndex,
				skinInfo: skinInfo,
				activeChampionSplashImageUrl: self.activeChampionSplashImageUrl
			});
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
					if (this.activeChampionSound) {
						var sound = this.activeChampionSound;
						sound.fade(sound.volume(), 0, 500);

						// Gaurantee a stop.
						setTimeout(function() {
							sound.stop();
						}, 550);
					}

					this.activeChampionSound = audioService.playSound({
						url: riotResourceService.baseLocalizedSoundUrl + 'champions/' + champion.id + '.mp3',
						volume: audioService.currentChampionSoundsVolume
					});
				}

				self.rerollChampionSkin(champion);
			}

			return true;
		};

		$rootScope.$on('$routeChangeSuccess', function(args, newLocation, oldLocation) {
			if (!isSameChampionPage(args, newLocation, oldLocation)) {
				self.activeChampion = 0;
				self.activeChampionSkinIndex = -1;
				self.activeChampionSplashImageUrl = null;
				self.activeChampionSound = null;
				self.activeChampionTrack = null;
				self.isNotSiteTrack = false;
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

	function initializeScope($scope, championsService, audioService) {
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

		$scope.rerollSkin = function() {
			championsService.rerollChampionSkin($scope.champion);
		}

		$scope.setSiteTrack = function() {
			if (championsService.activeChampionTrack) {
				audioService.setSiteTrack(championsService.activeChampionTrack);
			}
		}
	};

	function registerForGlobalEvents($scope, $rootScope, championsService, dataService) {
		$scope.showAllStats = dataService.showAllStats
		$scope.isNotSiteTrack = championsService.isNotSiteTrack;

		var unregisterRegionFilterChanged = $rootScope.$on('DataFilterService.RegionFilterChanged', function() {
			$scope.refresh();
		});

		var unregisterTeamFilterChanged = $rootScope.$on('DataFilterService.TeamFilterChanged', function() {
			$scope.refresh();
		});

		var unregisterShowAllStatsChanged = $rootScope.$on('DataFilterService.ShowAllStatsChanged', function() {
			$scope.showAllStats = dataService.showAllStats
		});

		var unregisterSkinChanged = $rootScope.$on('championsService.SkinChanged', function(sender, args) {
			$scope.championBackgroundUrl = args.activeChampionSplashImageUrl;
			$scope.isNotSiteTrack = championsService.isNotSiteTrack;
		});

		var unregisterSiteTrackChanged = $rootScope.$on('audioService.SiteTrackChanged', function(sender, args) {
			$scope.isNotSiteTrack = (args.siteTrack != championService.activeChampionTrack);
		});

		// Clean up so events don't leak.
		$scope.$on('$destroy', function() {
			unregisterRegionFilterChanged();
			unregisterTeamFilterChanged();
			unregisterShowAllStatsChanged();
			unregisterSkinChanged();
			unregisterSiteTrackChanged();
		});
	};

	// Controller used to provide a list of champions and allows
	// for sorting and filtering of the list.
	ChampionsModule.controller('ChampionListController', ['$scope', 'riotResourceService', 'dataService', 'audioService', function($scope, riotResourceService, dataService, audioService) {
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

		$scope.playSectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/champSelect/lockinchampion.mp3');
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
		$scope.getChampionImageUrl = riotResourceService.getChampionImageUrl;
	}]);

	ChampionsModule.controller('ChampionHeaderController', ['$scope', 'audioService', function($scope, audioService) {
		$scope.playSectionSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
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

				var neededChartKeys = ['timesPlayed', 'wins', 'winRate'];

				for (var i in neededChartKeys) {
					var key = neededChartKeys[i];
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

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService,  dataService);
	}]);

	ChampionsModule.controller('ChampionGoldController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService, audioService) {
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

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	ChampionsModule.controller('ChampionItemsController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'itemsService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, itemsService, championsService, audioService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.playItemSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

		$scope.itemsSortProperty = 'weightedWinRate';
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

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
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

	ChampionsModule.controller('ChampionCombatController', ['$scope', '$rootScope', '$routeParams', '$sce', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, $sce, riotResourceService, dataService, championsService, audioService) {
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
		$scope.videoTheme = '/Libraries/videogular-themes-default/videogular.css';

		$scope.isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			$scope.deathHeatMap = dataService.getDataPath({
				dataSource: 'DeathLocations',
				basePath: 'Images',
				type: 'png',
				useMerge: true,
				championId: $scope.champion.key
			});

			var deathVideoUrl = dataService.getDataPath({
				dataSource: 'DeathLocations',
				basePath: 'Videos',
				type: '',
				useMerge: true,
				championId: $scope.champion.key
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
				useMerge: true,
				championId: $scope.champion.key
			});

			var killVideoUrl = dataService.getDataPath({
				dataSource: 'KillLocations',
				basePath: 'Videos',
				type: '',
				useMerge: true,
				championId: $scope.champion.key
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

			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'ChampionStats',
				championId: $scope.champion.key,
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

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	ChampionsModule.controller('ChampionSkillsController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService, audioService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.playSkillSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

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

		$scope.getSkillImageUrl = riotResourceService.getSkillImageUrl;

		$scope.activeSkillInfo = { model: undefined };

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'ChampionPerMinuteSkillLevelUp',
				championId: $scope.champion.key,
			}).then(function(data) {
				var skillInfos = [];

				for (var i = 0; i < data.skills.length; ++i) {
					var skillData = data.skills[i];
					var skillSlot = skillData.skillSlot;

					skillInfos.push({
						skill: $scope.champion.spells[skillSlot - 1],
						chart: dataService.buildWinLossChartData(skillData)
					});
				}

				$scope.skillInfos = skillInfos;
				$scope.activeSkillInfo.model = skillInfos[0];
			});
		};

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	var buildingIdMap = {
		bn1: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'Nexus Turret'
		},
		bn2: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'Nexus Turret'
		},
		rn1: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'Nexus Turret'
		},
		rn2: {
			lane: 'MID_LANE',
			type: 'NEXUS_TURRET',
			name: 'Nexus Turret'
		},
		btb: {
			lane: 'TOP_LANE',
			type: 'BASE_TURRET',
			name: 'Top Base Turret'
		},
		rtb: {
			lane: 'TOP_LANE',
			type: 'BASE_TURRET',
			name: 'Top Base Turret'
		},
		bti: {
			lane: 'TOP_LANE',
			type: 'INNER_TURRET',
			name: 'Top Inner Turret'
		},
		rti: {
			lane: 'TOP_LANE',
			type: 'INNER_TURRET',
			name: 'Top Inner Turret'
		},
		bto: {
			lane: 'TOP_LANE',
			type: 'OUTER_TURRET',
			name: 'Top Outer Turret'
		},
		rto: {
			lane: 'TOP_LANE',
			type: 'OUTER_TURRET',
			name: 'Top Outer Turret'
		},
		bmb: {
			lane: 'MID_LANE',
			type: 'BASE_TURRET',
			name: 'Mid Base Turret'
		},
		rmb: {
			lane: 'MID_LANE',
			type: 'BASE_TURRET',
			name: 'Middle Base Turret'
		},
		bmi: {
			lane: 'MID_LANE',
			type: 'INNER_TURRET',
			name: 'Middle Inner Turret'
		},
		rmi: {
			lane: 'MID_LANE',
			type: 'INNER_TURRET',
			name: 'Middle Inner Turret'
		},
		bmo: {
			lane: 'MID_LANE',
			type: 'OUTER_TURRET',
			name: 'Middle Outer Turret'
		},
		rmo: {
			lane: 'MID_LANE',
			type: 'OUTER_TURRET',
			name: 'Middle Outer Turret'
		},
		bbb: {
			lane: 'BOT_LANE',
			type: 'BASE_TURRET',
			name: 'Bottom Base Turret'
		},
		rbb: {
			lane: 'BOT_LANE',
			type: 'BASE_TURRET',
			name: 'Bottom Base Turret'
		},
		bbi: {
			lane: 'BOT_LANE',
			type: 'INNER_TURRET',
			name: 'Bottom Inner Turret'
		},
		rbi: {
			lane: 'BOT_LANE',
			type: 'INNER_TURRET',
			name: 'Bottom Inner Turret'
		},
		bbo: {
			lane: 'BOT_LANE',
			type: 'OUTER_TURRET',
			name: 'Bottom Outer Turret'
		},
		rbo: {
			lane: 'BOT_LANE',
			type: 'OUTER_TURRET',
			name: 'Bottom Outer Turret'
		},
	};

	ChampionsModule.controller('ChampionObjectivesController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService, audioService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.playSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

		$scope.selectedObjective = 'bn1';

		var updateSelectedInfo = function() {
			$scope.selectedObjectImageUrl = '/Blank.png';

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
					$scope.selectedObjectName = "Baron Nashor";
					$scope.selectedObjectImageUrl = '/BaronNashor.png';
				} else {
					monsterType = "DRAGON";
					$scope.selectedObjectName = "Dragon";
					$scope.selectedObjectImageUrl = '/Dragon.png';
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
				dataSource: 'ChampionStats',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.championStats = data;
			});

			dataService.getDataAsync({
				dataSource: 'ChampionStatsOverTime',
				championId: $scope.champion.key,
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
				dataSource: 'BuildingKill',
				championId: $scope.champion.key
			}).then(function(data) {
				$scope.buildingStats = data;
				updateSelectedInfo();
			});

			dataService.getDataAsync({
				dataSource: 'BuildingPerMinuteKill',
				championId: $scope.champion.key
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
				dataSource: 'EliteMonsterKill',
				championId: $scope.champion.key
			}).then(function(data) {
				$scope.eliteMonsterInfo = data;
				updateSelectedInfo();
			});

			dataService.getDataAsync({
				dataSource: 'EliteMonsterPerMinuteKill',
				championId: $scope.champion.key
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

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	ChampionsModule.controller('ChampionRivalriesController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService, audioService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.playSectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/champSelect/lockinchampion.mp3');
			}
		};

		$scope.getChampionUrl = function(champion) {
			if (champion) {
				return "#/champions/" + champion.key;
			}

			return "#/champions/" + $scope.champion.key + "/rivalries";
		};

		$scope.getChampionImageUrl = function(champion) {
			if (champion) {
				return riotResourceService.getChampionImageUrl(champion);
			}

			return '/Champions/Minion.png';
		}

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'NemesisStats',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.nemesis = data.nemesis;
			});

			// Get the champion statistics.
			dataService.getDataAsync({
				dataSource: 'VictimStats',
				championId: $scope.champion.key,
			}).then(function(data) {
				$scope.victims = data.victims;
			});
		};

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	ChampionsModule.controller('ChampionMasteriesController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService, audioService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.playSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

		$scope.getMasteryImageUrl = riotResourceService.getMasteryImageUrl;

		var refreshRankBars = function() {
			var rankBars = [];

			if ($scope.activeMasteryInfo && $scope.activeMasteryInfo.ranks) {
				for (var i = 0; i < $scope.activeMasteryInfo.ranks.length; ++i) {
					var rank = $scope.activeMasteryInfo.ranks[i];
					var losses = rank.timesUsed - rank.timesWon;

					rankBars.push([
						{
							value: Math.round(100 * (losses / rank.timesUsed)),
							type: 'danger',
							rawvalue: losses
						},
						{
							value: Math.round(100 * (rank.timesWon / rank.timesUsed)),
							type: 'success',
							rawvalue: rank.timesWon
						}
					]);
				}
			}

			$scope.activeRankBars = rankBars;
		};

		$scope.$watch('activeMasteryInfo', refreshRankBars);

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			riotResourceService.getMasteryTreesAsync().then(function(rawMasteryTrees) {
				dataService.getDataAsync({
					dataSource: 'SummonerMasteriesUse',
					championId: $scope.champion.key,
				}).then(function(data) {
					var activeMasteryInfo = $scope.activeMasteryInfo || {};

					var masteryTrees = {};
					var masteryTreeNames = ["Offense", "Defense", "Utility"];

					for (var treeName in rawMasteryTrees) {
						var tree = rawMasteryTrees[treeName];
						var lowerTreeName = treeName.toLowerCase();
						var currentTree = masteryTrees[lowerTreeName] = {
							slots: []
						};

						for (var j = 0; j < tree.length; ++j) {
							var row = tree[j];

							for (var k = 0; k < 4; ++k) {
								var masteryEntry = row[k];

								if (masteryEntry) {
									var masteryInfo = data.masteries[masteryEntry.masteryId];
									currentTree.slots.push(masteryInfo);

									if (masteryInfo.mastery == activeMasteryInfo.mastery) {
										activeMasteryInfo = masteryInfo;
									}									
								} else {
									currentTree.slots.push(null);
								}
							}
						}
					}

					$scope.masteryTrees = masteryTrees;
					$scope.activeMasteryInfo = activeMasteryInfo;
				});
			});
		};

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	ChampionsModule.controller('ChampionRunesController', ['$scope', '$rootScope', '$routeParams', 'riotResourceService', 'dataService', 'championsService', 'audioService', function($scope, $rootScope, $routeParams, riotResourceService, dataService, championsService, audioService) {
		// Request the full champion information before continuing.
		riotResourceService.getFullChampionInfoAsync($routeParams.championId).then(function(fullChampionInfo) {
			if (!championsService.enterChampionSection(fullChampionInfo)) {
				return;
			}

			$scope.champion = fullChampionInfo;
			$scope.championBackgroundUrl = championsService.activeChampionSplashImageUrl;
			$scope.refresh();
		});

		$scope.playSelectionSound = function() {
			if (audioService.playSounds) {
				audioService.playSound('/Sounds/newSounds/air_button_press_1.mp3');
			}
		};

		$scope.getRuneImageUrl = riotResourceService.getRuneImageUrl;
		$scope.nameFilter = "";
		$scope.filterTier = 3;
		$scope.filterType = "black";

		$scope.runeFilter = function(runeInfo) {
			return runeInfo && runeInfo.rune && runeInfo.rune.rune &&
				(runeInfo.rune.rune.tier == $scope.filterTier) &&
				(runeInfo.rune.rune.type == $scope.filterType) &&
				(($scope.nameFilter == "") || 0 <= runeInfo.rune.name.toLowerCase().indexOf($scope.nameFilter.toLowerCase()));
		};

		$scope.selectedQuint = { value: undefined };

		// The main function responsible for pulling the aggregate
		// data for the champion. This is invoked when the controller
		// loads and when the region or team filters change.
		$scope.refresh = function() {
			// Get the champion statistics.
			riotResourceService.getRunesAsync().then(function(runes) {
				dataService.getDataAsync({
					dataSource: 'SummonerRuneUse',
					championId: $scope.champion.key,
				}).then(function(data) {
					$scope.runeInfos = data.runes;
				});
			});
		};

		initializeScope($scope, championsService, audioService);
		registerForGlobalEvents($scope, $rootScope, championsService, dataService);
	}]);

	// This is needed for videogular. You can't have multiple videos in the same scope...
	ChampionsModule.controller('DummyController', function() { });
})();