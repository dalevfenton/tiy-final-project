var React = require('react');
var $ = require('jquery');
require('leaflet.markercluster');

var FoodTab = require('./rightsidebar/foodtab.jsx');
var GasTab = require('./rightsidebar/gastab.jsx');
var HotelTab = require('./rightsidebar/hoteltab.jsx');
var LocationTab = require('./rightsidebar/locationtab.jsx');
var Indicator = require('./rightsidebar/indicator.jsx');

var PROXYURL = 'http://node-proxy-dvf.herokuapp.com/api/';

var RightSidebar = React.createClass({
  getInitialState: function(){
    return {
      currentBusiness: null,
      currentTab: "location",
      currentLocation: null,
      distance: 1610,
      fuelType: 'reg',
      sort: 'distance',
      hotels: null,
      restaurants: null,
      stations: null
    }
  },
  componentWillMount: function(){
    var markerLayer = new L.MarkerClusterGroup().addTo(this.props.map); //;L.featureGroup()
    this.setState({markerLayer: markerLayer});
  },
  componentDidUpdate: function(){
    if(this.props.activePoint < 0 || this.props.activePoint > this.props.numPoints-1 ){
      console.log('current location not set');
      return 'no current location set, aborting RightSidebar queries';
    }
    if(this.props.state.resetRightSidebar){
      //reset the state of this sidebar
      console.log('reseting right sidebar');
      this.setState({
        currentBusiness: null,
        currentTab: "location",
        // currentLocation: null,
        hotels: null,
        restaurants: null,
        stations: null
      });
      this.props.resetRightSidebarDone();
    }
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
  getStations: function(waypoint){
    var url = PROXYURL + 'gasfeed';
    var lat = waypoint.geometry.coordinates[1] || '-82.3985';
    var long = waypoint.geometry.coordinates[0] || '34.8514';
    var distance = '1';
    var fuelType = this.state.fuelType || 'reg';
    var sort = this.state.sort || 'distance';
    var endpointStr = '?endpoint=/stations/radius/' + lat +
                      '/' + long +
                      '/' + distance +
                      '/' + fuelType +
                      '/' + sort + '/';

    var url = url+endpointStr;
    // console.log( url );
    $.ajax( url ).then(function(data){
      var gas = $.extend({}, JSON.parse(data));
      console.log('data from gas feed api');
      console.log(gas);
      this.setMarkers(gas.stations.slice(0, 20), 'gas');
      this.setState({'stations': gas.stations.slice(0,20)});
    }.bind(this), function(error){
      console.log('error getting gas info');
      console.log(error);
    });
  },
  getRestaurants: function(waypoint){
    this.getYelp("restaurants", waypoint);
  },
  getHotels: function(waypoint){
    this.getYelp("hotels", waypoint);
  },
  getYelp: function(category, waypoint){
    var url = PROXYURL + 'yelp';
    var lat = waypoint.geometry.coordinates[1] || '-82.3985';
    var long = waypoint.geometry.coordinates[0] || '34.8514';
    var distance = this.state.distance || '1610'; //distance is in meters, max of 40000
    var catTerm = category + "Term";
    var term = this.state[catTerm] || '';
    var endpointStr = '?term=' + term +
                      // '&limit=' + 10 +
                      '&ll=' + lat + "," + long +
                      '&category_filter=' + category +
                      '&radius_filter=' + distance;

    var url = url+endpointStr;
    // console.log( url );
    $.ajax( url ).then(function(data){
      console.log('data from yelp api');
      console.log(data);
      var obj = {};
      obj[category] = data;
      this.setMarkers(data, category);
      this.setState(obj);
    }.bind(this), function(error){
      console.log('error getting yelp info');
      console.log(error);
    });
  },
  loadMarkers(type){
    if(type === 'all'){
      this.setMarkers(this.state.hotels, 'hotels');
      this.setMarkers(this.state.restaurants, 'restaurants');
      this.setMarkers(this.state.stations, 'gas');
    }
    if(type === 'hotels'){
      this.setMarkers(this.state.hotels, 'hotels');
    }
    if(type === 'restaurants'){
      this.setMarkers(this.state.restaurants, 'restaurants');
    }
    if(type === 'gas'){
      this.setMarkers(this.state.stations, 'gas');
    }
  },
  setBusiness: function(type, index){
    // var businesses;
    // console.log(type, index);
    // if(type === 'hotels'){
    //   businesses = this.state.hotels.businesses;
    // }
    // if(type === 'restaurants'){
    //   businesses = this.state.retaurants.businesses;
    // }
    // if(type === 'gas'){
    //   businesses = this.state.stations;
    // }
    // console.log(this.state);
    // console.log(businesses);
    // console.log(businesses[index]);
    this.setState({currentBusiness: {type: type, index: index}});
  },
  setMarkers: function(businesses, type){
    if(!businesses){
      return this;
    }
    // console.log('type: ', type);
    if((type === 'hotels' || type === 'restaurants') && businesses.hasOwnProperty('businesses')){
      businesses = businesses.businesses;
    }
    // console.log(businesses);
    businesses.forEach(function(business, index){
      var coords, address, city, state, zip, name;
      if(type == 'gas'){
        // console.log('gas marker: ', business);
        coords = {latitude: business.lat, longitude: business.lng};
        address = business.address;
        city = business.city;
        state = business.region;
        zip = business.zip;
        name = business.station;
      }else{
        coords = business.location.coordinate;
        address = business.location.address[0];
        city = business.location.city;
        state = business.location.state_code;
        zip = business.location.postal_code;
        name = business.name;
      }
      var className = "mapbox-marker-special mapbox-marker-" + type + "-icon";
      if(this.state.currentBusiness &&
        this.state.currentBusiness.type == type &&
        this.state.currentBusiness.index == index ){
        className += " marker-active";
      }
      var marker = L.marker([coords.latitude, coords.longitude],
        {
          draggable: false,
          icon: L.divIcon({
              iconSize: L.point(32, 32),
              'className': className,
          })
      });
      // console.log(business);
      var popupContent =
        '<div>' +
          '<h2>' + name + '<\/h2>' +
        '<p>' + address + '<br \/>' +
        '' + city + ', ' + state + ' ' + zip + '<\/p>' +
        '</div>';
      marker.bindPopup(popupContent).openPopup();
      this.state.markerLayer.addLayer(marker);
      // marker.addTo(this.props.markerLayer);
      // this.props.directionsLayer.addLayer(marker);
    }.bind(this));
    // console.log(this.props);
    // console.log(this.state);
  },
  setLocation(waypoint, index){
    this.state.markerLayer.clearLayers();
    this.props.doGeocode(waypoint, this.handleGeocode);
    this.props.setLocation(waypoint, index);
  },
  handleGeocode: function(waypoint){
    this.setState({'currentLocation': waypoint});
    // console.log(this.state);
    this.getStations(waypoint);
    this.getRestaurants(waypoint);
    this.getHotels(waypoint);
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
    if(this.props.state.priorityTab === 'left'){
      rightToggle += " mobile-collapse";
    }
    this.state.markerLayer.clearLayers();
    //display the active tab
    if(this.state.currentTab == 'location'){
      location = "selector selector-location selector-active";
      tab = (<LocationTab location={this.props.location}
        setLocation={this.setLocation} setupGeo={this.props.setupGeo}
        userLocation={this.props.userLocation}
        state={this.props.state} props={this.props.props} />);
      this.loadMarkers('all');
      // this.setMarkers(this.state.hotels.businesses, 'hotels');
    }
    if(this.state.currentTab == 'hotel'){
      hotel = "selector selector-hotel selector-active";
      tab = (<HotelTab location={this.props.location} hotels={this.state.hotels}
        setBusiness={this.setBusiness} />);
      this.loadMarkers('hotels');
    }else if(!this.state.hotels){
      hotel = "selector selector-hotel selector-disabled";
    }
    if(this.state.currentTab == 'food'){
      food = "selector selector-food selector-active";
      tab = (<FoodTab location={this.props.location}
        restaurants={this.state.restaurants} setBusiness={this.setBusiness} />);
      this.loadMarkers('restaurants');
    }else if(!this.state.restaurants){
      food = "selector selector-food selector-disabled";
    }
    if(this.state.currentTab == 'gas'){
      gas = "selector selector-gas selector-active";
      tab = (<GasTab location={this.props.location} stations={this.state.stations} />);
      this.loadMarkers('gas');
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
              <Indicator items={this.state.hotels}/>
            </li>
            <li className={food}>
              <span className="glyphicon glyphicon-apple"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-food"
              ></span>
              <Indicator items={this.state.restaurants}/>
            </li>
            <li className={gas}>
              <span className="glyphicon glyphicon-flash"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-gas"
              ></span>
            <Indicator items={this.state.stations}/>
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
