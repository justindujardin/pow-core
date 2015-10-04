/*globals module,process,require */
module.exports = function (config) {
  "use strict";

  var coverageDebug = false;

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      "vendor/jquery/dist/jquery.min.js",
      "vendor/underscore/underscore-min.js",
      'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
      'node_modules/systemjs/dist/system.src.js',
      "lib/pow-core.js",
      {pattern: 'test/fixtures/*.*', watched: true, included: false, served: true},
      {pattern: 'test/**/*.js', watched: true, included: false, served: true},
      "karma.main.js"
    ],
    reporters: ['dots', 'coverage'],
    port: 9876,
    autoWatch: true,
    background: true,
    // - Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
    browsers: process.env.TRAVIS ? ['TravisChrome'] : ['Chrome'],
    browserNoActivityTimeout: 15000,
    singleRun: false,
    reportSlowerThan: 500,
    plugins: [
      'karma-*'
    ],
    customLaunchers: {
      TravisChrome: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    preprocessors: (process.env.TRAVIS || coverageDebug) ? {"lib/*.js": "coverage"} : {},
    coverageReporter: {
      type: "lcov",
      dir: ".coverage/"
    }
  });
};
