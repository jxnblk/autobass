// Extend layouts

var fs = require('fs');
var path = require('path');

var read = require('./read');

module.exports = function(filename) {
  filename = path.join(this.source, filename);
  if (fs.existsSync(filename)) {
    this.layout = read(filename);
  } else {
    console.error('Layout ' + filename + ' not found');
    return false;
  }
};
