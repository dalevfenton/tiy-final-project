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
    var className = "sidebar-waypoint-picker";
    if(this.props.active){
      className = "sidebar-waypoint-picker waypoint-picker-active";
    }
    return (
      <div className={className} >
        <button onClick={this.setWaypoint}>{displayText}</button>
      </div>
    );
  }
});

module.exports = WaypointLocation;
