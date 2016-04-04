var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    '': 'index'
  },
  index: function(){
    this.current = 'index';
  }
});

module.exports = new Router();
