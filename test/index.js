
var fs = require('fs');
var path = require('path');
var Autobass = require('..');

var data = require('../package.json');
data.routes = require('./routes.json');
data.modules = [
  'flex-object'
];

data.root = path.join(__dirname, '..');
data.source = path.join(__dirname, './src');
data.dest = path.join(__dirname, './dest');

data.layout = './layouts/base.html';
data.stylesheet = 'http://d2v52k3cl9vedd.cloudfront.net/blk/0.0.14/blk.min.css';

data.partials = {};
data.partials.footer = fs.readFileSync(path.join(__dirname, './partials/footer.html'), 'utf8');
data.partials.nav = fs.readFileSync(path.join(__dirname, './partials/nav.html'), 'utf8');

var autobass = new Autobass();
autobass.init(data);
autobass.compile();

