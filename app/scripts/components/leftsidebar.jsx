var React = require('react');
// var Backbone = require('backbone');
var Waypoint = require('./waypoint.jsx');

var LeftSidebar = React.createClass({
  render: function(){
    // console.log('render of LeftSidebar', this.props);
    // console.log(this.state);
    var leftToggle;
    if(this.props.state.toggleLeft){
      leftToggle = "map-overlay sidebar-left collapse-overlay-left collapse-overlay";
    }else{
      leftToggle = "map-overlay sidebar-left";
    }
    //build our Waypoint components and check for the active Waypoint
    //these are inserted into #waypoint-list in the final return
    //we're using a for loop instead of map because we can't just loop over
    //the full list of points since Origin and Destination are set separately
    var waypoints = [];
    var self = this;
    for(var i = 0; i < self.props.state.numPoints; i++){
      // var point = new Point();
      var active = false;
      if(this.props.state.activePoint == i){
        active = true;
      }
      var waypoint = (
        <Waypoint directions={self.props.directions}
          key={i} index={i} numPoints={self.props.state.numPoints}
          updateMap={self.props.updateMap} active={active} setActive={this.props.setActive}
          removePoint={this.props.removePoint}
        /> );
      waypoints.push(waypoint);
    }

    return (
      <div className={leftToggle}>
        <div className="overlay-control overlay-control-left">
          <span className="close-overlay" onClick={this.props.toggleLeft}>
            <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
          </span>
        </div>
        <div>
          <div id="waypoint-list">
            {waypoints}
          </div>
          <button className="trip-button geo-auth-button geolocation-authorize"
            onClick={this.props.addPoint}>+ Add New Waypoint</button>
        </div>
      </div>
    );
  }
});

module.exports = LeftSidebar;
