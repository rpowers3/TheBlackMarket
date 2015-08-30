(function() {
	'use strict';

	var ObjectivesModule = angular.module('Objectives', ['TheBlackMarketSite', 'ngRoute']);
	
	ObjectivesModule.config(['theBlackMarketSiteProvider', '$routeProvider', function(theBlackMarketSiteProvider, $routeProvider) {
		theBlackMarketSiteProvider.addSection({
			path: "/objectives",
			name: "Objectives",
			flag: '/Objectives/ObjectivesFlag.png',
			image: '/Objectives/ObjectivesMenu.png'
		});

		$routeProvider
		  .when('/objectives', {
		  	templateUrl: 'Objectives/ObjectivesHome.html'
		  });
	}]);
})();