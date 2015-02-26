
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var basswork = require('basswork');
var rework = require('rework');
var reworknpm = require('rework-npm');

var reworkmedia = require('rework-custom-media');
var reworkvars = require('rework-vars');
var reworkcolors = require('rework-plugin-colors');
var reworkcalc = require('rework-calc');

var cssstats = require('cssstats');

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

  function parseStyle(filepath, filename) {
    var source = filepath + '/' + filename;
    var precompiled = fs.readFileSync(source, 'utf8');
    //var css = basswork(precompiled, { source: source });
    var css = rework(precompiled, { source: source })
      .use(reworknpm())
      .toString();
    return css;
  };

  function getModule(name) {
    var filepath = self.root + '/node_modules/' + name;
    var mod = require(filepath + '/package.json') || false;
    if (fs.existsSync(filepath + '/README.md')) {
      mod.readme = fs.readFileSync(filepath + '/README.md', 'utf8');
      var html = md(mod.readme);
      mod.readme = parseReadme(html);
      mod.content = mod.readme.body;
    } else {
      console.log('README.md not found for ' + name);
    }
    var style = mod.style || fs.existsSync(filepath + '/index.css') ? '/index.css' : false;
    if (style) {
      mod.css = parseStyle(filepath, style);
      mod.stats = cssstats(mod.css);
    }
    mod.title = titleCase(mod.name);
    mod.npmLink = '//npmjs.com/package/' + mod.name;

    return mod;

  };

  modules.forEach(function(name) {
    obj[name] = getModule(name);
  });

  return obj;

};
