// Extend layouts

var fs = require('fs');
var path = require('path');

var read = require('./read');

module.exports = function(filename) {
  //if (!this.src) { return false }
  filename = path.join(this.src, filename);
  if (fs.existsSync(filename)) {
    this.layout = read(filename);
  } else {
    console.error('Layout ' + filename + ' not found');
    return false;
  }
};
