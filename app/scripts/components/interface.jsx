var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Sortable = require('sortablejs');
var Parse = require('parse');


var RightSidebar = require('./rightsidebar.jsx');
var LeftSidebar = require('./leftsidebar.jsx');

var Splash = require('./splash.jsx');
var Login = require('./login.jsx');

// var GEOCODER_BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
// use the old v4 api in order to match up with the format retrieved by the
// mapbox directions library

var GEOCODER_BASE = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/';

var Interface = React.createClass({
  //React Lifecycle Methods
  getInitialState: function(){
    return {
      userLocation: this.props.userLocation,
      userLocationEnabled: this.props.userLocationEnabled,
      routes: null,
      currentRoute: null,
      splash: true,
      numPoints: 2,
      loginToggle: false,
      toggleLeft: false,
      toggleRight: false,
      priorityTab: 'left',
      activePoint: 0,
      currentLocation: {}
    }
  },
  componentWillMount: function(){
    this.props.router.on('route', this.callback);
    this.props.directions.on('profile, selectRoute, load', this.callback );
    this.props.directions.on('origin', this.setPoint);
    this.userLayer = L.featureGroup().addTo(this.props.map);
    if(Parse.User.current()){
      this.loadRoutes();
    }
    if(this.state.userLocationEnabled){
      this.setUserLocation(this.state.userLocation);
    }
    // this.props.directions.on('destination', this.destinationSet);
    // this.props.directions.on('waypoint', this.waypointSet);
    // this.props.directions.on('origin, destination, waypoint', this.setPoint);
  },
  componentDidMount: function(){
    // var el = document.getElementById('waypoint-list');
    // var options = {
    //   'handle': ".waypoint-handle",
    //   'draggable': 'div.waypoint-container',
    //   'scroll': false,
    //   'sort': true,
    //   'onEnd': this.handleSort
    // };
    // var sortable = Sortable.create(el, options);
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
    var obj;
    console.log('eObj inside doGeocode:');
    console.log(eObj);
    if(typeof eObj == 'object'){
      if(eObj.type == "Feature"){
        obj = eObj;
      }else{
        obj = eObj.object;
      }
      // console.log('location is an object');
      if( obj.properties.name ){
        //if we already have a name then this has been geocoded already;
        // this.setMapView(location);
        // console.log('location is already geocoded');
        this.resolveGeocode(obj, cb);
        return this;
      }else if(obj.properties.query){
        //if we only have a query string set it as the geocoding search
        // console.log('location has a query');
        if(typeof obj.properties.query == 'string'){
          // console.log('query is a string');
          locationParsed = obj.properties.query;
        }
        if(typeof obj.properties.query == 'object'){
          // console.log('query is an array');
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
    // console.log(locationParsed);
    var query = '';
    var url = GEOCODER_BASE + locationParsed +
              '.json?&access_token=' + L.mapbox.accessToken +
              query ;
    $.ajax(url).then(function(data){
      // console.log(data);
      var newpoint = data.features[0];
      obj.geometry.coordinates = newpoint.center;
      obj.properties.name = newpoint.place_name;
      obj.properties.text = newpoint.text;
      this.resolveGeocode(obj, cb);
    }.bind(this), function(error){
      console.log(error);
    });
  },
  rebuildWaypoints: function(waypoints){
    waypoints = waypoints.map(function(waypoint){
      return L.latLng(waypoint.latitude, waypoint.longitude);
    });
    return waypoints;
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
    // console.log('setMapView called', newpoint);
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
    }else if(origin || destination || newpoint){
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
    if(typeof e[e.type] == 'object' &&
        !e[e.type].properties.hasOwnProperty('name') &&
        !this.props.directions.queryable() ){
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
    // console.log(this.props.directions);
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

    //if we are doing our initial load then show the splash screen:
    if(this.state.splash && localStorage.getItem("geolocation") === null ){
      return (
        <Splash setupGeo={this.setupGeo}
          resetUser={this.props.resetUser}
        />
      );
    }

    //check if the user's location is known and if so update their marker on the map
    var userLocation = null;
    if(this.state.userLocationEnabled){
      userLocation = this.state.userLocation.geometry.coordinates;
      // console.log(userLocation);
      var marker = L.marker([userLocation[1], userLocation[0]],
        {
          draggable: false,
          icon: L.divIcon({
              iconSize: L.point(16, 16),
              'className': "mapbox-marker-special mapbox-marker-user-icon",
          })
      });
      this.userLayer.clearLayers();
      this.userLayer.addLayer(marker);
    }

    return (
      <div>
        <LeftSidebar toggleLeft={this.toggleLeft}
          addPoint={this.addPoint} addRoute={this.addRoute} state={this.state}
          directions={this.props.directions}
          updateMap={this.updateMap} setActive={this.setActive}
          removePoint={this.removePoint} setRoute={this.setRoute}
          resetRoute={this.resetRoute}
          resetUser={this.resetUser} deleteRoute={this.deleteRoute} />

        <RightSidebar toggle={this.state.toggleRight} toggleRight={this.toggleRight}
          directions={this.props.directions} activePoint={this.state.activePoint}
          numPoints={this.state.numPoints} doGeocode={this.doGeocode}
          setupGeo={this.setupGeo} setLocation={this.setLocation}
          directionsLayer={this.props.directionsLayer} map={this.props.map}
          resetRightSidebarDone={this.resetRightSidebarDone}
          userLocation={this.state.userLocation} state={this.state} props={this.props} />
      </div>
    );
  },
  //----------------------------------------------------------------------------
  //                    Handler methods managing state
  //----------------------------------------------------------------------------
  addPoint: function(){
    this.setState({'numPoints': this.state.numPoints+1});
  },
  addRoute: function(route){
    var routes = this.state.routes;
    routes.push(route);
    this.setState({'routes': routes});
  },
  deleteRoute: function(index, cb){
    var routes = this.state.routes;
    var route = routes.splice(index, 1)[0];
    route.destroy().then(function(data){
      cb('success', data);
    }.bind(this), function(error){
      console.log('error destroying route');
      cb('error', error);
    }.bind(this));
  },
  loadRoutes: function(){
    var Routes = Parse.Object.extend("Routes");
    var query = new Parse.Query(Routes);
    query.equalTo('user', Parse.User.current());
    query.find().then(function(routes){
      this.setState({'routes': routes});
    }.bind(this), function(error){
      //build out an alert to the user here
      console.log('error fetching user routes on load', error);
    });
  },
  setupGeo: function(bool){
    if ( bool && "geolocation" in navigator) {
      localStorage.setItem("geolocation", "true");
      /* geolocation is available */
      navigator.geolocation.watchPosition( this.setUserLocation, this.userLocationError);
    } else {
      /* geolocation IS NOT available */
      localStorage.setItem("geolocation", "false");
      var error;
      if(bool){
        error = {code: 4, message:'geolocation not available'};
      }else{
        error = {code: 1, message:'permission denied'};
      }
      this.userLocationError(error);
    }
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
  resetRoute: function(){
    this.props.directions._unload();
    this.props.directionsLayer._unload();
    this.props.directions.setOrigin('');
    this.props.directions.setDestination('');
    this.setState({
      resetRightSidebar: true,
      currentRoute: null,
      numPoints: 2,
      activePoint: 0,
      // currentLocation: {}
    });
  },
  resetRightSidebarDone: function(){
    // console.log('turning off rightSidebar Reset');
    this.setState({resetRightSidebar: false});
  },
  resetUser: function(result, type){
    var startPt = [39.833333, -98.583333];
    if(type === 'logout'){
      this.setState({
        routes: null,
        userLocation: this.props.directions._normalizeWaypoint( L.latLng(startPt[0], startPt[1]) ),
        userLocationEnabled: false
      });
      this.resetRoute();
    }
    if(type === 'login'){
      this.loadRoutes();
    }
    if(type === 'signup'){
      this.forceUpdate();
    }
  },
  setActive: function(index){
    this.setState({activePoint: index});
  },
  setLocation: function(waypoint, index){
    // console.log(waypoint, index);
    this.setState({activePoint: index});
  },
  setLogin: function(e){
    this.setState({login: !this.state.login});
  },
  setRoute: function(index){
    var waypoints = this.state.routes[index].get('waypoints');
    waypoints = this.rebuildWaypoints(waypoints);
    var origin = waypoints.splice(0,1)[0];
    var destination = waypoints.splice(-1, 1)[0];
    this.props.directions.setOrigin(origin);
    this.props.directions.setDestination(destination);
    this.props.directions.setWaypoints(waypoints);
    this.updateMap();
    this.setState({currentRoute: this.state.routes[index]});
  },
  setUserLocation: function(position){
    console.log('does position have the property coords?', position.hasOwnProperty('coords'));
    if(position.coords){
      position = this.props.directions._normalizeWaypoint(
        L.latLng(position.coords.latitude, position.coords.longitude)
      );
    }
    this.doGeocode(position, this.userGeocoded);
  },
  userGeocoded: function(userLocation){
    this.setState({'userLocation': userLocation, 'userLocationEnabled': true});
    if(this.state.splash){
      this.setMapView(userLocation);
      this.setState({splash:false});
    }
  },
  toggleLeft: function(e){
    var priority = 'none';
    if(this.state.toggleLeft && !this.state.toggleRight){
      priority = 'left';
    }
    this.setState({
      toggleLeft: !this.state.toggleLeft,
      priorityTab: priority
    });
  },
  toggleRight: function(e){
    var priority = 'none';
    if(!this.state.toggleLeft && this.state.toggleRight){
      priority = 'right';
    }
    this.setState({
      toggleRight: !this.state.toggleRight,
      priorityTab: priority
    });
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
    this.setState({
      'userLocationEnabled': false,
      'userLocationError': error.message,
      'splash': false
    });
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
