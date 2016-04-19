var React = require('react');

var WaypointLocation = require('./waypointlocation.jsx');
var WaypointSettings = require('./waypointsettings.jsx');
var Accordion = require('./accordion.jsx');

var LocationTab = React.createClass({
  getInitialState: function(){
    return {
      display: '',
      activePanel: 'location'
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
    // this.setState({'loading': 'inputLocation'});
  },
  handleUserLocation: function(e){
    e.preventDefault();
    console.log(e.target.value);
    this.props.setLocation(this.props.userLocation);
    // this.setState({'loading': 'userLocation'});
  },
  handleWaypointLocation: function(waypointProps){
    console.log(waypointProps);
    this.props.setLocation(waypointProps.waypoint, waypointProps.index);
  },
  toggleAccordion: function(panel){
    this.setState({activePanel: panel});
  },
  render: function(){
    // console.log(this.props);
    var id = "waypoint-input-" + this.props.index;
    var userLocationJSX
    var waypointsJSX = [];
    // console.log(this.props);
    if(this.props.state.userLocationEnabled){
      var userLocation = this.props.userLocation;
      var coords = userLocation.geometry.coordinates;
      var lat = userLocation[1];
      userLocationJSX = (
        <div>
          <div className="dtr-title">Your Current Location</div>
          <div className="sidebar-info">
            <span className="sidebar-label">latitude: </span>
            <span className="sidebar-label-info">{String(coords[1]).slice(0, 7)}</span>
          </div>
          <div className="sidebar-info">
            <span className="sidebar-label">longitude: </span>
            <span className="sidebar-label-info">{String(coords[0]).slice(0, 8)}</span>
          </div>
          <div className="sidebar-info">
            <span className="sidebar-label">address: </span>
            <span className="sidebar-label-info">{userLocation.properties.name}</span>
          </div>
          <WaypointSettings setSearch={this.props.setSearch} props={this.props.settings} />
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
    var waypointDisable = false;
    if(waypointsJSX.length < 1){
      waypointDisable = true;
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

    var locationToggle = false;
    var waypointsToggle = false;
    var addressToggle = false;
    if(this.state.activePanel == 'location'){
      locationToggle = true;
    }
    if(this.state.activePanel == 'waypoints'){
      waypointsToggle = true;
    }
    if(this.state.activePanel == 'address'){
      addressToggle = true;
    }
    return (
      <div className="sidebar-tab">
        <div className="waypoint-container waypoint-active">
          <Accordion toggle={locationToggle} title={"Find A Stop Near You"}
            jsx={userLocationJSX} panel="location"
            toggleAccordion={this.toggleAccordion} disabled={false} />    
          <Accordion toggle={addressToggle} title={"Find A Stop Near An Address"}
            jsx={addressJSX} panel="address"
            toggleAccordion={this.toggleAccordion} disabled={false} />
          <Accordion toggle={waypointsToggle} title={"Find A Stop Near A Waypoint"}
            jsx={waypointsJSX} panel="waypoints"
            toggleAccordion={this.toggleAccordion} disabled={waypointDisable} />
        </div>
      </div>
    );
  }
});

module.exports = LocationTab;
