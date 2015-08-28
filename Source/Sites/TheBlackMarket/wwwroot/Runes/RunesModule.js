(function() {
	'use strict';

	var RunesModule = angular.module('Runes', ['TheBlackMarketSite', 'ngRoute']);
	
	RunesModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/runes",
			name: "Runes"
		});

		$routeProvider
		  .when('/runes', {
		  	templateUrl: 'Runes/RunesList.html'
		  });
	}]);
})();