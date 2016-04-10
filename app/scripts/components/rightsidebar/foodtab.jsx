var $ = require('jquery');
var React = require('react');

var RestaurantsList = require('./restaurantslist.jsx');
var Loading = require('../loading.jsx');

var FoodTab = React.createClass({
  getInitialState: function(){
    return {
      restaurants: false,
      distance: 10
    }
  },
  componentWillMount: function(){
    this.getFood();
  },
  getFood: function(){
    var url = this.props.proxy + 'yelp';
    var lat = this.props.currentLocation.latitude || '-82.3985';
    var long = this.props.currentLocation.longitude || '34.8514';
    var location = this.props.currentLocation.name || 'Greenville';
    var distance = this.state.distance || '10';
    var term = this.state.term || 'hot dogs';
    var endpointStr = '?term=' + term +
                      '&location=' + location +
                      '&cll=' + lat + "," + long +
                      '&radius_filter' + distance;

    var url = url+endpointStr;
    console.log( url );
    $.ajax( url ).then(function(data){
      // var data = JSON.parse(data);
      console.log(data);
      console.log('data from yelp api');
      console.log(data.businesses);
      this.setState({'restaurants': data});
    }.bind(this), function(error){
      console.log('error getting gas info');
      console.log(error);
    });
  },
  render: function(){
    var restaurants = (<Loading />);
    if(this.state.restaurants){
      restaurants = <RestaurantsList collection={this.state.restaurants}  />
    }
    return (
      <div className="sidebar-tab">
        {restaurants}
      </div>
    );
  }
});

module.exports = FoodTab;
