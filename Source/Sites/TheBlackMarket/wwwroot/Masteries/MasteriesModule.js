(function() {
	'use strict';

	var MasteriesModule = angular.module('Masteries', ['TheBlackMarketSite', 'ngRoute']);
	
	MasteriesModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/masteries",
			name: "Masteries"
		});

		$routeProvider
		  .when('/masteries', {
		  	templateUrl: 'Masteries/MasteriesList.html'
		  });
	}]);
})();