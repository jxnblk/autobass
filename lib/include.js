
var _ = require('lodash');

module.exports = function(id, locals) {
  var d = this;
  _.assign(d, locals);
  if (this.partials[id]) {
    return _.template(this.partials[id])(d);
  } else {
    console.error('Missing partial', id);
    return false;
  }
};
