
module.exports = function(grunt) {
  grunt.initConfig({

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
        mangle: {
          except: ['foreigner']
        }
      },
      foreigner: {
        files: {
          'dist/foreigner.min.js': ['lib/foreigner.js']
        }
      }
    }
  });

  grunt.registerTask('default', ['umd', 'karma', 'uglify']);

  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
