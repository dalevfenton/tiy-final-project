var React = require('react');
var $ = require('jquery');

var Loading = require('../loading.jsx');
var StationsList = require('./stationslist.jsx');

var GasTab = React.createClass({
  getInitialState: function(){
    return {
      stations: false,
      distance: 10,
      fuelType: 'reg',
      sort: 'distance'
    }
  },
  componentWillMount: function(){
    this.getStations();
  },
  getStations: function(){
    // if(!this.props.currentLocation){
    //   return 'Error: No Location Set!';
    // }
    // http://127.0.0.1:3000/api/gasfeed?endpoint=stations/brands/
    var url = 'http://127.0.0.1:3000/api/gasfeed';
    var lat = this.props.currentLocation.latitude || '-82.3985';
    var long = this.props.currentLocation.longitude || '34.8514';
    var distance = this.state.distance || '10';
    var fuelType = this.state.fuelType || 'reg';
    var sort = this.state.sort || 'distance';
    var endpointStr = '?endpoint=/stations/radius/' + lat +
                      '/' + long +
                      '/' + distance +
                      '/' + fuelType +
                      '/' + sort + '/';

    // var endpointStr = '?endpoint=stations/brands/';
    var url = url+endpointStr;
    console.log( url );
    $.ajax( url ).then(function(data){
      var data = JSON.parse(data);
      console.log('data from gasfeed api');
      console.log(data.geoLocation);
      console.log(data.stations);
      this.setState({'stations': data});
    }.bind(this), function(error){
      console.log('error getting gas info');
      console.log(error);
    });
  },
  render: function(){
    var stations = (<Loading />);
    if(this.state.stations){
      stations = <StationsList collection={this.state.stations}  />
    }
    return (
      <div className="sidebar-tab">
        <h2>Gas Tab</h2>
        {stations}
      </div>
    );
  }
});

module.exports = GasTab;
