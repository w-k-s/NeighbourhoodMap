module.exports = function (grunt) {  
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);  
    // Project configuration.  
    grunt.initConfig({  
        pkg: grunt.file.readJSON('package.json'),  
        cssmin: {  
            sitecss: {  
                options: {},  
                files: {  
                    'assets/css/site.min.css': [  
                        'assets/css/bulma.min.css',  
                        'assets/css/main.css',  
           			]
                }  
            }  
        },  
        uglify: {  
            options: {  
                compress: true  
            },  
            applib: {  
                src: [  
                'assets/js/jquery.js',  
                'assets/js/knockout.js',  
                'assets/js/models/place.js',  
                'assets/js/services/placesService.js',  
                'assets/js/services/wikipediaService.js',  
                'assets/js/viewmodels/place.js',  
                'assets/js/main.js',  
                ],  
                dest: 'assets/js/site.min.js'  
            }  
        }  
    });  
    // Default task.  
    grunt.registerTask('default', ['uglify', 'cssmin']);  
};