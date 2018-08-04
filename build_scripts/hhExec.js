module.exports = function(command, args, options) {
  var q = require('q');
  var child_process = require('child_process');
  var opts = {};

  opts.detached = false;
  
  if (typeof options !== 'undefined') {
    opts = options;
  }
  
  var def = q.defer();
  var cp = child_process.spawn(command, args, opts);
  var stdoutData = '';
  var stderrData = '';
  var processError;
  
  cp.stdout.on('data', function(data) {
    if (typeof data !== 'undefined') {
      stdoutData += data;
    }
  });
  
  cp.stdout.on('end', function(data) {
    if (typeof data !== 'undefined') {
      stdoutData += data;
    }
  });
  
  cp.stderr.on('data', function(data) {
    if (typeof data !== 'undefined') {
      stderrData += data;
    }
  });
  
  cp.stderr.on('end', function(data) {
    if (typeof data !== 'undefined') {
      stderrData += data;
    }
  });
  
  cp.on('error', function(error) {
    processError = error;
  });
  
  cp.on('close', function(code) {
    if (code === 0) {
      def.resolve(stdoutData);
    } else {
      var error = new Error();
      
      error.stdout = stdoutData;
      error.stderr = stderrData;
      error.err = processError;
      def.reject(error);
    }
  });
  
  return def.promise;
};
