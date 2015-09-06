/*globals module,process,require */
module.exports = function (config) {
  "use strict";

  var coverageDebug = false;

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      "test/vendor/jquery/dist/jquery.min.js",
      "test/vendor/underscore/underscore-min.js",
      "lib/pow-core.js",
      "lib/test/*.js",
      {pattern: 'test/fixtures/*.*', watched: true, included: false, served: true}
    ],
    reporters: ['dots', 'coverage'],
    port: 9876,
    autoWatch: true,
    background: true,
    // - Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
    browsers: process.env.TRAVIS ? ['TravisChrome'] : ['Firefox'],
    //browserNoActivityTimeout: 35000,
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
