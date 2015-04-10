
var fs = require('fs-extra');
var path = require('path');
var assert = require('assert');
var colors = require('colors');
var lodo = require('..');
var pkg = require('../package.json');

var pages;
var opts = {
  src: __dirname + '/src',
  title: pkg.name,
  description: pkg.description,
  layout: fs.readFileSync(path.join(__dirname, './src/layouts/default.html'), 'utf8'),
  partials: {
    header: fs.readFileSync(path.join(__dirname, './src/partials/header.html'), 'utf8'),
  },
  stylesheets: [
    'http://d2v52k3cl9vedd.cloudfront.net/bassdock/1.3.0/bassdock.min.css'
  ],
  routes: [
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs',
      routes: [
        { name: 'Grid', path: '/grid' },
        { name: 'Typography', path: '/typography',
          routes: [
            { name: 'Headings', path: '/headings' },
            { name: 'Lists', path: '/lists' },
          ]
        },
        { name: 'Tables', path: '/tables' },
      ]
    },
  ],
};


function writePage(page) {
  var pagePath = path.join(__dirname, page.fullpath);
  fs.ensureDirSync(pagePath);
  fs.writeFileSync(pagePath + '/index.html', page.body);
  console.log((pagePath + ' written').green);
  if (page.routes) {
    page.routes.forEach(writePage);
  }
}


describe('lodo', function() {

  it('should not throw', function() {
    assert.doesNotThrow(function() {
      pages = lodo(opts);
      pages.forEach(writePage);
    });
  });

  it('should return an array', function() {
    assert.equal(Array.isArray(pages), true);
  });

});


