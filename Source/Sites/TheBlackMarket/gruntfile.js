module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			build: [
				'wwwroot/Release'
			]
		},
		uglify: {
			build: {
				files: [
					{
						'wwwroot/Release/TheBlackMarketUnified.js': [
							'wwwroot/TheBlackMarketSite.js',
							'wwwroot/TheBlackMarketApp.js',
							'wwwroot/Brawlers/BrawlersModule.js',
							'wwwroot/Champions/ChampionsModule.js',
							'wwwroot/Combat/CombatModule.js',
							'wwwroot/Items/ItemsModule.js',
							'wwwroot/Objectives/ObjectivesModule.js',
							'wwwroot/Rivalries/RivalriesModule.js',
							'wwwroot/Warding/WardingModule.js'
						]
					},
					{
						'wwwroot/LibrariesModified/d3.min.js': 'wwwroot/LibrariesModified/d3.js'
					},
					{
						'wwwroot/LibrariesModified/nv-d3.min.js': 'wwwroot/LibrariesModified/nv-d3.js'
					},
					{
						'wwwroot/Libraries/angular-nvd3-directives-pcu2/dist/angularjs-nvd3-directives.min.js': 'wwwroot/Libraries/angular-nvd3-directives-pcu2/dist/angularjs-nvd3-directives.js'
					},
					{
						'wwwroot/Libraries/angular-bootstrap-checkbox/angular-bootstrap-checkbox.min.js': 'wwwroot/Libraries/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js'
					}
				]
			},
		},
		sass: {
			build: {
				options: {
					style: 'compressed'
				},
				files: {
					'wwwroot/Brawlers/Brawlers.css': 'wwwroot/Brawlers/Brawlers.scss',
					'wwwroot/Champions/Champions.css': 'wwwroot/Champions/Champions.scss',
					'wwwroot/Items/Items.css': 'wwwroot/Items/Items.scss',
					'wwwroot/TheBlackMarket.css': 'wwwroot/TheBlackMarket.scss',
					'wwwroot/TheBlackMarketUnified.css': 'wwwroot/TheBlackMarketUnified.scss',
					'wwwroot/Resources/Nv3dOverrides.css': 'wwwroot/Resources/Nv3dOverrides.scss',
					'wwwroot/Resources/BootstrapMagic.css': 'wwwroot/Resources/BootstrapMagic.scss',
					'wwwroot/Resources/BootstrapMagicOverrides.css': 'wwwroot/Resources/BootstrapMagicOverrides.scss'
				}
			},
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
				},
				files: {
					'wwwroot/Release/TheBlackMarketUnified.css': 'wwwroot/TheBlackMarketUnified.scss'
				}
			}
		},
		concat: {
			dist: {
				files: [
					{
						'wwwroot/Release/TheBlackMarketLibraries.css': [
							'wwwroot/Libraries/nvd3/src/nv.d3.css',
							'wwwroot/Libraries/bootstrap/dist/css/bootstrap.min.css',
							'wwwroot/Libraries/angular-bootstrap/ui-bootstrap-csp.css',
							'wwwroot/Libraries/angularjs-slider/dist/rzslider.min.css'
						]
					},
					{
						'wwwroot/Release/TheBlackMarketLibraries.js': [
							'wwwroot/Libraries/angular/angular.min.js',
							'wwwroot/Libraries/angular-animate/angular-animate.min.js',
							'wwwroot/Libraries/angular-bootstrap/ui-bootstrap.min.js',
							'wwwroot/Libraries/angular-bootstrap/ui-bootstrap-tpls.min.js',
							'wwwroot/Libraries/angular-bootstrap-checkbox/angular-bootstrap-checkbox.min.js',
							'wwwroot/Libraries/angular-route/angular-route.min.js',
							'wwwroot/Libraries/angular-local-storage/dist/angular-local-storage.min.js',
							'wwwroot/Libraries/angular-sanitize/angular-sanitize.min.js',
							'wwwroot/Libraries/angular-translate/angular-translate.min.js',
							'wwwroot/Libraries/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
							'wwwroot/Libraries/videogular/videogular.min.js',
							'wwwroot/Libraries/angularjs-slider/dist/rzslider.min.js',
							'wwwroot/LibrariesModified/d3.min.js',
							'wwwroot/LibrariesModified/nv-d3.min.js',
							'wwwroot/Libraries/angular-nvd3-directives-pcu2/dist/angularjs-nvd3-directives.min.js',
							'wwwroot/Libraries/soundmamager2/script/soundmanager2-nodebug-jsmin.js'
						]
					}
				]
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass'],
				options: {
					interrupt: true,
					debounceDelay: 250
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('grunt-contrib-htmlmin');
	//grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['uglify', 'sass', 'concat']);
	grunt.registerTask('rebuild', ['clean', 'uglify', 'sass', 'concat']);
};