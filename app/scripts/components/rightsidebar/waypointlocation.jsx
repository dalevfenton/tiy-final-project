var React = require('react');

var WaypointLocation = React.createClass({
  setWaypoint: function(e){
    e.preventDefault();
    this.props.setWaypoint(this.props);
  },
  render: function(){
    var point = this.props.waypoint;
    var displayText;
    if(point.properties.hasOwnProperty('name')){
      displayText = point.properties.name;
    }else{
      displayText = this.props.type;
    }

    return (
      <div className="sidebar-waypoint-picker">
        <button onClick={this.setWaypoint}>{displayText}</button>
      </div>
    );
  }
});

module.exports = WaypointLocation;
