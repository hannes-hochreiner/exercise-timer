define([],
function() {
  return function() {
    var that = this;
    
    that.clone = function(obj) {
      if (typeof obj === 'undefined') {
        return obj;
      }
      
      if (obj.constructor === Array) {
        var tmpArr = [];
        
        for (cntr in obj) {
          tmpArr[cntr] = that.clone(obj[cntr]);
        }
        
        return tmpArr;
      }
      
      if (obj.constructor === Object) {
        var tmp = {};
        
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            tmp[key] = that.clone(obj[key]);
          }
        }
        
        return tmp;
      }
      
      return obj;
    };
  };
});
