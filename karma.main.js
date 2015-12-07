// Sourced from: https://github.com/mgechev/angular2-seed -- check it out.

// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit=Infinity;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.import('pow-core/all').then(function() {
  console.log("Importing Test modules: ");
  return Promise.all(
    Object.keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(function(path) {
      console.log(" - " + path);
      return System.import(path).then(function(module) {
        if (module.hasOwnProperty('main')) {
          module.main();
        } else {
          throw new Error('Module ' + path + ' does not implement main() method.');
        }
      });
    }))
})
.then(function() {
  __karma__.start();
}, function(error) {
  console.error(error.stack || error);
  __karma__.start();
});


function onlySpecFiles(path) {
  return /\.spec\.js$/.test(path);
}
