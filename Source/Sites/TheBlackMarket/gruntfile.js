module.exports = function(grunt) {
	grunt.initConfig({
		clear: {
			build: {

			}
		},
		sass: {
			build: {
				options: {
					style: "compressed"
				},
				files: {
					"wwwroot/Brawlers/Brawlers.css": "wwwroot/Brawlers/Brawlers.scss",
					"wwwroot/Champions/Champions.css": "wwwroot/Champions/Champions.scss",
					"wwwroot/Items/Items.css": "wwwroot/Items/Items.scss",
					"wwwroot/TheBlackMarket.css": "wwwroot/TheBlackMarket.scss"
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

	grunt.loadNpmTasks("grunt-contrib-clean");
	//grunt.loadNpmTasks("grunt-contrib-uglify");
	//grunt.loadNpmTasks("grunt-contrib-copy");
	//grunt.loadNpmTasks('grunt-contrib-htmlmin');
	//grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", ["watch"]);
	grunt.registerTask("build", ["sass"]);
	grunt.registerTask("rebuild", ["clean", "sass"]);
};