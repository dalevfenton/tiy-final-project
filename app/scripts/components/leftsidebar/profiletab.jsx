var React = require('react');

var Login = require('../login.jsx');

var ProfileTab = React.createClass({
  render: function(){
    return (
      <Login callback={this.props.resetUser} />
    );
  }
});

module.exports = ProfileTab;
