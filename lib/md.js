
var marked = require('marked');
var markedExample = require('marked-example');

var marky = require('marky-markdown');

var renderer = new marked.Renderer();

renderer.code = markedExample({
  classes: {
    container: 'mb2 bg-darken-1 rounded',
    rendered: 'p2',
    code: 'm0 p2 bg-darken-1 rounded-bottom'
  }
});

var options = {};
options.renderer = renderer;

module.exports = function(md, opts) {

  return marked(md, options);

};

