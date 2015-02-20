/* jshint node: true */

'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    bower: {
      install: {
        options: {
          targetDir: 'dist/lib/'
        }
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: ['*.js', 'manifest.json'],
        dest: 'dist/'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true
      }
    },
    jade: {
      'dist/options.html': 'src/options.jade'
    }
  });

  // linting tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // jade tasks
  grunt.loadNpmTasks('grunt-contrib-jade');

  // bower task
  grunt.loadNpmTasks('grunt-bower-task');

  // copy taks
  grunt.loadNpmTasks('grunt-contrib-copy');

  // build task
  grunt.registerTask('build', 'Builds the Content Script', ['bower:install',
    'jade', 'copy']);

  // default task
  grunt.registerTask('default', 'Runs all tasks necessary for development ' +
    'and deployment', ['build', 'jshint']);
};
