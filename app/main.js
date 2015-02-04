var ko = require('knockout');

ko.components.register('profile', {
  viewModel: require('./components/profile.vm').bind(null, ko),
  template: require('fs').readFileSync(__dirname + '/components/profile.html', 'utf8')
});

ko.applyBindings();
