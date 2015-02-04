define([
  'q'
], function(Q) {
  return function(db, utils, pubsub) {
    var that = this;
    
    that.getAllProfileTitles = function() {
      var def = Q.defer();
      
      db.query({map: function(doc) {
        if (doc.title) {
          emit(doc.title);
        }
      }}, {reduce: false}).then(function(res) {
        if (res.rows) {
          def.resolve(res.rows.map(function(doc) {
            return { title: doc.key, id: doc.id };
          }));
        }
      }).done();
      
      return def.promise;
    };
  };
});
