'use strict';
(function() {
	// This module is used by site modules to register themselves
	// into the site.
	var TheBlackMarketSiteModule = angular.module('TheBlackMarketSite', ['ngRoute']);

	// Simple wrapper for the sections data.
	function TheBlackMarketSite(sections) {
		this.sections = sections;
	};

	// A provider service use for the configuration phase to let
	// site modules add sections to the site.
	TheBlackMarketSiteModule.provider('theBlackMarketSite', function() {
		var sections = [];

		this.addSection = function(section) {
			sections.push(section);
		};

		this.$get = function() {
			return new TheBlackMarketSite(sections);
		};
	});
})();
