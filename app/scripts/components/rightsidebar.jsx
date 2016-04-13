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
      currentLocation: null,
      distance: 40000,
      fuelType: 'reg',
      sort: 'distance',
      hotels: null,
      restaurants: null,
      stations: null
    }
  },
  componentWillMount: function(){
    var point = this.getCurrentPoint();
    var markerLayer = L.featureGroup().addTo(this.props.map);
    this.setState({location: point, markerLayer: markerLayer});
  },
  getCurrentPoint: function(){
    //Set the current location based on the activePoint
    var currentLocation = this.props.directions._normalizeWaypoint('');
    // if(this.props.activePoint == 0){
    //   currentLocation = this.props.directions.getOrigin();
    // }else if(this.props.activePoint == this.props.numPoints-1){
    //   currentLocation = this.props.directions.getDestination();
    // }else if(this.props.directions.getWaypoints()[activePoint+1] ){
    //   currentLocation = this.props.directions.getWaypoints()[activePoint+1];
    // }
    return currentLocation;
  },
  componentDidUpdate: function(){
    if(this.props.activePoint < 0 || this.props.activePoint > this.props.numPoints-1 ){
      console.log('current location not set');
      return 'no current location set, aborting RightSidebar queries';
    }
    // var currentLocation = this.getCurrentPoint();
    // if(!this.state.hotels && !this.state.restaurants
    //   && !this.state.stations && currentLocation.geometry.coordinates ){
    //   this.getStations();
    //   this.getRestaurants();
    //   this.getHotels();
    // }
  },
  setCurrent: function(e){
    if($(e.target).hasClass('glyphicon-map-marker')){
      this.setState({currentTab: 'location'})
    }
    if($(e.target).hasClass('glyphicon-tent') && this.state.hotels){
      this.setState({currentTab: 'hotel'})
    }
    if($(e.target).hasClass('glyphicon-apple') && this.state.restaurants){
      this.setState({currentTab: 'food'})
    }
    if($(e.target).hasClass('glyphicon-flash') && this.state.stations){
      this.setState({currentTab: 'gas'})
    }
  },
  getStations: function(){
    var url = PROXYURL + 'gasfeed';
    var lat = this.state.currentLocation.geometry.coordinates[1] || '-82.3985';
    var long = this.state.currentLocation.geometry.coordinates[0] || '34.8514';
    var distance = '25';
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
      console.log(data);
      this.setMarkers(data.stations.splice(0, 20), 'gas');
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
    var lat = this.state.currentLocation.geometry.coordinates[1] || '-82.3985';
    var long = this.state.currentLocation.geometry.coordinates[0] || '34.8514';
    var distance = this.state.distance || '20000'; //distance is in meters, max of 40000
    var catTerm = category + "Term";
    var term = this.state[catTerm] || '';
    var endpointStr = '?term=' + term +
                      // '&limit=' + 10 +
                      '&ll=' + lat + "," + long +
                      '&category_filter=' + category +
                      '&radius_filter=' + distance;

    var url = url+endpointStr;
    console.log( url );
    $.ajax( url ).then(function(data){
      console.log('data from yelp api');
      console.log(data);
      var obj = {};
      obj[category] = data;
      this.setMarkers(data.businesses, category);
      this.setState(obj);
    }.bind(this), function(error){
      console.log('error getting yelp info');
      console.log(error);
    });
  },
  setMarkers: function(businesses, type){

    businesses.forEach(function(business){
      var coords;
      if(type == 'gas'){
        coords = {latitude: business.lat, longitude: business.lng};
      }else{
        coords = business.location.coordinate;
      }

      var className = "mapbox-marker-special mapbox-marker-" + type + "-icon";
      var marker = L.marker([coords.latitude, coords.longitude],
        {
          draggable: false,
          icon: L.divIcon({
              iconSize: L.point(32, 32),
              'className': className,
          })
      });
      this.state.markerLayer.addLayer(marker);
      // marker.addTo(this.props.markerLayer);
      // this.props.directionsLayer.addLayer(marker);
    }.bind(this));
  },
  setLocation: function(waypoint){
    console.log('waypoint in setLocation', waypoint);
    this.props.doGeocode(waypoint, this.handleGeocode);
    this.state.markerLayer.clearLayers();
  },
  handleGeocode: function(waypoint){
    console.log(waypoint);
    this.setState({currentLocation: waypoint});
    this.getStations();
    this.getRestaurants();
    this.getHotels();
  },
  render: function(){
    var location = "selector selector-location";
    var hotel = "selector selector-hotel";
    var food = "selector selector-food";
    var gas = "selector selector-gas";
    var tab = (<div></div>);

    //Set the correct classes to toggle the sidebar open and closed
    var rightToggle;
    if(this.props.toggle){
      rightToggle = "map-overlay sidebar-right collapse-overlay-right collapse-overlay";
    }else{
      rightToggle = "map-overlay sidebar-right";
    }


    var currentLocation = this.getCurrentPoint();
    //display the active tab
    if(this.state.currentTab == 'location'){
      location = "selector selector-location selector-active";
      tab = (<LocationTab location={this.props.location}
        currentLocation={currentLocation} setLocation={this.setLocation}
        userLocation={this.props.userLocation} />);
    }
    if(this.state.currentTab == 'hotel'){
      hotel = "selector selector-hotel selector-active";
      tab = (<HotelTab location={this.props.location} hotels={this.state.hotels} />);
    }else if(!this.state.hotels){
      hotel = "selector selector-hotel selector-disabled";
    }
    if(this.state.currentTab == 'food'){
      food = "selector selector-food selector-active";
      tab = (<FoodTab location={this.props.location} restaurants={this.state.restaurants} />);
    }else if(!this.state.restaurants){
      food = "selector selector-food selector-disabled";
    }
    if(this.state.currentTab == 'gas'){
      gas = "selector selector-gas selector-active";
      tab = (<GasTab location={this.props.location} stations={this.state.stations} />);
    }else if(!this.state.stations){
      gas = "selector selector-gas selector-disabled";
    }

    return (
      <div className={rightToggle}>
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
