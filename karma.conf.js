module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    basePath: '',
    files: ['foreigner.js', 'test/*_spec.js'],
    colors: true,
    singleRun: true,
    reporters: ['dots']
  });
};
