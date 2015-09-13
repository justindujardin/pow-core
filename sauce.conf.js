// Sauce configuration, based on the one in zone.js: https://github.com/angular/zone.js/blob/master/sauce.conf.js

module.exports = function (config) {

  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '42'
    },
    'SL_ChromeBeta': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'beta'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '37'
    },
    'SL_Safari7': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  config.set({
    captureTimeout: 30000,
    browserNoActivityTimeout: 15000,

    sauceLabs: {
      testName: 'pow-core',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options:  {
          'selenium-version': '2.45.0',
          'command-timeout': 600,
          'idle-timeout': 600,
          'max-duration': 5400
      }
    },

    customLaunchers: customLaunchers,

    browsers: Object.keys(customLaunchers),

    reporters: ['dots', 'saucelabs', 'coverage'],

    singleRun: true,

    plugins: [
      'karma-*'
    ]
  });

  if (process.env.TRAVIS) {
    config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
  }
};
