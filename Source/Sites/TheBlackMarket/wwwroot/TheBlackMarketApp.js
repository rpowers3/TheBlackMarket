'use strict';
(function() {
	var TheBlackMarketAppModule = angular.module('TheBlackMarketApp', [
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap',
		'ui.checkbox',
		'nvd3ChartDirectives',
		'LocalStorageModule',
		'TheBlackMarketSite',
		'Brawlers',
		'Buildings',
		'Champions',
		'Items',
		'Masteries',
		'Monsters',
		'Runes',
		'Warding']);

	TheBlackMarketAppModule.config(['$routeProvider', 'localStorageServiceProvider', function($routeProvider, localStorageServiceProvider) {
		// Configure local storage so site settings can be saved.
		localStorageServiceProvider
			.setPrefix('TheBlackMarket')
			.setStorageType('localStorage')
			.setNotify(true, true);

		$routeProvider
			.when('/', {
				templateUrl: 'Home.html',
			});
	}]);

	TheBlackMarketAppModule.filter('percentage', ['$filter', function($filter) {
		return function(input, decimals) {
			return $filter('number')(input * 100, decimals) + '%';
		};
	}]);

	// This service provide functionality to access the DataDragon data
	// for display League of Legends information.
	TheBlackMarketAppModule.service('riotResourceService', ['$http', '$q', function($http, $q) {
		var self = this;

		// TODO: It'd be nice to support a toggle to change the locale.
		//       Probably won't have time to implement this feature.
		this.language = 'en_US';

		// Construct the base urls to the static data. I'm using the data
		// dragon because the data we're looking at is static and isn't going
		// to change so there's no reason to make API calls to fetch this data.
		// Instead just grab the precanned JSON cause it already has everything
		// I need.
		this.baseUrl = 'http://ddragon.leagueoflegends.com/cdn/';
		this.baseVersionedUrl = this.baseUrl + '5.15.1/';
		this.baseDataUrl = this.baseVersionedUrl + 'data/' + this.language + '/';
		this.baseImageUrl = this.baseVersionedUrl + 'img/';
		this.baseSharedImageUrl = this.baseUrl + 'img/';

		this.baseSoundUrl = '/Sounds/';
		this.baseLocalizedSoundUrl = this.baseSoundUrl + this.language + '/';

		// Data storage for various league information. Everything is being
		// cached to save on bandwidth. If your browser chugs a little you might
		// need to refresh the page. ;)
		this.champions = null;
		this.championInfo = {};
		this.allItems = null;
		this.items = null;
		this.summonerSpells = null;
		this.masteries = null;
		this.runes = null;
		this.brawlers = null;
		this.brawlerUpgrades = null;
		this.blackMarketItems = null;
		this.filteredItems = null;

		// Gets the base list of champion data asynchronously.
		this.getChampionsAsync = function() {
			var deferred = $q.defer();

			if (self.champions) {
				deferred.resolve(self.champions);
			} else {
				$http.get(self.baseDataUrl + 'champion.json')
					.success(function(response) {
						self.champions = response.data;
						deferred.resolve(self.champions);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		this.getSkillImageUrl = function(skill) {
			if (!skill) {
				return;
			}

			return self.baseImageUrl + "spell/" + skill.image.full;
		};

		// Ids of items that aren't used on SR black market brawlers.
		var filteredIds = {
			1062: true, // Prospector's Blade
			1063: true, // Prospector's Ring
			1074: true, // Doran's shield (showdown)
			1075: true, // Doran's blade (showdown)
			2009: true, // Total Biscuit of Rejuvenation
			2047: true, // Oracle's Extract
			2050: true, // Explorer's ward
			2051: true, // Guardian's Horn
			2052: true, // Poro snax
			2054: true, // Diet poro snax
			3007: true, // Arcangel's (CS)
			3008: true, // Manamune (CS)
			3029: true, // Rod of Ages (S)
			3043: true, // Muramana (CS)
			3053: true, // Sterak's Gage
			3073: true, // Tear (CS)
			3084: true, // Overlord's Bloodmail.
			3090: true, // Wooglet's Witchcap.
			3104: true, // Lord Van Damm's Pillager
			3106: true, // Madred's Razors
			3122: true, // Wicked Hatchet
			3137: true, // Dervish Blade
			3154: true, // Wriggle's Lantern
			3159: true, // Grez's Spectral Lantern
			3170: true, // Moonflair Spellblade
			3180: true, // Odyn's Veil
			3185: true, // The Lightbringer
			3181: true, // Sanguine Blade
			3184: true, // Entropy
			3187: true, // Hextech Sweeper
			3196: true, // Base hexcore.
			3290: true, // Twin Shadows
			3345: true, // Soul Anchor
			3348: true, // Hextech Sweeper
			3460: true, // Golden transcendence
			3599: true, // The black spear.
			3901: true, // Fire at Will
			3902: true, // Death's Daughter
			3903: true, // Raise morale

		};

		// Ids of the brawlers.
		var blackMarketBrawlersIds = {
			3611: true,
			3612: true,
			3613: true,
			3614: true
		};

		// Ids of the black market brawler upgrades.
		var blackMarketBrawlerUpgradesIds = {
			3615: true,
			3616: true,
			3617: true,
			3621: true,
			3622: true,
			3623: true,
			3624: true,
			3625: true,
			3626: true
		};

		// Ids of black market brawler specific items.
		var blackMarketItemsIds = {
			1335: true, // x Teleport enchantment,
			1336: true, // x Teleport enchantment,
			1337: true, // x Teleport enchantment,
			1338: true, // x Teleport enchantment,
			1339: true, // x Teleport enchantment,
			1340: true, // x Teleport enchantment,
			1341: true, // x Teleport enchantment,

			3150: true, // x Mirage Blade
			3430: true, // x Rite of ruin,
			3431: true, // x Netherstride Grimoire
			3433: true, // x Lost Chapter,
			3434: true, // x Pox Arcana
			3652: true, // x Typhoon Claws
			3742: true, // x Dead man's plate
			3744: true, // x Staff of flowing water
			3745: true, // x Puppeteer
			3829: true, // x Trickster's Glass
			3840: true, // x Globe of Trust
			3841: true, // x Swindler's Orb
			3844: true, // x Murksphere
			3911: true, // x Marty's Gamit
			3924: true, // x Flesheater
		};

		// The cost in krakens for the black market items.
		var krakens = {
			3611: 5,
			3612: 5,
			3613: 5,
			3614: 5,

			3615: 5,
			3616: 10,
			3617: 20,
			3621: 5,
			3622: 10,
			3623: 20,
			3624: 5,
			3625: 10,
			3626: 20
		};

		// Tag all boots (regardless of enchantments) as boots.
		var isBoots = {
			// Base boot types.
			1001: true, 3006: true, 3009: true, 3020: true, 3047: true,
			3111: true, 3117: true, 3158: true,

			// Enchanted boot types.
			1300: true, 1301: true, 1302: true, 1303: true, 1304: true,
			1305: true, 1306: true, 1307: true, 1308: true, 1309: true,
			1310: true, 1311: true, 1312: true, 1313: true, 1314: true,
			1315: true, 1316: true, 1317: true, 1318: true, 1319: true,
			1320: true, 1321: true, 1322: true, 1323: true, 1324: true,
			1325: true, 1326: true, 1327: true, 1328: true, 1329: true,
			1330: true, 1331: true, 1332: true, 1333: true, 1334: true,

			// Teleport enchantment.
			1335: true, 1336: true, 1337: true, 1338: true, 1339: true,
			1340: true, 1341: true
		};

		// Utility function that takes the raw items and processes them by
		// tagging with type information and sorting into different arrays
		// so they can be fetched independently.
		var initializeItemArrays = function(rawItems) {
			var items = [];
			var brawlers = [];
			var brawlerUpgrades = [];
			var blackMarketItems = [];
			var allItems = [];
			var filteredItems = [];

			for (var itemId in rawItems) {
				var item = rawItems[itemId];
				item.id = itemId;

				if (isBoots[itemId]) {
					item.isBoots = true;
				}

				if (krakens[itemId]) {
					item.krakens = krakens[itemId];
				}

				if (filteredIds[itemId]) {
					item.isFilteredItem = true;
					filteredItems.push(item);
					allItems.push(item);
				} else if (blackMarketBrawlersIds[itemId]) {
					item.isBrawler = true;
					brawlers.push(item);
					allItems.push(item);
				} else if (blackMarketBrawlerUpgradesIds[itemId]) {
					item.isBrawlerUpgrade = true;
					brawlerUpgrades.push(item);
					allItems.push(item);
				} else if (blackMarketItemsIds[itemId]) {
					item.isBlackMartetItem = true;
					allItems.push(item);
					blackMarketItems.push(item);
					items.push(item);
				} else {
					item.isNormalItem = true;
					items.push(item);
					allItems.push(item);
				}
			}

			self.items = items;
			self.brawlers = brawlers;
			self.brawlerUpgrades = brawlerUpgrades;
			self.blackMarketItems = blackMarketItems;
			self.allItems = allItems;
			self.filteredItems = filteredItems;
		};

		// Gets the list of ALL items asynchronously.
		this.getAllItemsAsync = function() {
			var deferred = $q.defer();

			if (self.allItems) {
				deferred.resolve(self.allItems);
			} else {
				$http.get(self.baseDataUrl + 'item.json')
					.success(function(response) {
						initializeItemArrays(response.data);
						deferred.resolve(self.allItems);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets the list of items upgrades asynchronously. This list
		// excludes brawlers, brawler upgrades,  and items filtered
		// out as not being part of SR.
		this.getItemsAsync = function() {
			var deferred = $q.defer();

			if (self.items) {
				deferred.resolve(self.items);
			} else {
				$http.get(self.baseDataUrl + 'item.json')
					.success(function(response) {
						initializeItemArrays(response.data);
						deferred.resolve(self.items);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets the list of brawlers asynchronously.
		this.getBrawlersAsync = function() {
			var deferred = $q.defer();

			if (self.brawlers) {
				deferred.resolve(self.brawlers);
			} else {
				$http.get(self.baseDataUrl + 'item.json')
					.success(function(response) {
						initializeItemArrays(response.data);
						deferred.resolve(self.brawlers);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets the list of brawler upgrades asynchronously.
		this.getBrawlerUpgradesAsync = function() {
			var deferred = $q.defer();

			if (self.brawlerUpgrades) {
				deferred.resolve(self.brawlerUpgrades);
			} else {
				$http.get(self.baseDataUrl + 'item.json')
					.success(function(response) {
						initializeItemArrays(response.data);
						deferred.resolve(self.brawlerUpgrades);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets the list of brawler upgrades asynchronously.
		this.getBlackMarketItemsAsync = function() {
			var deferred = $q.defer();

			if (self.blackMarketItems) {
				deferred.resolve(self.blackMarketItems);
			} else {
				$http.get(self.baseDataUrl + 'item.json')
					.success(function(response) {
						initializeItemArrays(response.data);
						deferred.resolve(self.blackMarketItems);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets an item by its unique item id.
		this.getItem = function(itemId) {
			if (!self.allItems) {
				return;
			}

			var foundItem;
			for (var index in self.allItems) {
				var item = self.allItems[index];

				if (item.id == itemId) {
					foundItem = item;
					break;
				}
			}

			return foundItem;
		};

		// Gets an item by its unique item id asynchronously.
		this.getItemAsync = function(itemId) {
			var deferred = $q.defer();

			self.getAllItemsAsync().then(function(items) {
				deferred.resolve(self.getItem(itemId));
			}, function(msg) {
				deferred.reject(msg);
			});

			return deferred.promise;
		};

		// Gets the url for an item.
		this.getItemImageUrl = function(item) {
			if (typeof item == "number") {
				item = self.getItem(item);

				if (!item) {
					return '#';
				}
			}

			return self.baseImageUrl + "item/" + item.image.full;
		};

		// Gets an item by its unique item id.
		this.getSummonerSpell = function(summonerSpellId) {
			if (!self.summonerSpells) {
				return;
			}

			var foundItem;
			for (var index in self.summonerSpells) {
				var summonerSpell = self.summonerSpells[index];

				if (summonerSpell.key == summonerSpellId) {
					foundItem = summonerSpell;
					break;
				}
			}

			return foundItem;
		};

		// Gets the list of summoner spells asynchronously.
		this.getSummonerSpellsAsync = function() {
			var deferred = $q.defer();

			if (self.summonerSpells) {
				deferred.resolve(self.summonerSpells);
			} else {
				$http.get(self.baseDataUrl + 'summoner.json')
					.success(function(response) {
						self.summonerSpells = response.data;
						deferred.resolve(self.summonerSpells);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		this.getSummonerSpellImageUrl = function(summonerSpell) {
			if (typeof summonerSpell == "number") {
				summonerSpell = self.getSummonerSpell(summonerSpell);

				if (!summonerSpell) {
					return '#';
				}
			}

			return self.baseImageUrl + "spell/" + summonerSpell.image.full;
		};

		// Gets the list of masteries asynchronously.
		this.getMasteriesAsync = function() {
			var deferred = $q.defer();

			if (self.masteries) {
				deferred.resolve(self.masteries);
			} else {
				$http.get(self.baseDataUrl + 'mastery.json')
					.success(function(response) {
						self.masteries = response.data;
						deferred.resolve(self.masteries);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets the list of runes asynchronously.
		this.getRunesAsync = function() {
			var deferred = $q.defer();

			if (self.runes) {
				deferred.resolve(self.runes);
			} else {
				$http.get(self.baseDataUrl + 'rune.json')
					.success(function(response) {
						self.runes = response.data;
						deferred.resolve(self.runes);
					})
					.error(function(msg, code) {
						deferred.reject(msg);
					});
			}

			return deferred.promise;
		};

		// Gets a champion by their unique champion Id. If the base champion
		// information has not already been loaded this will return undefined.
		this.getChampionById = function(championId) {
			if (!self.champions) {
				return;
			}

			for (var key in self.champions) {
				var champion = self.champions[key];

				if (champion.key == championId) {
					return champion;
				}
			}
		};

		// Gets the base champion information from the champion Id.
		// This Id is the champions unique number.
		this.getChampionByIdAsync = function(championId) {
			var deferred = $q.defer();

			if (self.champions) {
				deferred.resolve(self.getChampionById(championId));
			} else {
				self.getChampionsAsync().then(function(champions) {
					deferred.resolve(self.getChampionById(championId));
				}, function(msg, code) {
					deferred.reject(msg);
				});
			}

			return deferred.promise;
		};

		// Gets the full champion information from the champion Id.
		// This Id is the champions unique number.
		this.getFullChampionInfoAsync = function(championId) {
			var fullChampionInfo = self.championInfo[championId];

			var deferred = $q.defer();

			if (fullChampionInfo) {
				deferred.resolve(fullChampionInfo);
			} else {
				var championSummary = self.getChampionByIdAsync(championId).then(function(champion) {
					$http.get(self.baseDataUrl + 'champion/' + champion.id + '.json')
						.success(function(response) {
							var fullChampionInfo = response.data[champion.id]
							self.championInfo[championId] = fullChampionInfo;
							deferred.resolve(fullChampionInfo);
						})
						.error(function(msg, code) {
							deferred.reject(msg);
						});
				}, function(msg) {
					deferred.reject(msg);
				});
			}

			return deferred.promise;
		};
	}]);

	// The service for playing audio
	TheBlackMarketAppModule.service('audioService', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
		var initialTrack = '/Music/GangplankLoginMusic.mp3';
		var fadeDuration = 2000;
		var currentVolume = 1;

		this.musicTracks = [];
		this.sounds = [];
		this.currentTrack = null;
		this.overridenTrack = null;
		this.currentTrackIsOverride = false;
		this.keepOverrideCheck = null;

		var tracks = [
			'/Music/AatroxLoginMusic.mp3',
			'/Music/Apollo_Login_Music_v1.mp3',
			'/Music/AzirLoginMusic.mp3',
			'/Music/BardLoginMusic.mp3',
			'/Music/BlitzCrankBitRush.mp3',
			'/Music/BraumLoginMusic.mp3',
			'/Music/ChogathBattleCast.mp3',
			'/Music/DariusLoginMusic.mp3',
			'/Music/Dark_Sovereign_Music_v2.mp3',
			'/Music/DianasLoginMusic.mp3',
			'/Music/DJSonaConcussive.mp3',
			'/Music/DJSonaEthereal.mp3',
			'/Music/DJSonaKinetic.mp3',
			'/Music/DravenLoginMusic.mp3',
			'/Music/EkkoLoginMusic.mp3',
			'/Music/EkkoSeconds.mp3',
			'/Music/EzrealPulsefire.mp3',
			'/Music/Freljord.mp3',
			'/Music/GalioUnderworld.mp3',
			'/Music/GangplankLoginMusic.mp3',
			'/Music/Gnar.mp3',
			'/Music/JinxLoginMusic.mp3',
			'/Music/KalistaLoginMusic.mp3',
			'/Music/KhaZixLoginMusic.mp3',
			'/Music/LucianLoginMusic.mp3',
			'/Music/LuluLoginMusic.mp3',
			'/Music/LunarReveal.mp3',
			'/Music/MissFortuneLoginMusic.mp3',
			'/Music/Nami.mp3',
			'/Music/NamiLoginMusic.mp3',
			'/Music/NasusInfernal.mp3',
			'/Music/NocturneLoginMusic.mp3',
			'/Music/PoolParty.mp3',
			'/Music/QuinnLoginMusic.mp3',
			'/Music/RekSaiLoginMusic.mp3',
			'/Music/RengarLoginMusic.mp3',
			'/Music/RumbleSuperGalaxyRumble.mp3',
			'/Music/TahmKenchLoginMusic.mp3',
			'/Music/TeemoOmegaSquad.mp3',
			'/Music/ThreshLoginMusic.mp3',
			'/Music/UrfMode.mp3',
			'/Music/VarusLoginMusic.mp3',
			'/Music/VeigarLoginMusic.mp3',
			'/Music/VelKozLoginMusic.mp3',
			'/Music/ViLoginMusic.mp3',
			'/Music/YasuoLoginMusic.mp3',
			'/Music/ZacLoginMusic.mp3',
			'/Music/ZedLoginMusic.mp3',
			'/Music/ZyraLoginMusic.mp3',
		];

		var self = this;

		// Sets wether sound effects are enabled.
		this.setSoundsEnabled = function(value) {
			self.playSounds = !!value;
			localStorageService.set('Audio.PlaySounds', self.playSounds);
		};

		// Sets wether champion sound effects are enabled.
		this.setChampionSoundsEnabled = function(value) {
			self.playChampionSounds = !!value;
			localStorageService.set('Audio.PlayChampionSounds', self.playChampionSounds);
		};

		// Sets wether music is enabled.
		this.setMusicEnabled = function(value) {
			value = !!value;

			if (value == self.playMusic) {
				return;
			}

			self.playMusic = value;
			localStorageService.set('Audio.PlayMusic', self.playMusic);

			if (self.musicInterval) {
				clearInterval(self.musicInterval);
				self.musicInterval = 0;
			}

			if (!value) {
				self.fadeOutAllTracks();
			} else {
				self.playTrack(initialTrack);
				//self.playRandomSong();
				//self.musicInterval = setInterval(self.playRandomSong, 10000);
			}
		};

		// Toggles sounds on and off.
		this.toggleSounds = function() {
			self.setSoundsEnabled(!self.playSounds);
		};

		// Toggles champion sounds on and off.
		this.toggleChampionSounds = function() {
			self.setChampionSoundsEnabled(!self.playChampionSounds);
		};

		// Toggles music on and off.
		this.toggleMusic = function() {
			self.setMusicEnabled(!self.playMusic);
		};

		this.playRandomSong = function() {
			var newTrack = tracks[Math.floor(Math.random() * tracks.length)];
			self.playTrack(newTrack);
		};

		this.playTrack = function(url) {
			this.fadeOutAllTracks();

			var musicTrack = new Howl({
				urls: [url],
				autoplay: true,
				loop: true,
				volume: 0,
				onend: function() {
					self.removeTrack(musicTrack);
				}
			});

			musicTrack.fade(0, currentVolume, fadeDuration);

			self.currentTrack = musicTrack;
			self.currentTrackIsOverride = false;

			self.musicTracks.push(musicTrack);
		};

		this.playTrackOverride = function(url, keepOverrideCheck) {
			if (!self.currentTrackIsOverride) {
				self.overridenTrack = self.currentTrack;

				if (self.overridenTrack) {
					self.overridenTrack.fade(self.overridenTrack.volume(), 0, fadeDuration);
					self.currentTrackIsOverride = true;
					self.keepOverrideCheck = keepOverrideCheck;

					setTimeout(function() {
						self.overridenTrack.pause();
					}, fadeDuration + 0.5);
				}
			}

			self.playTrack(url);
		};

		this.restoreTrack = function() {
			if (!self.overridenTrack) {
				return;
			}

			self.fadeOutAllTracks();
			self.overridenTrack.fade(0, currentVolume, fadeDuration);
			self.overridenTrack.play();

			self.currentTrack = self.overridenTrack;
			self.overridenTrack = null;
			self.keepOverrideCheck = null;
		};

		this.removeTrack = function(musicTrack) {
			var index = self.musicTracks.indexOf(musicTrack);

			if (index > -1) {
				self.musicTracks.splice(index, 1);
			}

			if (musicTrack == this.currentTrack) {
				this.currentTrack = null;
			}
		};

		this.stopAllTracks = function() {
			for (var i in self.musicTracks.slice(0)) {
				var musicTrack = self.musicTracks[i];
				musicTrack.stop();
			}

			self.musicTracks = [];
		};

		this.fadeOutAllTracks = function() {
			for (var i in self.musicTracks.slice(0)) {
				var oldMusicTrack = self.musicTracks[i];

				if (oldMusicTrack != self.overridenTrack) {
					(function(musicTrack) {
						musicTrack.fade(musicTrack.volume(), 0, fadeDuration);

						setTimeout(function() {
							// Force stop if it hasn't already.
							musicTrack.stop();
							self.removeTrack(musicTrack);
						}, fadeDuration + 0.5);
					})(oldMusicTrack);
				}
			}
		};

		this.playSound = function(url) {
			var sound = new Howl({
				urls: [url],
				autoplay: true,
				loop: false,
				volume: 1,
				onend: function() {
					self.removeSound(sound);
				}
			});

			self.sounds.push(sound);
		};

		this.stopAllSounds = function() {
			for (var i in self.sounds.slice(0)) {
				var sound = self.sounds[i];
				sound.stop();
			}

			self.sounds = [];
		};

		this.removeSound = function(sound) {
			var index = self.sounds.indexOf(sound);

			if (index > -1) {
				self.sounds.splice(index, 1);
			}
		};

		this.stopAllSounds = function() {
			for (var i in self.sounds.slice(0)) {
				var sound = self.sounds[i];
				sound.stop();
			}
		};

		this.stopAll = function() {
			self.stopAllTracks();
			self.stopAllSounds();
		};

		// Initializes the state of the audio settings from local storage
		// or defaults them to on.
		this.setSoundsEnabled((localStorageService.get('Audio.PlaySounds') === false) ? false : true);
		this.setChampionSoundsEnabled((localStorageService.get('Audio.PlayChampionSounds') === false) ? false : true);
		this.setMusicEnabled((localStorageService.get('Audio.PlayMusic') === false) ? false : true);

		$rootScope.$on('$routeChangeSuccess', function() {
			if (!self.keepOverrideCheck || !self.keepOverrideCheck.apply(this, arguments)) {
				self.restoreTrack();
			}
		});
	}]);

	// The data service is used to access the aggregated data from the
	// match histories provided by Riot. Data request are altered by
	// the current region and team filters to select only the aggreagate
	// data requested.
	TheBlackMarketAppModule.service('dataService', ['$rootScope', '$http', '$q', 'localStorageService', function($rootScope, $http, $q, localStorageService) {
		// The list of valid regions.
		this.validRegionFilters = ['ALL', 'BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR'];

		// The list of valid teams.
		this.validTeamFilters = ['Both', 'Blue', 'Red'];

		// Initializes the filters from local storage.
		this.regionFilter = localStorageService.get('Filter.Region') || 'ALL';
		this.teamFilter = localStorageService.get('Filter.Team') || 'Both';

		// Forcing true for now.
		this.showAllStats = true; //localStorageService.get('Filter.ShowAllStats');
		//this.showAllStats = (this.showAllStats === undefined) ? true : this.showAllStats;

		this.showFilters = !!localStorageService.get('Filter.ShowFilters');

		var self = this;

		var basePaths = {
			'json': "Json",
			'mp4': "Videos"
		};

		// Expand data based by type.
		var dataProcessors = {
			ChampionStatsOverTime: function(data) {
				data.winRate = [];
				data.kdaMin = [];
				data.kdaAvg = [];
				data.kdaMax = [];

				for (var i in data.times) {
					data.winRate.push(data.wins[i] / data.timesPlayed[i]);

					data.kdaMin.push((data.killsMin + data.assistsMin) / data.deathsMin);
					data.kdaAvg.push((data.killsAvg + data.assistsAvg) / data.deathsAvg);
					data.kdaMax.push((data.killsMax + data.assistsMax) / data.deathsMax);
				}
			}
		};

		// Generates the path used to access the region/team specific
		// data.
		this.getDataPath = function(options) {
			var suffix = '';
			var filename = '';

			if (options.isGlobal) {
				suffix += 'G';
				filename += 'global';
			}

			if (self.regionFilter != 'ALL') {
				suffix += 'R';
				filename += 'r' + self.regionFilter;
			}

			if (self.teamFilter != 'Both') {
				if (self.teamFilter == 'Blue') {
					suffix += 'T';
					filename += 't100';
				} else if (self.teamFilter == 'Red') {
					suffix += 'T';
					filename += 't200';
				}
			}

			if (options.championId) {
				suffix += 'C';
				filename += 'c' + options.championId;
			}

			if (options.itemId) {
				suffix += 'I';
				filename += 'i' + options.itemId;
			}

			if ((self.teamFilter == 'Both') && options.useMerge) {
				suffix += 'M';
			}

			if (suffix == '') {
				suffix += 'G';
				filename += 'global';
			}

			var type = (options.type || 'json').toLowerCase();
			var basePath = basePaths[type];

			return basePath + '/' + options.dataSource + suffix + '/' + filename + '.' + type;
		};

		// Performs a data request for aggregate data.
		this.getDataAsync = function(options) {
			var deferred = $q.defer();

			var dataPath = this.getDataPath(options);

			$http.get(dataPath, { cache: true })
				.success(function(response) {
					var processor = dataProcessors[options.dataSource];

					if (processor) {
						processor(response);
					}

					deferred.resolve(response);
				})
				.error(function(msg, code) {
					deferred.reject(msg);
				});

			return deferred.promise;
		};

		// Validates and sets the region filter, persisting the change
		// to locale storage. This raises an event so controllers can
		// refresh.
		this.setRegionFilter = function(regionFilter) {
			if (self.validRegionFilters.indexOf(regionFilter) == -1) {
				regionFilter = self.validRegionFilters[0];
			}

			localStorageService.set('Filter.Region', regionFilter);
			self.regionFilter = regionFilter;

			$rootScope.$broadcast('DataFilterService.RegionFilterChanged', { newValue: regionFilter });
		};

		// Validates and sets the team filter, persisting the change
		// to locale storage. This raises an event so controllers can
		// refresh.
		this.setTeamFilter = function(teamFilter) {
			if (self.validTeamFilters.indexOf(teamFilter) == -1) {
				teamFilter = self.validTeamFilters[0];
			}

			localStorageService.set('Filter.Team', teamFilter);
			self.teamFilter = teamFilter;

			$rootScope.$broadcast('DataFilterService.TeamFilterChanged', { newValue: teamFilter });
		};

		// Sets the flag indicating if all stats should be shown and
		// persists the value to locale storage. This raises an event
		// so controllers can refresh.
		this.setShowAllStats = function(showAllStats) {
			showAllStats = !!showAllStats;

			localStorageService.set('Filter.ShowAllStats', showAllStats);
			self.showAllStats = showAllStats;

			$rootScope.$broadcast('DataFilterService.ShowAllStatsChanged', { newValue: showAllStats });
		};

		// Sets the flag indicating if filters should be shown and
		// persists the value to locale storage. This raises an event
		// so controllers can refresh.
		this.setShowFilters = function(showFilters) {
			showFilters = !!showFilters;

			localStorageService.set('Filter.ShowFilters', showFilters);
			self.showFilters = showFilters;

			$rootScope.$broadcast('DataFilterService.ShowFiltersChanged', { newValue: showFilters });
		};

		// Utility function to unpack time that was stored as
		// a packed number of MMDDHH.
		this.unpackMonthDayHourTime = function(rawTime) {
			var month = Math.floor(rawTime / 10000);
			var day = Math.floor(rawTime / 100) % 100;
			var hour = rawTime % 100;
			return new Date(2015, month - 1, day, hour);
		};

		// Known array keys for total and win values in the JSON
		// data.
		var knownTotalKeys = ["total", "timesUsed", "count", "bought", "leveledUp"];
		var knownWinKeys = ["wins", "timesWon"];

		// Search for a key in the data and return its name if
		// found.
		var detectKey = function(data, keys) {
			for (var keyIndex in keys) {
				var key = keys[keyIndex];
				if (data[key]) {
					return key;
				}
			}
		};

		// Takes the compact JSON data and expands it into a format that D3
		// can utilize for chart data.
		this.buildWinLossChartData = function(data, options) {
			options = options || {};

			var winLossChartData = [
				{
					key: options.lossesTitle || "Losses",
					values: [],
					color: '#FF0000'
				},
				{
					key: options.winsTitle || "Wins",
					values: [],
					color: '#009900'
				},
			];

			var timeFunction = options.timeFunction || function(x) { return x; };
			var timeKey = options.timeKey || "times";
			var totalKey = options.totalKey || detectKey(data, knownTotalKeys) || "total";
			var winKey = options.winKey || detectKey(data, knownWinKeys) || "timesWon";

			for (var i = 0; i < data.times.length; ++i) {
				var rawTime = data[timeKey][i];
				var time = timeFunction(rawTime);
				var total = data[totalKey][i];
				var wins = data[winKey][i];
				var losses = total - wins;

				winLossChartData[0].values.push([time, losses]);
				winLossChartData[1].values.push([time, wins]);
			}

			return winLossChartData;
		};
	}]);

	// Simple controller that provides the menu area with the list of
	// registered site sections.
	TheBlackMarketAppModule.controller('MenuController', ['$scope', 'theBlackMarketSite', function($scope, theBlackMarketSite) {
		theBlackMarketSite.sections.sort(function(a, b) {
			return a.name.localeCompare(b.name);
		});

		$scope.sections = theBlackMarketSite.sections;
	}]);

	// Controller used to toggle various site settings.
	TheBlackMarketAppModule.controller('SettingsController', ['$scope', '$rootScope', 'audioService', function($scope, $rootScope, audioService) {
		// Synchronize audio settings between this controller
		// and the audioService.
		$scope.playSounds = audioService.playSounds;
		$scope.playChampionSounds = audioService.playChampionSounds;
		$scope.playMusic = audioService.playMusic;

		$scope.toggleSounds = function() {
			audioService.toggleSounds();
			$scope.playSounds = audioService.playSounds;
		};

		$scope.toggleChampionSounds = function() {
			audioService.toggleChampionSounds();
			$scope.playChampionSounds = audioService.playChampionSounds;
		};

		$scope.toggleMusic = function() {
			audioService.toggleMusic();
			$scope.playMusic = audioService.playMusic;
		};

		$scope.$watch('playSounds', function(value) {
			audioService.setSoundsEnabled(value);
		});

		$scope.$watch('playChampionSounds', function(value) {
			audioService.setChampionSoundsEnabled(value);
		});

		$scope.$watch('playMusic', function(value) {
			audioService.setMusicEnabled(value);
		});
	}]);

	// Controller used to synchronize the filter settings.
	TheBlackMarketAppModule.controller('FilterController', ['$scope', 'dataService', function($scope, dataService) {
		// Synchronize the filter settings between the controller
		// and the data service.
		$scope.selectedRegion = dataService.regionFilter;
		$scope.selectedTeam = dataService.teamFilter;
		$scope.showAllStats = dataService.showAllStats;

		$scope.$watch('selectedRegion', function(value) {
			dataService.setRegionFilter(value);
		});

		$scope.$watch('selectedTeam', function(value) {
			dataService.setTeamFilter(value);
		})

		$scope.$watch('showAllStats', function(value) {
			dataService.setShowAllStats(value);
		})
	}]);
})();
