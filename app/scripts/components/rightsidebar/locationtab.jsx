var React = require('react');

var WaypointLocation = require('./waypointlocation.jsx');

var LocationTab = React.createClass({
  getInitialState: function(){
    var location = '';
    return {
      location: location,
      display: ''
    }
  },
  setInput: function(e){
    e.preventDefault();
    this.setState({display: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.props.setLocation(this.state.display);
  },
  handleUserLocation: function(e){
    e.preventDefault();
    console.log(e.target.value);
    this.props.setLocation(this.props.userLocation);
  },
  handleWaypointLocation: function(waypointProps){
    console.log(waypointProps);
    this.props.setLocation(waypointProps.waypoint);
  },
  render: function(){
    var id = "waypoint-input-" + this.props.index;
    var userLocationJSX
    var waypointsJSX = [];
    // console.log(this.props);
    if(this.props.state.userLocationEnabled){
      var userLocation = this.props.userLocation.geometry.coordinates;
      userLocationJSX = (
        <div>
          <div>{userLocation}</div>
          <button onClick={this.handleUserLocation}>Lookup Stops</button>
        </div>
      );
    }else{
      userLocationJSX = (
        <div>
          To Activate Location Tracking You Will Need To Reset Your Location
          Preferences and Reload the Page
        </div>
      );
    }

    var origin = this.props.props.directions.getOrigin()
    var destination = this.props.props.directions.getDestination()
    var waypoints = this.props.props.directions.getWaypoints()
    if(origin){
      waypointsJSX.push(
        <WaypointLocation setWaypoint={this.handleWaypointLocation} waypoint={origin}
          type="origin" key={0} />
      )
    }
    if(waypoints){
      waypoints.forEach(function(waypoint, index){
        waypointsJSX.push(
          <WaypointLocation setWaypoint={this.handleWaypointLocation} waypoint={waypoint}
            type="waypoint" index={index} key={index+1} />
        )
      });
    }
    if(destination){
      waypointsJSX.push(
        <WaypointLocation setWaypoint={this.handleWaypointLocation} waypoint={destination}
          type="destination" key={waypoints.length+1} />
      )
    }
    if(waypointsJSX.length < 1){
      waypointsJSX = (
        <div className="sidebar-waypoint-picker">no waypoints set</div>
      );
    }
    return (
      <div className="sidebar-tab">
        <div className="waypoint-container waypoint-active">
          <div className="sidebar-accordion" toggle={this.toggle}
            onClick={this.setToggle}>
            <div className="sidebar-accordion-title">
              Find A Stop Near You
            </div>
            <div className="sidebar-accordion-body">
              {userLocationJSX}
            </div>
          </div>
          <div className="sidebar-accordion" toggle={this.toggle}
            onClick={this.setToggle}>
            <div className="sidebar-accordion-title">
              Find A Stop Near A Waypoint
            </div>
            <div className="sidebar-accordion-body">
              {waypointsJSX}
            </div>
          </div>
          <div className="sidebar-accordion" toggle={this.toggle}
            onClick={this.setToggle}>
            <div className="sidebar-accordion-title">
              Find A Stop Near An Address
            </div>
            <form className="waypoint" onSubmit={this.handleSubmit}>
              <input type="text" autoComplete="off"
                value={this.state.display} onChange={this.setInput}
                placeholder="Find A Stop Near An Address" />
              <label className="waypoint-handle">
                <span className="glyphicon glyphicon-map-marker"
                  aria-hidden="true"
                ></span>
              </label>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LocationTab;
