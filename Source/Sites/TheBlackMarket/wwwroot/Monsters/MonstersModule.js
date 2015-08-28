(function() {
	'use strict';

	var MonstersModule = angular.module('Monsters', ['TheBlackMarketSite', 'ngRoute']);
	
	MonstersModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/monsters",
			name: "Monsters"
		});

		$routeProvider
		  .when('/monsters', {
		  	templateUrl: 'Monsters/MonstersHome.html'
		  });
	}]);
})();