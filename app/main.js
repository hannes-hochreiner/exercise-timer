require.config({
  paths: {
    knockout: '../lib/knockout/knockout-3.2.0',
    jquery: '../lib/jquery/jquery-2.1.1.min',
    domReady: '../lib/require/domReady',
    text: '../lib/require/text',
    q: '../lib/q/q',
    pouchdb: '../lib/pouchdb/pouchdb-3.2.0.min',
    pubsub: '../lib/pubsub/pubsub-1.5.0'
  }
});

require([
  'knockout',
  'repo',
  'utils',
  'pouchdb',
  'pubsub',
  'domReady!'
], function(ko, Repo, Utils, PouchDb, pubsub) {
  ko.components.register('profile', { require: 'components/profile' });
  
  function AppViewModel(repo) {
    var that = this;
    
    that.repo = repo;
    that.ko = ko;
    that.pubsub = pubsub;
  }

  ko.applyBindings(new AppViewModel(new Repo(
                                              new Utils(),
                                              pubsub
                                            )));
});
