(function() {
	'use strict';

	var WardingModule = angular.module('Warding', ['TheBlackMarketSite', 'ngRoute']);
	
	WardingModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/warding",
			name: "Warding"
		});

		$routeProvider
		  .when('/warding', {
		  	templateUrl: 'Warding/WardingHome.html'
		  });
	}]);
})();