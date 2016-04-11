var React = require('react');
var $ = require('jquery');

var FoodTab = require('./rightsidebar/foodtab.jsx');
var GasTab = require('./rightsidebar/gastab.jsx');
var HotelTab = require('./rightsidebar/hoteltab.jsx');
var LocationTab = require('./rightsidebar/locationtab.jsx');

var PROXYURL = 'http://127.0.0.1:3000/api/';

var RightSidebar = React.createClass({
  getInitialState: function(){
    return {
      currentTab: "location",
      distance: 10,
      fuelType: 'reg',
      sort: 'distance',
      hotels: null,
      restaurants: null,
      stations: null
    }
  },
  componentWillMount: function(){
    this.getStations();
    this.getRestaurants();
    this.getHotels();
  },
  setCurrent: function(e){
    if($(e.target).hasClass('glyphicon-map-marker')){
      this.setState({currentTab: 'location'})
    }
    if($(e.target).hasClass('glyphicon-tent')){
      this.setState({currentTab: 'hotel'})
    }
    if($(e.target).hasClass('glyphicon-apple')){
      this.setState({currentTab: 'food'})
    }
    if($(e.target).hasClass('glyphicon-flash')){
      this.setState({currentTab: 'gas'})
    }
  },
  getStations: function(){
    // location check to use in real app
    // if(!this.props.currentLocation){
    //   return 'Error: No Location Set!';
    // }
    var url = PROXYURL + 'gasfeed';
    var lat = this.props.location.latitude || '-82.3985';
    var long = this.props.location.longitude || '34.8514';
    var distance = this.state.distance || '10';
    var fuelType = this.state.fuelType || 'reg';
    var sort = this.state.sort || 'distance';
    var endpointStr = '?endpoint=/stations/radius/' + lat +
                      '/' + long +
                      '/' + distance +
                      '/' + fuelType +
                      '/' + sort + '/';

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
  getRestaurants: function(){
    this.getYelp("restaurants");
  },
  getHotels: function(){
    this.getYelp("hotels");
  },
  getYelp: function(category, opts){
    var url = PROXYURL + 'yelp';
    var lat = this.props.location.latitude || '-82.3985';
    var long = this.props.location.longitude || '34.8514';
    var distance = this.state.distance || '10';
    var catTerm = category + "Term";
    var term = this.state[catTerm] || '';
    var endpointStr = '?term=' + term +
                      '&limit=' + 10 +
                      '&ll=' + lat + "," + long +
                      '&category_filter=' + category +
                      '&radius_filter=' + distance;

    var url = url+endpointStr;
    console.log( url );
    $.ajax( url ).then(function(data){
      console.log(data);
      console.log('data from yelp api');
      console.log(data.businesses);
      var obj = {};
      obj[category] = data;
      console.log(obj);
      this.setState(obj);
    }.bind(this), function(error){
      console.log('error getting yelp info');
      console.log(error);
    });
  },
  render: function(){
    // console.log(this.props);
    var location = "selector selector-location";
    var hotel = "selector selector-hotel";
    var food = "selector selector-food";
    var gas = "selector selector-gas";
    var tab = (<div></div>);
    // location = {'latitude': 34.8514, 'longitude': -82.3985};

    if(this.state.currentTab == 'location'){
      location = "selector selector-location selector-active";
      tab = (<LocationTab location={this.props.location} />);
    }
    if(this.state.currentTab == 'hotel'){
      hotel = "selector selector-hotel selector-active";
      tab = (<HotelTab location={this.props.location} hotels={this.state.hotels} />);
    }
    if(this.state.currentTab == 'food'){
      food = "selector selector-food selector-active";
      tab = (<FoodTab location={this.props.location} restaurants={this.state.restaurants} />);
    }
    if(this.state.currentTab == 'gas'){
      gas = "selector selector-gas selector-active";
      tab = (<GasTab location={this.props.location} stations={this.state.stations} />);
    }
    return (
      <div className={this.props.toggle}>
        <div className="overlay-control overlay-control-right">
          <span className="close-overlay" onClick={this.props.toggleRight}>
            <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          </span>
        </div>
        <div className="location-selectors">
          <ul>
            <li className={location}>
              <span className="glyphicon glyphicon-map-marker"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-location"
              ></span>
            </li>
            <li className={hotel}>
              <span className="glyphicon glyphicon-tent"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-hotel"
              ></span>
            </li>
            <li className={food}>
              <span className="glyphicon glyphicon-apple"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-food"
              ></span>
            </li>
            <li className={gas}>
              <span className="glyphicon glyphicon-flash"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-gas"
              ></span>
            </li>
          </ul>
        </div>
        <div className="sidebar-body">
          {tab}
        </div>
      </div>
    );
  }
});

module.exports = RightSidebar;
