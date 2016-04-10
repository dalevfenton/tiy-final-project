var React = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;

var Loading = React.createClass({
  render: function(){
    return (
      <div className="loading">
        <h3>Loading...</h3>
        <Glyphicon className="icon-refresh-animate" glyph="refresh" />
      </div>
    );
  }
});

module.exports = Loading;
