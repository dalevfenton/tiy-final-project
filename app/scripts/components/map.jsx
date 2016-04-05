var React = require("react");
var _ = require("underscore");
// var Mapbox = require("mapbox-gl");

var Map = React.createClass({
  drawMap: function(){
    if(this.props.location){
      this.map.setView([this.props.location.coords.latitude,this.props.location.coords.longitude], 14);
    }
    if(this.props.waypoints){
      // console.log("waypoints are being evaluated");
      // console.log(this.props.waypoints);
      // console.log(this.map);
      // _.each(this.props.waypoints, function(waypoint){
      //   var data = waypoint.features[0];
      //   L.marker([data.center[1], data.center[0]]).addTo(this.map);
      // }.bind(this));

      // if(this.props.waypoints.length >1 ){
      //   mapboxClient.getDirections([
      //      { latitude: 33.6875431, longitude: -95.4431142 },
      //      { latitude: 33.6875431, longitude: -95.4831142 }
      //    ], {
      //      profile: "mapbox.walking",
      //      instructions: "html",
      //      alternatives: false,
      //      geometry: "polyline"
      //    }, function(err, results) {
      //      console.log(results.origin);
      //    });
      // }
    }
  },
  componentDidMount: function(){
    //
    // var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions)
    //     .addTo(map);

    // L.mapbox.accessToken = "pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q";
    //
    // var map = L.mapbox.map("map", "mapbox.streets", { "zoomControl": false})
    //                   .addControl(L.mapbox.geocoderControl("mapbox.places",
    //                   {autocomplete: true, keepOpen: true}));
    // this.map = map;
  },
  componentDidUpdate: function(){
    this.drawMap();
  },
  render: function(){
    return (
      <div className="overall-map">

      </div>
    );
  }
});

module.exports = Map;
