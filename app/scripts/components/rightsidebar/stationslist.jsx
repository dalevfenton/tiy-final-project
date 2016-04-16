var React = require('react');

var StationsList = React.createClass({
  render: function(){
    var stations = (
      <div className="sidebar-waypoint-picker text-center">
        No Gas Stations Found
      </div>
    );
    // console.log(this.props);
    if(this.props.collection.length > 0){
      stations = this.props.collection.map(function(station, index){
        if(index < 10){
          var region = station.region;
          // if(this.props.collection.geoLocation.region_short){
          //   region = this.props.collection.geoLocation.region_short;
          // }
          return (
            <div className="station-detail detail-item" key={index}>
              <div className="dtr-title">
                <span className="station-detail-title">{station.station} - </span>
                <span className="station-detail-distance">{station.distance}</span>
              </div>
              <div className="address">{station.address}</div>
              <div className="address">{station.city}, {region}</div>
            </div>
          );
        }
      }.bind(this));
    }

    return (
      <div>
        {stations}
      </div>
    );
  }
});

module.exports = StationsList;
