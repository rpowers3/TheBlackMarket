(function() {
	'use strict';

	var BuildingsModule = angular.module('Buildings', ['TheBlackMarketSite', 'ngRoute']);
	
	BuildingsModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/buildings",
			name: "Buildings"
		});

		$routeProvider
		  .when('/buildings', {
		  	templateUrl: 'Buildings/BuildingsHome.html'
		  });
	}]);
})();