define([
  './profile.vm',
  'text!./profile.html'
], function(viewModel, template) {
  return { viewModel: viewModel, template: template };
});
