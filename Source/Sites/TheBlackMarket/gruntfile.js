module.exports = function(grunt) {
	grunt.initConfig({
		clear: {
			build: {

			}
		},
		uglify: {
			dev: {
				files: [
					{
						'wwwroot/TheBlackMarket.min.js': [
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
					}
				]
			},
			build: {
				files: [
					{
						'wwwroot/TheBlackMarket.min.js': [
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
						src: [
							'wwwroot/LibrariesModified/*.js',
						],
						ext: '.min.js',
						expand: true
					}
				]
			}
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
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['uglify', 'sass']);
	grunt.registerTask('rebuild', ['clean', 'sass']);
};