//3rd party libs
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var Parse = require('parse');

//bring in mapbox and mapbox directions
require('mapbox.js');
require('mapbox-directions.js');

//setup parse SDK to connect to server
Parse.initialize("dvf_final_project");
Parse.serverURL = 'http://tiy-dvf-final-project.herokuapp.com';

var startPt, startZoom, userLocationEnabled;

setTimeout(doStuff, 0);

function doStuff(){
  if ("geolocation" in navigator && localStorage.getItem("geolocation") === "true") {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
      startPt = [position.coords.latitude, position.coords.longitude];
      startZoom = 13;
      userLocationEnabled = true;
      setupApp(startPt, startZoom, userLocationEnabled);
    }, function(error){
      doNoPositionSetup(error);
    });
  } else {
    /* geolocation IS NOT available */
    var error = {code: 4, message:'geolocation not available'};
    doNoPositionSetup(error);
  }
}

// doNoPositionSetup({code: '5', message: 'app starting user not prompted'});

function doNoPositionSetup(error){
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
  startPt = [39.833333, -98.583333];
  startZoom = 5;
  userLocationEnabled = false;
  setupApp(startPt, startZoom, userLocationEnabled);
}

function setupApp(startPt, startZoom, userLocationEnabled){
  //set accessToken and instatiate our map object
  L.mapbox.accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';
  var map = L.mapbox.map('map', 'mapbox.light', {
      zoomControl: false
  }).setView(startPt, startZoom);
  // create the initial directions object, from which the layer
  // and inputs will pull data.
  var directions = L.mapbox.directions();
  var directionsLayer = L.mapbox.directions.layer(directions)
      .addTo(map);

  startPt = directions._normalizeWaypoint( L.latLng(startPt[0], startPt[1]) );
  // var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions)
  //     .addTo(map);
  //
  // var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions)
  //     .addTo(map);

  var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions)
      .addTo(map);


  // move the attribution control out of the way
  map.attributionControl.setPosition('bottomleft');

  //bring in our controller component
  var Interface = require('./components/interface.jsx');

  //grab our router
  var router = require('./router');

  Backbone.history.start();

  ReactDOM.render(
    React.createElement(
    Interface,
    {
      'router': router,
      'map': map,
      'directions': directions,
      'directionsLayer': directionsLayer,
      'directionsRoutesControl': directionsRoutesControl,
      'userLocation': startPt,
      'userLocationEnabled': userLocationEnabled
    } ),
    document.getElementById('app')
  );
}
