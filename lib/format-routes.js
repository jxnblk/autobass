
var fs = require('fs');
var _ = require('lodash');

var humanizeName = require('./humanize-name');

var parents = [];
var modules;

function formatRoutes(routes, root) {

  var self = this;
  var root = root || '';
  var keys = Object.keys(routes);

  if (!modules && self.modules) {
    modules = self.modules;
  } else if (!modules) {
    modules = {};
  }

  keys.forEach(function(key, i) {

    var route = routes[key];

    if (route.path) {
      route.path = root + route.path;
    } else {
      route.path = root + '/' + key;
    }

    if (routes[keys[i-1]]) {
      route.previousPage = routes[keys[i-1]];
    }
    if (routes[keys[i+1]]) {
      route.nextPage = routes[keys[i+1]];
    }


    if (parents.length) {
      route.parent = parents[parents.length - 1];
    }

    var source = route.source || key;
    if (source) {
      if (fs.existsSync('./node_modules' + source)) {
        var pkg = require(source + '/package.json');
        route.source = pkg.name;
        route.title = route.title || humanizeName(pkg.name);
      }
      if (modules[source]) {
        _.assign(route, modules[source]);
      }
    }

    // Set title if manually set in routes object
    route.title = route.title || humanizeName(key);

    // Create breadcrumbs
    route.breadcrumbs = [{ title: route.title, path: route.path }];
    function addParent(r) {
      route.breadcrumbs.unshift({ title: r.title, path: r.path });
      if (r.parent) addParent(r.parent);
    };
    if (parents.length) {
      addParent(route.parent);
    }

    if (route.routes) {
      parents.push(route);
      self.formatRoutes(route.routes, route.path);
    }

  });

  parents.pop();

};

module.exports = formatRoutes;

