exports.config = {
  seleniumServerJar: '../../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
//  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    '**/*.spec.js'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  baseUrl: 'http://localhost:9000',
};
