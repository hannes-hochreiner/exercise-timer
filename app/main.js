var ko = require('knockout');
var PouchDb = require('pouchdb');
var Repo = require('./repo');
var Q = require('q');

ko.components.register('profile', {
  viewModel: require('./components/profile.vm').bind(null, ko, new Repo(new PouchDb('exercise-timer'), Q)),
  template: require('fs').readFileSync(__dirname + '/components/profile.html', 'utf8')
});

ko.applyBindings();
