
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var toc = require('markdown-toc');
var colors = require('colors');

var renderer = require('./lib/marked-renderer');
var read = require('./lib/read');
var include = require('./lib/include');

module.exports = function(opts) {

  var opts = opts || {};
  var pages = [];

  opts = _.defaults(opts, {
    layout: fs.readFileSync(path.join(__dirname, './layout.html'), 'utf8'),
    partials: {},
    MD_MATCH: /md|markdown/,
  });

  function createFullPaths(routes, newRoutes, prefix) {
    var prefix = prefix || false;
    var newRoutes = newRoutes || [];
    routes.forEach(function(route) {
      route.title = route.title || _.capitalize(route.name);
      if (prefix) {
        route.parent = prefix;
        route.path = prefix.path + route.path;
      } else {
        route.path = route.path;
        newRoutes.push(route);
      }
      if (route.routes) {
        createFullPaths(route.routes, newRoutes, route);
      }
    });
    return newRoutes;
  }


  function createRouteObj(route, i, arr) {

    var obj;
    var filepath;
    var content;
    var ext = '';

    content = route.content || false;
   
    if (!content && route.filename) {
      filepath = path.join(opts.src, route.path + '/' + route.filename);
    } else if (!content) {
      ext = 'md';
      filepath = path.join(opts.src, route.path + '/index.md');
    }

    if (!content) {
      content = fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : false;
    }
    if (!content) {
      ext = 'html';
      filepath = filepath.replace(/\.md$/, '.html');
      content = fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : false;
    }
    if (!content) {
      console.log(('No template found for ' + route.path).red);
      return false;
    }

    obj = _.defaults(route, {
      body: content,
      ext: ext,
    });

    if (route.routes) {
      route.routes = route.routes.map(createRouteObj, route);
      obj.routes = route.routes;
    }

    if (route.layout) {
      obj.layout = route.layout;
    }

    return obj;

  }


  function addBreadcrumbs(route) {
    var breadcrumbs = [];
    function getParent(r) {
      var p;
      if (r.parent) {
        p = r.parent;
        breadcrumbs.unshift({
          name: r.parent.name,
          title: r.parent.title,
          path: r.parent.path,
        });
        if (p.parent) {
          getParent(p);
        }
      }
    }
    getParent(route);
    route.breadcrumbs = breadcrumbs;
    if (route.routes) {
      route.routes = route.routes.map(addBreadcrumbs);
    }
    return route;
  }


  function addPreviousNext(route, i, arr) {
    if (arr[i+1]) {
      route.next = arr[i+1];
    } else if (route.routes) {
      route.next = route.routes[0];
    } else if (route.parent && route.parent.next) {
      route.next = route.parent.next;
    }
    if (arr[i-1]) {
      route.previous = arr[i-1];
    } else if (route.parent) {
      route.previous = route.parent;
    }
    if (route.routes) {
      route.routes = route.routes.map(addPreviousNext);
    }
    return route;
  }


  function addTOC(route) {
    opts.page = route.page;
    if (route.ext.match(opts.MD_MATCH)) {
      route.sections = toc(_.template(route.body)(opts)).json;
    }
    if (route.routes) {
      route.routes = route.routes.map(addTOC);
    }
    return route;
  }


  function renderPage(route) {
    var layout;
    var locals = opts;

    if (route.layout) {
      layout = fs.readFileSync(path.join(opts.src, route.layout), 'utf8');
    } else {
      layout = opts.layout;
    }

    locals.page = route;
    locals.include = include;
    locals.body = _.template(route.body)(locals);
    
   
    if (route.ext.match(opts.MD_MATCH)) {
      locals.body = marked(locals.body, { renderer: renderer });
    }
    route.body = _.template(layout)(locals);
    if (route.routes) {
      route.routes = route.routes.map(renderPage);
    }
    return route;
  };


  opts.routes = createFullPaths(opts.routes);

  opts.routes = opts.routes.map(createRouteObj);
  opts.routes = opts.routes.map(addTOC);
  opts.routes = opts.routes.map(addBreadcrumbs);
  opts.routes = opts.routes.map(addPreviousNext);
  pages = opts.routes.map(renderPage);


  return pages;


};

