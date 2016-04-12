//3rd party libs
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');

//bring in mapbox and mapbox directions
require('mapbox.js');
require('mapbox-directions.js');

var startPt, startZoom;
if ("geolocation" in navigator) {
  /* geolocation is available */
  navigator.geolocation.getCurrentPosition(function(position) {
    startPt = [position.coords.latitude, position.coords.longitude];
    startZoom = 13;
    setupApp(startPt, startZoom);
    // this.doGeocode(position);
  });
} else {
  /* geolocation IS NOT available */
  startPt = [39.833333, -98.583333];
  startZoom = 5;
  setupApp(startPt, startZoom);
}

function setupApp(startPt, startZoom){
  //set accessToken and instatiate our map object
  L.mapbox.accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';
  var map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: false
  }).setView(startPt, startZoom);

  // create the initial directions object, from which the layer
  // and inputs will pull data.
  var directions = L.mapbox.directions();
  var directionsLayer = L.mapbox.directions.layer(directions)
      .addTo(map);

  
  // var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions)
  //     .addTo(map);
  //
  // var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions)
  //     .addTo(map);
  // //
  var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions)
      .addTo(map);
  // console.log(map);
  // console.log(directions);

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
      'location': {'latitude': 39.833333, 'longitude': -98.583333}
    } ),
    document.getElementById('app')
  );
}
