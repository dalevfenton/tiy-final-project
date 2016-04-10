var React = require('react');

var StationsList = React.createClass({
  render: function(){
    var stations = this.props.collection.stations.map(function(station, index){
      if(index < 10){
        var region = station.region;
        if(this.props.collection.geoLocation.region_short){
          region = this.props.collection.geoLocation.region_short;
        }
        return (
          <div className="station-detail detail-item" key={index}>
            <h6>{station.station}</h6>
            <span className="distance">{station.distance}</span>
            <span className="address">{station.address}, {station.city}, {region}</span>
          </div>
        );
      }
    }.bind(this));
    return (
      <div>
        {stations}
      </div>
    );
  }
});

module.exports = StationsList;
