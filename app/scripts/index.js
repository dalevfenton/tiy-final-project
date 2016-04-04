var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');

var Interface = require('./components/interface.jsx');

var router = require('./router');

Backbone.history.start();

ReactDOM.render(
  React.createElement(
  Interface,
  {'router': router} ),
  document.getElementById('app')
);
