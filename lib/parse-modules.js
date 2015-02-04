
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var read = require('./read');
var md = require('./md');
var titleCase = require('./humanize-name');

module.exports = function(modules) {

  var obj = {};

  var self = this;

  function parseReadme(html) {
    var readme = {};
    var $ = cheerio.load(html);
    readme.heading = $('h1').first().remove();
    readme.description = $('p').first().remove();
    readme.body = $.html();
    return readme;
  };

  function getModule(name) {

    var mod = self.parent.require(name + '/package.json');
    var html = md(mod.readme);
    mod.readme = parseReadme(html);
    mod.content = mod.readme.body;
    mod.title = titleCase(mod.name);
    mod.npmLink = '//npmjs.com/package/' + mod.name;

    return mod;

  };

  modules.forEach(function(name) {
    obj[name] = getModule(name);
  });

  return obj;

};
