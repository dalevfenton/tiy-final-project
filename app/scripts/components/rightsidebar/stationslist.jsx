var React = require('react');

var StationsList = React.createClass({
  render: function(){
    var stations = this.props.collection.stations.map(function(station, index){
      if(index < 10){
        return (
          <div className="station-detail" key={index}>
            <h6>{station.station}</h6>
            <span className="distance">{station.distance}</span>
            <span className="address">{station.address}, {station.city}, {this.props.collection.geoLocation.region_short}</span>
          </div>
        );
      }
    }.bind(this));
    return (
      <div>
        <h3>Stations List Here</h3>
        {stations}
      </div>
    );
  }
});

module.exports = StationsList;
