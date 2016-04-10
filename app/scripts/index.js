var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');

var Interface = require('./components/interface.jsx');

var router = require('./router');

require('mapbox.js');
require('mapbox-directions.js');

L.mapbox.accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';
var map = L.mapbox.map('map', 'mapbox.dark', {
    zoomControl: false
}).setView([34.8514, -82.3985], 6);

// move the attribution control out of the way
// map.attributionControl.setPosition('bottomleft');

// create the initial directions object, from which the layer
// and inputs will pull data.
var directions = L.mapbox.directions();
var directionsLayer = L.mapbox.directions.layer(directions)
    .addTo(map);

var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions)
    .addTo(map);

var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions)
    .addTo(map);
//
var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions)
    .addTo(map);
console.log(map);
console.log(directions);

Backbone.history.start();

ReactDOM.render(
  React.createElement(
  Interface,
  {
    'router': router,
    'map': map,
    'directions': directions
  } ),
  document.getElementById('app')
);
