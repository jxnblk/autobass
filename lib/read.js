
var fs = require('fs');

module.exports = function(filename) {
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename, 'utf8');
  } else {
    return false;
  }
};
