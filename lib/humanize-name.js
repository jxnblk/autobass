
//var _ = require('lodash');
var Humanize = require('humanize-plus');

module.exports = function(string) {
  return Humanize.titleCase(string.replace(/\-/g, ' '));
};

