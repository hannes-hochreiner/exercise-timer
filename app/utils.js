define([],
function() {
  return function() {
    var that = this;
    
    that.clone = function(obj) {
      return JSON.parse(JSON.stringify(obj));
    };
  };
});
