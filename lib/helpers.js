// Default helpers

var _ = require('lodash');
var md = require('./md');
var humanizeName = require('./humanize-name');

module.exports = {
  json: function(obj) {
    if (typeof obj !== "object") return 'Not an object';
    return JSON.stringify(obj, null, '  ');
  },
  markdown: function(string) {
    return md(string);
  },
  capitalize: function(string) {
    if (!string) return false;
    return humanizeName(string);
  }
};
