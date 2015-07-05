// base path, that will be used to resolve files and exclude
basePath = './';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../src/js/vendor/jquery/dist/jquery.min.js',
  '../src/js/vendor/angular/angular.min.js',
  '../src/js/vendor/angular-route/angular-route.min.js',
  '../src/js/vendor/angular-touch/angular-touch.min.js',
  '../src/js/vendor/angular-sanitize/angular-sanitize.min.js',
  '../src/js/vendor/angular-resource/angular-resource.min.js',
  '../src/js/vendor/underscore/underscore-min.js',
  '../src/js/vendor/angular-mocks/angular-mocks.js',
  '../src/js/vendor/momentjs/min/moment.min.js',
  '../src/js/vendor/js-collection/angular-js-collection.js',
  '../src/js/vendor/angular-google-maps/dist/angular-google-maps.min.js',
  '../src/js/vendor/bluebird/js/browser/bluebird.js',
  '../src/js/vendor/ionic/js/ionic.min.js',
  '../src/js/vendor/Autolinker.js/dist/Autolinker.min.js',
  '../src/js/vendor/textarea-caret-position/index.js',
  '../src/js/app/*.js',
  '../src/js/app/controllers/**/*.js',
  '../src/js/app/services/**/*.js',
  '../src/js/app/directives/**/*.js',
  'unit/**/*.js'
];


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['dots', 'junit'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 10000;

junitReporter = {
  outputFile: 'test-results.xml'
};

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
