// Karma configuration
module.exports = function (config) {
  require('./karma.conf')(config);

  var customLaunchers = {
    'SL_CHROME': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '45'
    },
    'SL_CHROMEBETA': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'beta'
    },
    'SL_CHROMEDEV': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'dev'
    },
    'SL_FIREFOX': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '40'
    },
    'SL_FIREFOXBETA': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'beta'
    },
    'SL_FIREFOXDEV': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'dev'
    },
    'SL_SAFARI7': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_SAFARI8': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8'
    },
    'SL_SAFARI8.1': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '8.1'
    },
    'SL_IOS8': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '8.4'
    },
    'SL_IOS9': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '9.0'
    },
    'SL_IE9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    'SL_IE10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_IE11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    'SL_EDGE': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '20.10240'
    },
    'SL_ANDROID4.4': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4'
    },
    'SL_ANDROID5.1': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '5.1'
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
        'selenium-version': '2.47.1',
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
