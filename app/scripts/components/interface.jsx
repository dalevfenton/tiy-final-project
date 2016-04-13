var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Sortable = require('sortablejs');

var RightSidebar = require('./rightsidebar.jsx');
var LeftSidebar = require('./leftsidebar.jsx');

var Login = require('./login.jsx');

// var GEOCODER_BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
var GEOCODER_BASE = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/';
var Interface = React.createClass({
  //React Lifecycle Methods
  getInitialState: function(){
    return {
      userLocation: this.props.userLocation,
      numPoints: 2,
      loginToggle: false,
      toggleLeft: false,
      toggleRight: false,
      activePoint: 0,
      userLocationEnabled: this.props.userLocation,
      currentLocation: {}
    }
  },
  componentWillMount: function(){
    this.props.router.on('route', this.callback);
    this.props.directions.on('profile, selectRoute, load', this.callback );
    this.props.directions.on('origin', this.setPoint);
    this.userLayer = L.featureGroup().addTo(this.props.map);
    if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.watchPosition( this.setUserLocation, this.userLocationError);
    } else {
      /* geolocation IS NOT available */
      var error = {code: 4, message:'geolocation not available'};
      this.userLocationError(error);
    }
    // this.props.directions.on('destination', this.destinationSet);
    // this.props.directions.on('waypoint', this.waypointSet);
    // this.props.directions.on('origin, destination, waypoint', this.setPoint);
  },
  componentDidMount: function(){
    var el = document.getElementById('waypoint-list');
    var options = {
      'handle': ".waypoint-handle",
      'draggable': 'div.waypoint-container',
      'scroll': false,
      'sort': true,
      'onEnd': this.handleSort
    };
    var sortable = Sortable.create(el, options);
  },
  componentDidUpdate: function(){
    if(this.props.router.current == 'login' && this.state.loginToggle === false){
      this.setState({'loginToggle': true});
    }
  },
  //utility methods available for map or api handling
  doGeocode: function(eObj, cb){
    var locationParsed = '';
    //figure out what type of location we have and then
    //format a string to properly work with the geocoding api
    console.log(eObj);
    var obj;
    if(typeof eObj == 'object'){
      if(eObj.type == "Feature"){
        obj = eObj;
      }else{
        obj = eObj.object;
      }
      console.log('location is an object');
      console.log(obj);
      if( obj.properties.name ){
        //if we already have a name then this has been geocoded already;
        // this.setMapView(location);
        console.log('location is already geocoded');
        this.resolveGeocode(obj, cb);
        return this;
      }else if(obj.properties.query){
        //if we only have a query string set it as the geocoding search
        console.log('location has a query');
        console.log(typeof obj.properties.query);
        if(typeof obj.properties.query == 'string'){
          console.log('query is a string');
          locationParsed = obj.properties.query;
        }
        if(typeof obj.properties.query == 'object'){
          console.log('query is an array');
          locationParsed = obj.properties.query[0] + ',' + obj.properties.query[1];
        }
      }
    }else if(typeof eObj == 'string'){
      //if we are just passed a string then we can do that as the search
      locationParsed = eObj;
      obj = this.props.directions._normalizeWaypoint(eObj);
    }else{
      //something isn't right, let's get out of here
      console.log('something inst right');
    }

    console.log(locationParsed);
    var query = '';
    // if(this.state.currentLocation && !_.isEmpty(this.state.currentLocation)){
    //   var context = this.state.currentLocation.context;
    //   var country = context[context.length-1].short_code;
    //   query += '&country=' + country;
    //   query += '&proximitiy=' + this.state.currentLocation.center[0] +
    //                       "," + this.state.currentLocation.center[1];
    // }
    var url = GEOCODER_BASE + locationParsed +
              '.json?&access_token=' + L.mapbox.accessToken +
              query ;
    // console.log('geocoding: ', url);
    $.ajax(url).then(function(data){
      // console.log('geocoder results for ', location);
      // console.log(data.features[0].type == "Feature");
      var newpoint = data.features[0];
      obj.geometry.coordinates = newpoint.center;
      obj.properties.name = newpoint.place_name;
      obj.properties.text = newpoint.text;
      this.resolveGeocode(obj, cb);
    }.bind(this), function(error){
      console.log(error);
    });
  },
  resolveGeocode: function(obj, cb){
    if(typeof cb === 'function'){
      cb(obj);
    }else{
      this.setMapView(obj);
    }
  },
  setMapView: function(newpoint){
    //check if we have a route on the screen
    console.log('setMapView called', newpoint);
    if(this.props.directionsLayer._currentWaypoint !== undefined){
      //a drag is happening so don't reset view
      return newpoint;
    }
    var origin = this.props.directions.getOrigin();
    var destination = this.props.directions.getDestination();
    var bounds = this.props.directionsLayer.routeLayer.getBounds();

    //check if we have a route set and set bounds to our map if so
    if(origin && destination && bounds.hasOwnProperty('_southWest')){
      this.props.map.fitBounds(bounds);
    }else if(origin || destination){
      //if we have a point set then check if our point is set or not
      if(!newpoint){
        return newpoint;
      }else{
        //if we pass in a point then set map to that point based on a bounding
        //box or a center point
        if(newpoint.bbox){
          var bbox = newpoint.bbox;
          this.props.map.fitBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
        }else if(newpoint.geometry.coordinates){
          var lat = newpoint.geometry.coordinates[1];
          var long = newpoint.geometry.coordinates[0];
          this.props.map.setView([lat, long], 13);
        }
      }
    }else{
      return newpoint;
    }
    this.forceUpdate();
  },
  setPoint: function(e){
    // console.log('setpoint called');
    // console.log(e);

    if(typeof e[e.type] == 'object' &&
        !e[e.type].properties.hasOwnProperty('name') &&
        !this.props.directions.queryable() ){
        console.log('need to do geocoding');
        var obj = {'type': e.type, 'object': e[e.type]}
        this.doGeocode(obj);
    }
  },
  //event handling functions for map / directions events
  originSet: function(e){
  },
  destinationSet: function(e){
  },
  waypointSet: function(e){
  },
  updateMap: function(){
    if(this.props.directions.queryable()){
      this.props.directions.query({ proximity: this.props.map.getCenter() });
    }else{
      this.forceUpdate();
    }
  },

  //----------------------------------------------------------------------------
  //                              do the render
  //----------------------------------------------------------------------------
  render: function(){
    //return early if we don't have a directions object to use
    if(!this.props.directions){
      return (<div><h1>Error Loading Application - No Directions Available</h1></div>);
    }

    //check if the user's location is known and if so update their marker on the map
    var userLocation = null;
    if(this.state.userLocationEnabled){
      userLocation = this.state.userLocation.geometry.coordinates;
      console.log(userLocation);
      var marker = L.marker(userLocation,
        {
          draggable: false,
          icon: L.divIcon({
              iconSize: L.point(16, 16),
              iconAnchor: L.point(8, 8),
              'className': "mapbox-marker-special mapbox-marker-user-icon",
          })
      });
      this.userLayer.clearLayers();
      this.userLayer.addLayer(marker);
    }

    //Display a button to save the trip once we have a valid directions object
    var button;
    if(this.props.directions.queryable()){
      button = (
        <div className="login-button">
          <a href="#login">Save This Trip</a>
        </div>
      );
    }

    //Display the login / signup form based on state
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
        <LeftSidebar toggleLeft={this.toggleLeft}
          addPoint={this.addPoint} state={this.state}
          directions={this.props.directions}
          updateMap={this.updateMap} setActive={this.setActive}
          removePoint={this.removePoint} />

        <RightSidebar toggle={this.state.toggleRight} toggleRight={this.toggleRight}
          directions={this.props.directions} activePoint={this.state.activePoint}
          numPoints={this.state.numPoints} doGeocode={this.doGeocode}
          directionsLayer={this.props.directionsLayer} map={this.props.map}
          userLocation={this.state.userLocation} state={this.state} props={this.props} />
        {login}
      </div>
    );
  },
  //----------------------------------------------------------------------------
  //                    Handler methods managing state
  //----------------------------------------------------------------------------
  addPoint: function(){
    this.setState({'numPoints': this.state.numPoints+1});
  },
  removePoint: function(index){
    // TODO: figure out why this is not correctly setting the state
    // console.log('removePoint called with index: ', index);
    var newActive = this.state.activePoint-1
    // console.log(newActive);
    if(index > 0){
      // console.log('index greater than 0');
      this.setState({activePoint: 0});
      // console.log(this.state.activePoint);
    }
    this.callback();
  },
  setActive: function(index){
    this.setState({activePoint: index});
  },
  setLogin: function(e){
    this.setState({login: !this.state.login});
  },
  setUserLocation: function(position){
    var userLocation = this.props.directions._normalizeWaypoint(
      L.latLng(position.coords.latitude, position.coords.longitude)
    );
    console.log('location from geolocation watch', userLocation);
    this.setState({'userLocation': userLocation, 'userLocationEnabled': true});
  },
  toggleLeft: function(e){
    this.setState({toggleLeft: !this.state.toggleLeft});
  },
  toggleRight: function(e){
    this.setState({toggleRight: !this.state.toggleRight});
  },
  userLocationError: function(error){
    if(error.code == 1){
      //permission denied
      console.log('gelocation permission denied');
    }else if(error.code == 2){
      //position unavailable
      console.log('geolocation position is unavailable');
    }else if(error.code == 3){
      //position lookup has timed out
      console.log('geolocation position lookup timed out');
    }else if(error.code == 4){
      //geolocation not available in this browser
      console.log('geolocation not available');
    }
    this.setState({'userLocationEnabled': false, 'userLocationError': error.message});
  },
  callback: function(e){
    var numPoints = 0;
    if(this.props.directions.getOrigin()){
      numPoints += 1;
    }
    if(this.props.directions.getDestination()){
      numPoints += 1;
    }
    if(this.props.directions.getWaypoints().length > 0){
      numPoints += this.props.directions.getWaypoints().length;
    }
    if(numPoints < 2){
      numPoints = 2;
    }
    this.setMapView();
    this.setState({'numPoints': numPoints});
    // this.forceUpdate();
  },
  //----------------------------------------------------------------------------
  //                      Sortable event handler
  //----------------------------------------------------------------------------
  handleSort: function(e){
    // console.log(e);
    e.preventDefault();
    var origin = this.props.directions.getOrigin();
    var destination = this.props.directions.getDestination();
    var waypoints = this.props.directions.getWaypoints();
    // console.log(e.oldIndex);
    // console.log(e.newIndex);
    // console.log(this.state.numPoints);
    if(e.oldIndex === 0){
      if(e.newIndex === this.state.numPoints-1){
        //origin moved to destination
        console.log('origin to destination');
        console.log(origin);
        console.log(destination);
        this.props.directions.setOrigin(destination);
        this.props.directions.setDestination(origin);
      }else if(0 < e.newIndex < this.state.numPoints-1){
        //origin moved to waypoint
        console.log('origin to waypoint');
        var newOrigin = waypoints.splice(0,1);
        waypoints.splice(e.newIndex-1, 0, origin);
        this.props.directions.setOrigin(newOrigin[0]);
        this.props.directions.setWaypoints(waypoints);
      }else{
        //this should never actually get called I think
        console.log('origin stayed in same place');
      }
    }else if(e.oldIndex === this.state.numPoints-1){
      if(e.newIndex === 0){
        //destination to origin
        console.log('destination moved to origin');
        this.props.directions.setOrigin(destination);
        this.props.directions.setDestination(origin);
      }else if(0 < e.newIndex < this.state.numPoints-1){
        //destination to waypoint
        console.log('destination moved to waypoint');
        var newDestination = waypoints.splice(-1,1);
        waypoints.splice(e.newIndex-1, 0, destination);
        this.props.directions.setWaypoints(waypoints);
        this.props.directions.setDestination(newDestination[0]);
      }else{
        //this should never actually get called I think
        console.log('destination stayed in same place');
      }
    }else if(0 < e.oldIndex < this.state.numPoints-1){
      if(e.newIndex === 0){
        //waypoint to origin
        console.log('waypoint moved to origin');
        var newOrigin = waypoints.splice(e.oldIndex-1,1);
        waypoints.splice(0, 0, origin);
        this.props.directions.setOrigin(newOrigin[0]);
        this.props.directions.setWaypoints(waypoints);
      }else if(e.newIndex === this.state.numPoints-1){
        //waypoint to destination
        console.log('waypoint moved to destination');
        var newDestination = waypoints.splice(e.oldIndex-1,1);
        waypoints.splice(-1, 0, destination);
        this.props.directions.setDestination(newDestination[0]);
        this.props.directions.setWaypoints(waypoints);
      }else{
        //waypoint to waypoint
        console.log('waypoint moved to another waypoint');
        console.log(waypoints);
        console.log(e.oldIndex);
        console.log(e.newIndex);
        var movingPoint = waypoints.splice(e.oldIndex-1,1)[0];
        console.log(movingPoint);
        console.log(waypoints);
        waypoints.splice(e.newIndex-1, 0, movingPoint);
        console.log(waypoints);
        this.props.directions.setWaypoints(waypoints);
      }
    }
    // console.log('a sort happened');
    // console.log(e);
    // console.log(this.props.directions);
    this.updateMap();
    this.forceUpdate();
  },
});


module.exports = Interface;
