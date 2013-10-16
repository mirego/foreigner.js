module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    basePath: '',
    files: ['dist/foreigner.js', 'test/*_spec.js'],
    colors: true,
    singleRun: true,
    reporters: ['dots', 'coverage'],
    preprocessors: {
      'dist/foreigner.js': 'coverage'
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  });
};
