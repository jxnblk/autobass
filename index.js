
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var read = require('./lib/read');
var extend = require('./lib/extend');
var helpers = require('./lib/helpers');
var include = require('./lib/include');
var formatRoutes = require('./lib/format-routes');
var parseModules = require('./lib/parse-modules');
var humanizeName = require('./lib/humanize-name');
var generatePages = require('./lib/generate-pages');


module.exports = function() {

  var self = this;

  this.parseModules = parseModules;
  this.formatRoutes = formatRoutes;

  this.init = function(data) {

    if (!data.source) {
      console.error('No source provided');
    }
    if (!data.dest) {
      console.error('No destination provided');
    }

    _.defaults(data, {
      root: data.dest,
      helpers: {},
      partials: {},
      routes: {},
      title: humanizeName(data.name),
      include: include,
      extend: extend
    });

    _.forIn(data, function(val, key) {
      self[key] = val;
    });

    if (self.layout) {
      this.defaultLayout = read(path.join(self.source, self.layout));
    } else {
      this.defaultLayout = read(path.join(__dirname, './layouts/default.html'));
    }

    this.layout = this.defaultLayout;

    _.forIn(helpers, function(val, key) {
      this[key] = val;
    });
    _.forIn(this.helpers, function(val, key) {
      this[key] = val;
    });

    if (this.modules) {
      this.modules = this.parseModules(this.modules);
    }

    this.formatRoutes(this.routes);

  };

  this.compile = generatePages;

  return this;

};

