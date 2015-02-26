module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
        concat: {
          js: {
            src: 'js/**/*.js',
            dest: 'js/concat.js'
          }
        },
        clean: ['js/concat.js'],
        express: {
          all: {
            options: {
              port: 9000,
              hostname: "0.0.0.0",
              bases: ['js', 'bower_components'],
              livereload: true
            }
          }
        },
        watch: {
            all: {
                files: ['**/*.html'],
                options: {
                    livereload: true
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:<%= express.all.options.port%>'
            }
        }
    });

    grunt.registerTask('serve', ['clean', 'concat', 'express', 'open', 'watch']);
};
