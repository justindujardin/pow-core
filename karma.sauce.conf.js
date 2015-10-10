// Karma configuration
module.exports = function (config) {
  require('./karma.conf')(config);

  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 8.1',
      version: '42'
    },
    'SL_ChromeBeta': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X 10.9',
      version: 'beta'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'OS X 10.9',
      version: '37'
    },
    'SL_Safari7': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  config.set({
    captureTimeout: 120000,
    browserNoActivityTimeout: 120000,

    sauceLabs: {
      testName: 'pow-core',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
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
