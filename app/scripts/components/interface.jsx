var React = require('react');

var Login = require('./login.jsx');
var Map = require('./map.jsx');
var Waypoint = require('./waypoint.jsx');

var waypointsDummy = ['greenville, sc', 'atlanta, ga', 'nashville, tn'];

var Interface = React.createClass({
  getInitialState: function(){
    return {
      location: null,
      waypoints: waypointsDummy,
      loginToggle: false
    }
  },
  componentWillMount: function(){
    this.callback = (function(){
      this.forceUpdate();
    }.bind(this));
    this.props.router.on('route', this.callback);
    // if ("geolocation" in navigator) {
    //   /* geolocation is available */
    //   console.log('geolocation available');
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     this.setState({'location': position});
    //     // do_something(position.coords.latitude, position.coords.longitude);
    //   }.bind(this));
    // } else {
    //   /* geolocation IS NOT available */
    //   console.log('no geolocation');
    // }
    //
  },
  componentDidMount: function(){
    this.setMap();
  },
  setMap: function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';
    var map = L.mapbox.map('map', 'mapbox.streets', {
        zoomControl: false
    }).setView([40, -74.50], 9);

    // move the attribution control out of the way
    map.attributionControl.setPosition('bottomleft');

    // create the initial directions object, from which the layer
    // and inputs will pull data.
    var directions = L.mapbox.directions();
    this.setState({'map': map, 'directions': directions});
    var directionsLayer = L.mapbox.directions.layer(directions)
        .addTo(map);

    var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions)
        .addTo(map);

    var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions)
        .addTo(map);
    //
    var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions)
        .addTo(map);
  },
  addPoint: function(waypoint){
    console.log('waypoint inside Interfaces addPoint');
    console.log(waypoint);
    console.log(this.state.waypoints);
    var waypoints = this.state.waypoints;
    waypoints.push(waypoint);
    console.log(waypoints);
    this.setState({'waypoints': waypoints });
  },
  editPoint: function(waypoint, id){
    console.log('inside editPoint');
  },
  componentDidUpdate: function(){
    if(this.props.router.current == 'login' && this.state.loginToggle === false){
      this.setState({'loginToggle': true});
    }
    this.updateMap();
  },
  updateMap: function(){
    console.log('inside update map');
    console.log(this.state.directions);
    console.log(this.state.directions.queryable());
    if(this.state.directions.queryable()){
      console.log('sending directions query');
      this.state.directions.query({ proximity: this.state.map.getCenter() }, function(err, res){
        console.log('results from directions query');
        console.log(err);
        console.log(res);
      });
    }
  },
  render: function(){
    console.log('interface render called');
    console.log(this.state);
    if(this.state.directions){
      var waypoints = this.state.waypoints.map(function(waypoint, index, waypointsArr){
        console.log(index);
        console.log(waypointsArr);
        return ( <Waypoint editPoint={this.editPoint} waypoint={waypoint}
                  key={index} index={index} length={waypointsArr.length} type="edit"
                  directions={this.state.directions}
                  updateMap={this.updateMap} /> );
      }.bind(this));
    }
    var button;
    if(this.state.waypoints.length > 1){
      button = (
        <div className="login-button">
          <a href="#login">Save This Trip</a>
        </div>
      );
    }
    var login;
    if(this.props.router.current == 'login'){
      login = (
        <div className="login">
          <Login />
        </div>
      );
    }
    return (
      <div>
        <div className="map-container">
          <div id="map" className="map-full"></div>
          <Map location={this.state.location} waypoints={this.state.waypoints} />
          <div className="map-overlay">
            <div id="inputs"></div>
            <div id="errors"></div>
            <div id="directions">
              <div id="routes"></div>
              <div id="instructions"></div>
            </div>
            {waypoints}
          </div>
          {login}
        </div>
      </div>
    );
  }
});


module.exports = Interface;
