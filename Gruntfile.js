/* jshint node: true */

'use strict';

module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
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
      },
      release: {
        expand: true,
        cwd: 'dist/',
        src: ['**/*'],
        dest: '<%= pkg.name %>-<%= pkg.version %>/'
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
    },
    compress: {
      main: {
        options: {
          archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        files: [
          {src: '<%= pkg.name %>-<%= pkg.version %>/**/*'}
        ]
      }
    }
  });

  // compression (e.g: zip) tasks
  grunt.loadNpmTasks('grunt-contrib-compress');

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
    'jade', 'copy:main']);

  // release task
  grunt.registerTask('release', 'Builds and makes a release of the Content ' +
    'Script', ['build', 'copy:release', 'compress']);

  // default task
  grunt.registerTask('default', 'Runs all tasks necessary for development ' +
    'and deployment', ['build', 'jshint']);
};
