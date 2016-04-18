var React = require('react');

var WaypointLocation = require('./waypointlocation.jsx');
var Accordion = require('./accordion.jsx');

var LocationTab = React.createClass({
  getInitialState: function(){
    return {
      display: '',
    }
  },
  callLocationSetup: function(bool, e){
    console.log(e);
    console.log(bool);
    e.preventDefault();
    this.props.setupGeo(bool);
  },
  setInput: function(e){
    e.preventDefault();
    this.setState({display: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.props.setLocation(this.state.display);
    this.setState({'loading': 'inputLocation'});
  },
  handleUserLocation: function(e){
    e.preventDefault();
    console.log(e.target.value);
    this.props.setLocation(this.props.userLocation);
    this.setState({'loading': 'userLocation'});
  },
  handleWaypointLocation: function(waypointProps){
    console.log(waypointProps);
    this.props.setLocation(waypointProps.waypoint, waypointProps.index);
  },
  toggleAccordion: function(e){
    e.preventDefault();
    // console.log(this.refs);
  },
  render: function(){
    // console.log(this.props);
    var id = "waypoint-input-" + this.props.index;
    var userLocationJSX
    var waypointsJSX = [];
    // console.log(this.props);
    if(this.props.state.userLocationEnabled){
      var userLocation = this.props.userLocation.geometry.coordinates;
      userLocationJSX = (
        <div>
          <div className="dtr-title">Your Current Location</div>
          <div className="sidebar-info">
            <span className="sidebar-label">latitude:</span>
            <span className="sidebar-label-info">{userLocation[1]}</span>
          </div>
          <div className="sidebar-info">
            <span className="sidebar-label">longitude:</span>
            <span className="sidebar-label-info">{userLocation[0]}</span>
          </div>
          <div className="sidebar-waypoint-picker">
            <button  onClick={this.handleUserLocation}>Lookup Stops</button>
          </div>
        </div>
      );
    }else{
      if(localStorage.getItem("geolocation") === "true"){
        userLocationJSX = (
          <div>
            <div className="user-location-setting-text">
              To Activate Location Tracking You Will Need To Reset Your Location
              Preferences and Reload the Page
            </div>
          </div>
        );
      }else{
        userLocationJSX = (
          <div>
            <div className="user-location-setting-text">
              To Activate Location Tracking You Will Need To Reset Your Location
              Preferences and Reload the Page
            </div>
            <div className="geo-auth-button geolocation-authorize user-location-setting"
              onClick={this.callLocationSetup.bind(this, true)}>Find Your Location</div>
          </div>
        );
      }
    }

    var origin = this.props.props.directions.getOrigin();
    var destination = this.props.props.directions.getDestination();
    var waypoints = this.props.props.directions.getWaypoints();
    var active;
    if(origin){
      active = false;
      if(this.props.state.activePoint == 0){
        active = true;
      }
      waypointsJSX.push(
        <WaypointLocation setWaypoint={this.handleWaypointLocation} waypoint={origin}
          type="origin" key={0} index={0} active={active} />
      )
    }
    if(waypoints){
      waypoints.forEach(function(waypoint, index){
        active = false;
        if(this.props.state.activePoint == index+1){
          active = true;
        }
        waypointsJSX.push(
          <WaypointLocation setWaypoint={this.handleWaypointLocation} waypoint={waypoint}
            type="waypoint" index={index+1} key={index+1} active={active} />
        )
      }.bind(this));
    }
    if(destination){
      active = false;
      if(this.props.state.activePoint == waypoints.length+1 ){
        active = true;
      }
      waypointsJSX.push(
        <WaypointLocation setWaypoint={this.handleWaypointLocation} waypoint={destination}
          type="destination" key={waypoints.length+1}
          index={waypoints.length+1} active={active} />
      )
    }
    if(waypointsJSX.length < 1){
      waypointsJSX = (
        <div className="sidebar-waypoint-picker text-center">no waypoints set</div>
      );
    }
    var addressJSX = (
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
    );

    return (
      <div className="sidebar-tab">
        <div className="waypoint-container waypoint-active">
          <Accordion toggle={true} title={"Find A Stop Near You"}
            jsx={userLocationJSX} />
          <Accordion toggle={false} title={"Find A Stop Near A Waypoint"}
            jsx={waypointsJSX} />
          <Accordion toggle={false} title={"Find A Stop Near An Address"}
            jsx={addressJSX} />
        </div>
      </div>
    );
  }
});

module.exports = LocationTab;
