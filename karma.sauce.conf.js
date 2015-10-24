// Karma configuration
module.exports = function (config) {
  require('./karma.conf')(config);

  // Configuration based on: https://github.com/jashkenas/backbone/blob/master/karma.conf-sauce.js
  var _ = require('underscore');

// Browsers to run on Sauce Labs platforms
  var sauceBrowsers = _.reduce([
    ['firefox', '41'],
    ['firefox', '40'],
    ['firefox', '35'],
    ['firefox', '30'],

    ['chrome', 'beta'],
    ['chrome', 'dev'],
    ['chrome', '39'],
    ['chrome', '26'],

    ['iphone', '8.4', 'OSX 10.10'],
    ['iphone', '9.0', 'OSX 10.10'],

    ['microsoftedge', '20.10240', 'Windows 10'],
    ['internet explorer', '11', 'Windows 10'],
    ['internet explorer', '10', 'Windows 8'],
    ['internet explorer', '9', 'Windows 7'],

    ['android', '5.1'],
    ['android', '4.4'],

    ['safari', '8.1', 'OS X 10.11'],
    ['safari', '8.0', 'OS X 10.10'],
    ['safari', '7'],
    ['safari', '6']
  ], function (memo, platform) {
    // internet explorer -> ie
    var label = platform[0].split(' ');
    if (label.length > 1) {
      label = _.invoke(label, 'charAt', 0)
    }
    label = (label.join("") + '_v' + platform[1]).replace(' ', '_').toUpperCase();
    memo[label] = {
      'base': 'SauceLabs',
      'browserName': platform[0],
      'version': platform[1],
      'platform': platform[2]
    };
    return memo;
  }, {});

  config.set({
    captureTimeout: 120000,
    browserNoActivityTimeout: 120000,

    sauceLabs: {
      testName: 'pow-core',
      startConnect: true,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.47.1',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      }
    },

    customLaunchers: sauceBrowsers,

    browsers: Object.keys(sauceBrowsers),

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
