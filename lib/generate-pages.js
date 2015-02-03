
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var fm = require('front-matter');

var md = require('./md');
var read = require('./read');

module.exports = function() {

  var self = this;

  function generatePages(routes) {

    // use _.forIn
    var keys = Object.keys(routes);

    keys.forEach(function(key) {
      
      // Reset layout
      self.layout = self.defaultLayout;

      var route = routes[key];
      var dest = self.dest + route.path;
      var content = read(path.join(self.source + route.path, './index.html'));
      var pageData = self;

      pageData.page = {};

      _.assign(pageData.page, route);

      // Check for markdown file
      if (!content) {
        var filepath = path.join(self.source + route.path, './index.md');
        var src  = read(filepath);
        var matter = fm(src);
        _.assign(pageData.page, matter.attributes);
        content = md(matter.body);
      }

      // Check for parsed module
      if (!content && typeof self.modules !== 'undefined') {
        var module = self.modules[key] || false;
        if (module) {
          content = self.modules[key].content;
          _.assign(pageData.page, module);
        }
      }

      // Check for node module
      var source = route.source || key;
      var modulePath = path.join(self.root, './node_modules/' + source);
      if (!content && fs.existsSync(modulePath)) {
        pageData.page = require(modulePath + '/package.json');
        var markdown = read(modulePath + '/README.md');
        content = md(markdown);
      }

      if (!content) {
        console.error('No content found for ' + route.title);
        route.disabled = true;
      } else {
        pageData.page = pageData.page || {};
        pageData.page.title = route.title;
        pageData.content = _.template(content)(pageData);
        if (route.layout) self.extend(route.layout);
        var template = _.template(self.layout);
        var html = template(pageData);
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest);
        }
        fs.writeFileSync(path.join(dest, './index.html'), html);
      }

      // Check for subroutes
      var subroutes = route.routes || false;
      if (subroutes) {
        generatePages(subroutes);
      }
      
    });
    
  };



  generatePages(this.routes);

};

