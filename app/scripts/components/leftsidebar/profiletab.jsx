var React = require('react');

var Login = require('../login.jsx');

var ProfileTab = React.createClass({
  render: function(){
    return (
      <div className="sidebar-login">
        <Login callback={this.props.resetUser} />
      </div>
    );
  }
});

module.exports = ProfileTab;
