var React = require('react');
var $ = require('jquery');
require('leaflet.markercluster');

var haversine = require('../functions').haversine;
var distance = require('../functions').distance;
var findClosest = require('../functions').findClosest;
var offsetWaypoint = require('../functions').offsetWaypoint;

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
      currentTab: 'location',
      currentLocation: null,
      distance: 1,
      offsetType: 'after',
      fuelType: 'reg',
      sort: 'distance',
      hotels: null,
      restaurants: null,
      stations: null
    }
  },
  componentWillMount: function(){
    var markerLayer = new L.MarkerClusterGroup({
      disableClusteringAtZoom: 15
    }).addTo(this.props.map);
    var offsetLayer = new L.featureGroup().addTo(this.props.map);
    this.setState({markerLayer: markerLayer, offsetLayer: offsetLayer});
  },
  componentDidUpdate: function(){
    if(this.props.activePoint < 0 || this.props.activePoint > this.props.numPoints-1 ){
      // console.log('current location not set');
      return 'no current location set, aborting RightSidebar queries';
    }
    if(this.props.state.resetRightSidebar){
      //reset the state of this sidebar
      // console.log('resetting right sidebar');
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
    $.ajax( url ).then(function(data){
      var gas = $.extend({}, JSON.parse(data));
      // console.log('data from gas feed api');
      // console.log(gas);
      this.setMarkers(gas.stations.slice(0, 20), 'gas');
      this.setState({'stations': gas.stations.slice(0,20)});
      this.props.setLoading(false);
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
    // var distance = this.state.distance || '1';
    var catTerm = category + "Term";
    var term = this.state[catTerm] || '';
    var distance = 1609; //convert miles to meters, max of 40000
    var endpointStr = '?term=' + term +
                      // '&limit=' + 10 +
                      '&ll=' + lat + "," + long +
                      '&category_filter=' + category +
                      '&radius_filter=' + distance;

    var url = url+endpointStr;
    // console.log( url );
    $.ajax( url ).then(function(data){
      // console.log('data from yelp api');
      // console.log(data);
      var obj = {};
      obj[category] = data;
      this.setMarkers(data, category);
      this.setState(obj);
      this.props.setLoading(false);
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
  offsetWaypoint: function(waypoint, offset, type){
    // console.log('inside offsetWaypoint');
    var original = waypoint;
    // console.log(this.state.currentLocation);
    // console.log(waypoint);
    // if(!this.state.currentLocation){
    //   return waypoint;
    // }
    var check = this.props.directions.directions;
    // console.log(check);
    if(!check){
      return waypoint;
    }
    this.state.offsetLayer.clearLayers();
    // waypoint = waypoint.geometry.coordinates;
    var coords = check.routes[0].geometry.coordinates;

    var memo = findClosest(waypoint, coords);
    // console.log('result from findClosest in rightsidebar.offsetWaypoint');
    // console.log(memo);
    var curIndex = memo[1];
    var curCoords = memo[2];


    var newPt = offsetWaypoint(offset, coords, curIndex, curCoords);
    var offsetFound = L.marker([newPt[1], newPt[0]], {
      draggable: false,
      icon: L.mapbox.marker.icon({
          'marker-size': 'medium',
          'marker-color': '#FF0000',
          'marker-symbol': '2'
      })
    });
    var offsetOrigin = L.marker([memo[2][1], memo[2][0]], {
      draggable: false,
      icon: L.mapbox.marker.icon({
          'marker-size': 'medium',
          'marker-color': '#FF0000',
          'marker-symbol': '1'
      })
    });
    this.state.offsetLayer.addLayer(offsetFound);
    this.state.offsetLayer.addLayer(offsetOrigin);
    newPt = this.props.directions._normalizeWaypoint(L.latLng(newPt[0], newPt[1]));
    // console.log(newPt);
    return newPt;
  },
  setBusiness: function(type, index){
    this.setState({currentBusiness: {type: type, index: index}});
  },
  setMarkers: function(businesses, type){
    if(!businesses){
      return this;
    }
    if((type === 'hotels' || type === 'restaurants') && businesses.hasOwnProperty('businesses')){
      businesses = businesses.businesses;
    }
    businesses.forEach(function(business, index){
      var coords, address, city, state, zip, name;
      if(type == 'gas'){
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
      var icon;
      if(type == 'restaurants'){
        icon = L.mapbox.marker.icon({
            'marker-size': 'small',
            'marker-color': '#3bb2d0',
            'marker-symbol': 'restaurant'
        })
      }
      if(type == 'hotels'){
        icon = L.mapbox.marker.icon({
            'marker-size': 'small',
            'marker-color': '#3bb2d0',
            'marker-symbol': 'lodging'
        })
      }
      if(type == 'gas'){
        icon = L.mapbox.marker.icon({
            'marker-size': 'small',
            'marker-color': '#3bb2d0',
            'marker-symbol': 'fuel'
        })
      }
      var marker = L.marker([coords.latitude, coords.longitude],
        {
          draggable: false,
          icon: icon
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
    }.bind(this));
  },
  setLocation(waypoint, index){
    this.state.markerLayer.clearLayers();
    //do location offset if needed here
    this.props.setLoading(true);
    // waypoint = this.offsetWaypoint(waypoint, this.state.distance, this.state.offsetType);
    // console.log(waypoint);
    // console.log('props inside right sidebar');
    // console.log(this.props);
    this.props.doGeocode(waypoint, this.handleGeocode);
    this.props.setLocation(waypoint, index);
  },
  handleGeocode: function(waypoint){
    this.setState({'currentLocation': waypoint});
    this.props.setMapView(waypoint);
    // console.log(this.state);
    this.getStations(waypoint);
    this.getRestaurants(waypoint);
    this.getHotels(waypoint);
  },
  setSearch: function(field, e){
    // console.log(field, e.target.value);
    var obj = {};
    obj[field] = e.target.value;
    this.setState(obj);
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
      tab = (<LocationTab currentLocation={this.props.currentLocation}
        setLocation={this.setLocation} setupGeo={this.props.setupGeo}
        userLocation={this.props.userLocation}
        state={this.props.state} props={this.props.props}
        settings={this.state} setSearch={this.setSearch} />);
      this.loadMarkers('all');
      // this.setMarkers(this.state.hotels.businesses, 'hotels');
    }
    if(this.state.currentTab == 'hotel'){
      hotel = "selector selector-hotel selector-active";
      tab = (<HotelTab hotels={this.state.hotels}
        setBusiness={this.setBusiness} />);
      this.loadMarkers('hotels');
    }else if(!this.state.hotels){
      hotel = "selector selector-hotel selector-disabled";
    }
    if(this.state.currentTab == 'food'){
      food = "selector selector-food selector-active";
      tab = (<FoodTab restaurants={this.state.restaurants}
        setBusiness={this.setBusiness} />);
      this.loadMarkers('restaurants');
    }else if(!this.state.restaurants){
      food = "selector selector-food selector-disabled";
    }
    if(this.state.currentTab == 'gas'){
      gas = "selector selector-gas selector-active";
      tab = (<GasTab stations={this.state.stations}
        setBusiness={this.setBusiness} />);
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
              >
              </span>
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
