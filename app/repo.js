module.exports = function(db, Q) {
  var that = this;
  
  that.getAllProfileTitles = function() {
    var def = Q.defer();
    
    db.query({map: function(doc) {
      if (doc.title) {
        emit(doc.title);
      }
    }}, {reduce: false}, function (err, res) {
      if (err) {
        def.reject(err);
        return;
      }
      
      if (res.rows) {
        def.resolve(res.rows.map(function(doc) {
          return { title: doc.key, id: doc.id };
        }));
      }
    });
    
    return def.promise;
  };
  
  that.createNewProfile = function(profile) {
    var def = Q.defer();
    
    db.post(profile, function (err, res) {
      if (err) {
        def.reject(err);
        return;
      }
      
      def.resolve(res);
    });
    
    return def.promise;
  };
  
  that.updateProfile = function(profile) {
    var def = Q.defer();
    
    db.put(profile, function (err, res) {
      if (err) {
        def.reject(err);
        return;
      }
      
      def.resolve(res);
    });
    
    return def.promise;
  };
  
  that.deleteProfile = function(profile) {
    var def = Q.defer();
    
    db.remove(profile, function (err, res) {
      if (err) {
        def.reject(err);
        return;
      }
      
      def.resolve(res);
    });
    
    return def.promise;
  };
  
  that.getProfileById = function(id) {
    var def = Q.defer();

    db.get(id, function (err, res) {
      if (err) {
        def.reject(err);
        return;
      }
      
      def.resolve(res);
    });

    return def.promise;
  };
};
