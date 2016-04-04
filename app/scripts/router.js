var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'login': 'login'
  },
  index: function(){
    this.current = 'index';
  },
  login: function(){
    this.current = 'login';
  }
});

module.exports = new Router();
