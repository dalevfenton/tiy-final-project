var React = require('react');

var LocationTab = React.createClass({
  render: function(){
    return (
      <div className="sidebar-tab">
        <input type="text" placeholder="Set Your Location" />
        <button>Set Your Current Location</button>
      </div>
    );
  }
});

module.exports = LocationTab;
