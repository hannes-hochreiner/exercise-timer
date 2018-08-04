var fs = require('fs');
var Q = require('q');
var ex = require('./hhExec');
var buildDir = '/tmp/excerciseTimer_build_webapp';

exists(buildDir).then(function(res) {
  if (res) {
    return ex('rm', ['-r', buildDir]);
  }
}).then(function() {
  return ex('mkdir', [buildDir]);
}).then(function() {
  return [
    ex('browserify', ['-t', 'brfs', '-o', buildDir + '/bundle.js', 'app/main.js']),
    ex('cp', ['index.html', buildDir]),
    ex('cp', ['-r', 'app/resources', buildDir]),
    ex('cp', ['app/main.css', buildDir])
  ];
}).fail(function(error) {
  console.log('Error: ' + error);
}).done();

function exists(path) {
  var def = Q.defer();
  
  fs.exists(path, function(res) {
    def.resolve(res);
  });
  
  return def.promise;
}