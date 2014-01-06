module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    umd: {
      all: {
        src: 'lib/foreigner.js',
        dest: 'dist/foreigner.js',
        objectToExport: 'foreigner',
        amdModuleId: 'foreigner',
        globalAlias: 'foreigner',
        deps: {}
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * http://github.com/mirego/foreigner.js\n' +
                ' *\n' +
                ' * Copyright (c) 2013-<%= grunt.template.today("yyyy") %> Mirego <http://mirego.com>;\n' +
                ' * Licensed under the New BSD license */\n\n'
      },
      foreigner: {
        options: {
          beautify: true,
          mangle: false,
          compress: false
        },
        files: {
          'dist/foreigner.js': ['dist/foreigner.js']
        }
      },
      foreigner_min: {
        options: {
          mangle: {
            except: ['foreigner']
          }
        },
        files: {
          'dist/foreigner.min.js': ['dist/foreigner.js']
        }
      }
    },

    coveralls: {
      options: {
        coverage_dir: 'coverage/'
      }
    }
  });

  grunt.registerTask('default', ['umd', 'karma', 'uglify:foreigner', 'uglify:foreigner_min']);
  grunt.registerTask('test', ['karma', 'coveralls']);

  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
