var React = require('react');
// var Mapbox = require('mapbox-gl');
// var MapboxClient = require('mapbox');
// var accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';

var Map = React.createClass({
  getInitialState: function(){
    return {}
  },
  componentWillMount: function(){
    // var mapClient = new MapboxClient();
  },
  componentDidMount: function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';
    var map = L.mapbox.map('map', 'fourcube.jd03l3mn');
  },
  render: function(){
    console.log(this.mapClient);
    return (
      <div className="map-container">
        <div id="map" className="map-full"></div>
        <div className="map-overlay">
          <h1>Title That Goes Over Map</h1>
        </div>
      </div>
    );
  }
});

module.exports = Map;
