module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['mocha', 'chai'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'node_modules/chai-as-promised/lib/chai-as-promised.js',
      'src/*.js',
      'src/**/*.js',
      'test/unit/**/*.spec.js'
    ],
    exclude:    [],
    preprocessors: {
      'src/**/*.js': 'coverage'
    },
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],
    coverageReporter: {
      type: 'html',
      dir: 'buildreports/coverage/'
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    client: {
      captureConsole: true
    }
  });
};
