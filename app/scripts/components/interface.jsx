var React = require('react');

var Map = require('./map.jsx');

var Interface = React.createClass({
  render: function(){
    return (
      <div>
        <Map />  
      </div>
    );
  }
});

module.exports = Interface;
