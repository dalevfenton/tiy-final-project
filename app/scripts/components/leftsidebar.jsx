var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Parse = require('parse');

var Login = require('./login.jsx');
var ProfileTab = require('./leftsidebar/profiletab.jsx');
var RoutesTab = require('./leftsidebar/routestab.jsx');
var WaypointsTab = require('./leftsidebar/waypointstab.jsx');

var LeftSidebar = React.createClass({
  getInitialState: function(){
    return {
      currentTab: 'route'
    }
  },
  componentDidUpdate: function(){
    if(!Parse.User.current() && this.state.currentTab == 'savedRoutes'){
      this.setState({currentTab: 'profile'});
    }
  },
  setCurrent: function(e){
    if($(e.target).hasClass('glyphicon-user')){
      this.setState({currentTab: 'profile'})
    }
    if($(e.target).hasClass('glyphicon-map-marker')){
      this.setState({currentTab: 'route'})
    }
    if($(e.target).hasClass('glyphicon-road') &&
      this.props.state.routes &&
      this.props.state.routes.length > 0 ){
        this.setState({currentTab: 'savedRoutes'})
    }
  },
  saveRoute: function(name, cb, type){
    // console.log(this.props);
    var route;
    if(type == 'new'){
      var Route = new Parse.Object.extend("Routes");
      route = new Route();
    }else if(type == 'edit'){
      route = this.props.state.currentRoute;
    }else{
      console.log('error: saveRoute called without a type');
    }

    var acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setWriteAccess(Parse.User.current().id, true);
    route.setACL(acl);
    var origin = this.props.directions.getOrigin();
    var destination = this.props.directions.getDestination();
    var waypoints = this.props.directions.getWaypoints();
    if(waypoints.length > 0){
      waypoints = [].concat(origin, waypoints, destination);
    }else{
      waypoints = [origin, destination];
    }
    var coordinatesArr = this.extractCoords(waypoints);
    route.set('waypoints', coordinatesArr);
    route.set('origin_name', origin.properties.text || origin.properties.name);
    route.set('destination_name', destination.properties.text || destination.properties.name);
    route.set('user', Parse.User.current());
    if(name !== ''){
      route.set('route_name', name);
    }
    var self = this;
    route.save().then(function(route){
      self.doCb('success', route, cb);
      self.props.addRoute(route);
    }, function(error){
      self.doCb('error', error, cb);
    });
  },
  doCb(type, obj, cb){
    if(cb){
      cb(type, obj);
    }else{
      console.log('route saved with no callback provided');
      console.log(type, obj);
    }
  },
  setParseProps: function(waypoints, parseObj){
    waypoints.each(function(waypoint){
      for (var prop in waypoint.properties) {
        if (!waypoint.properties.hasOwnProperty(prop)) {
            //The current property is not a direct property of p
            continue;
        }
        //Do your logic with the property here

        var fieldName = prefix + prop;
        // console.log(fieldName, " - ", waypoint.properties[prop]);
        parseObj.set(fieldName, waypoint.properties[prop]);
      }
    });
  },
  extractCoords: function(waypoints){
    var coordinates = waypoints.map(function(waypoint){
      return this.buildPoint(waypoint);
    }.bind(this));
    return coordinates;
  },
  buildPoint: function(waypoint, type){
    var point = {
      latitude: waypoint.geometry.coordinates[1],
      longitude: waypoint.geometry.coordinates[0]
    }
    return point;
  },
  loginUpdate: function(type){
    this.forceUpdate();
  },
  render: function(){
    var profile = "selector selector-profile";
    var route = "selector selector-route";
    var savedRoutes = "selector selector-saved";
    var tab = (<div></div>);
    var title;

    var leftToggle;
    if(this.props.state.toggleLeft){
      leftToggle = "map-overlay sidebar-left collapse-overlay-left collapse-overlay";
    }else{
      leftToggle = "map-overlay sidebar-left";
    }
    if(this.props.state.priorityTab === 'right'){
      leftToggle += " mobile-collapse";
    }
    if(this.state.currentTab == 'profile'){
      profile = "selector selector-profile selector-active";
      title = "Your Profile";
      if(!Parse.User.current()){
        title = "Login or Signup";
      };
      tab = (<ProfileTab resetUser={this.props.resetUser} />);
    }

    if(this.state.currentTab == 'route'){
      title = "Set Your Route";
      route = "selector selector-route selector-active";
      tab = (
        <WaypointsTab props={this.props} state={this.state}
          saveRoute={this.saveRoute} resetRoute={this.props.resetRoute} />
      );
    }

    var conditionalTabs = "";
    if(Parse.User.current()){
      if(this.state.currentTab == 'savedRoutes'){
        savedRoutes = "selector selector-saved selector-active";
        title = "Your Saved Routes";

        tab = (
          <RoutesTab setRoute={this.props.setRoute}
            deleteRoute={this.props.deleteRoute}
            savedRoutes={this.props.state.routes}
            currentRoute={this.props.state.currentRoute} />
        );
      }
      console.log('routes check');
      console.log(this.props.state.routes);
      if(!this.props.state.routes || this.props.state.routes.length < 1){
        savedRoutes = "selector selector-saved selector-disabled";
      }

      conditionalTabs = (
        <li className={savedRoutes}>
          <span className="glyphicon glyphicon-road"
            aria-hidden="true"
            onClick={this.setCurrent}
            ref="selector-location"
          ></span>
        </li>
      )
    }

    return (
      <div className={leftToggle}>
        <div className="overlay-control overlay-control-left">
          <span id="sidebar-brand" className="sidebar-brand">
            <svg className="brand-svg" viewBox="0 0 200 59.9">
              <g>
              	<path d="M35.1,31.7c0.8,0.2,0.6,0.8,0.2,1.4c-0.3,0.5-0.5,0.6-1.1,0.7c-0.8,0.1-1.5,0.7-2.2,1c-1,0.3-2,0.2-3,0.6
              		c-0.8,0.3-1.4,0.6-2.3,0.4c-0.6-0.1-1.8-0.4-2.3,0c-0.5,0.3-0.2,1.1-0.4,1.6c-0.2,0.9-0.6,2-1,2.8c-1.4,3.1-4.2,6.5-7.3,8
              		c-1.7,0.8-3.5,0-4.9-0.9c-1.5-0.9-2.8-1.6-3.3-3.4c-0.4-1.4-0.4-3.3-0.2-4.6c0.3-2,1.4-3.7,2.7-5.2c1.1-1.4,2.5-2.6,4-3.6
              		c0.8-0.5,1.6-0.9,2.4-1.1c0.4-0.1,0.9-0.2,1.3-0.2c0.3,0,0.6,0,0.8-0.1c-0.1-0.2,0-0.3,0.1-0.5c1.4-1.1,2.5,0.8,3.4,1.5
              		c0.5,0.4,0.9,0.6,1.3,1.2c0.3,0.6,0.7,1.2,1.4,1.4c1.6,0.5,3.3,0.1,4.9,0.2c0.9,0,1.7-0.5,2.6-0.6C33.2,32.2,34.2,31.9,35.1,31.7
              		C35,31.8,35,31.7,35.1,31.7C36,31.9,34.8,31.8,35.1,31.7z M19.7,33.3c-0.9-0.8-1.8-1.6-3.1-1.1c-1.3,0.5-2.6,1.5-3.3,2.7
              		c-1.1,2-2.9,6.3-0.6,8.1c2.3,1.8,4.5-0.2,5.8-2.1c0.8-1.2,1.6-2.4,1.9-3.8c0.1-0.7,0.1-1.4,0-2.1c-0.1-0.3-0.5-1.8-0.9-1.8
              		C19.6,33.2,19.9,33.6,19.7,33.3C18.8,32.5,20,33.7,19.7,33.3z"/>
              	<path d="M33.2,40.6c1.3-0.8,2.1-2.4,3.4-3.4c1.3-1,2-2.4,3.2-3.5c1.5-1.5,3.7-3.6,6-3.7c3.9-0.2,1.1,5.9,0.6,7.6
              		c-0.2,0.9-0.5,1.9-0.6,2.9c-0.1,0.5-0.1,0.9,0.1,1.4c0.4,0,0.8-0.1,1.1-0.1c0.8-0.1,1.5-0.5,2-1c0.8-0.7,1.9-1,2.7-1.6
              		c0.8-0.5,1.6-0.9,2.4-1.3c0.6-0.3,1.3-1.2,2-1.3c0.5-0.1,0.6,0.7,0.4,1.1C56,38.2,55.6,38.6,55,39c-1.6,1-2.8,2.3-4.3,3.3
              		c-1.6,1.2-3.4,2.3-5.2,3.2c-0.9,0.5-2.3,0.9-3.2,0.1c-1.1-1-0.4-4.3-0.2-5.6c0.2-1,0.6-2,0.7-3c0.1-0.4,0.2-1,0.1-1.4
              		c-0.2-0.6-1.5,0.8-1.7,1.1c-1.8,1.8-3.9,3.4-5.8,5.1c-1,0.9-2.1,1.8-3,2.8c-0.9,1-1.5,2.3-2.6,3.1c-0.9,0.6-2.2,1-3.1,0
              		C26,47,26.6,45.7,27,44.7c0.6-1.4,1-2.8,1.7-4.2c0.6-1.2,1.3-2.2,1.7-3.4c0.8-2.5,1.8-4.7,3.1-6.9c0.8-1.4,2.3-3.5,4.1-2.3
              		c0.7,0.5,1.5,1.3,1.2,2.2c-0.2,0.4-0.6,0.7-0.8,1.2c-0.3,0.6-0.6,1.2-0.9,1.8c-0.8,1.2-1.2,2.4-1.8,3.7
              		C34.6,38.1,33.7,39.3,33.2,40.6C33.4,40.5,33.3,40.4,33.2,40.6C34.3,39.9,33.3,40.3,33.2,40.6z"/>
              	<path d="M75.1,8.7c0.2,0.6,0.4,1.2,1,1.4c0.9,0.2,1.2,0.7,0.9,1.7c-0.4,1.6-1.9,3.5-3,4.7c-0.6,0.6-1.3,1.1-1.9,1.7
              		c-0.6,0.8-0.9,1.7-1.5,2.4c-1.3,1.8-2.8,3.5-4.1,5.4c1.9,0.2,3.7-0.3,5.6-0.3c0.8,0,2.2-0.5,2.9,0.1c0.5,0.3,0.1,0.9-0.4,0.9
              		c-0.8,0.1-0.7,0.7-1.2,1.2c-0.5,0.5-1.4,0.4-2.1,0.4c-1,0-2,0.2-2.9,0.3c-1.3,0.2-3.5,0-4.2,1.1c-1,1.5-2.2,2.8-3.3,4.3
              		c-2.4,3.1-3.8,6.8-5.8,10.1c-0.8,1.3-1.5,2.8-2.4,4.1c-0.7,0.9-2.2,1.3-3.1,2c-0.5,0.4-1.5,2.3-2.2,1.1c-0.3-0.5,0.1-1,0.4-1.4
              		c0.6-0.7,1-1.5,1.4-2.3c0.8-1.6,1.8-3,2.8-4.5c1.1-1.5,1.4-3.4,2.4-5c0.8-1.4,1.4-2.9,2.1-4.3c0.6-1.1,2.1-2.6,2.1-3.9
              		c-0.6-0.1-1.3,0.1-1.9,0.2c-0.9,0.1-1.8,0.1-2.7,0.2c-0.5,0.1-1.1,0.5-1.5,0.3c-0.5-0.1-0.8-0.9-1.1-1.3c-0.3-0.4-1.2-1.2-0.6-1.6
              		c0.6-0.5,1.5-0.5,2.2-0.6c1.9-0.4,3.8-0.5,5.7-0.7c0.8-0.1,1.7-0.2,2.5-0.3c0.5-0.3,0.9-1,1.2-1.5c0.7-1.1,1.4-2.2,2.1-3.3
              		c1.9-2.9,4.8-5.4,6.1-8.6c-0.8-0.2-1.7,0.3-2.4,0.5c-1.2,0.4-2.4,0.8-3.7,1.2c-2.2,0.7-4.6,0.6-6.9,0.8c-2.1,0.2-4.7,0.8-6.6,0
              		c-0.8-0.3-1.5-1.1-0.5-1.7c1-0.7,2.5-0.7,3.7-1c1.4-0.3,2.8-0.5,4.3-0.8c1.1-0.2,2.5-0.3,3.4-0.9c0.7-0.4,1.9-0.5,2.7-0.7
              		c1.4-0.3,2.8-0.7,4.1-1c1.1-0.2,2.2-0.5,3.3-0.6c0.6-0.1,1.1-0.1,1.7,0c0.1,0,1.3,0.3,1.2,0.4C75.1,8.8,74.9,8.6,75.1,8.7
              		C75.3,9.4,74.8,8.6,75.1,8.7z"/>
              	<path d="M95.6,31.7c1,0.2,0.5,0.8,0.3,1.4c-0.3,0.7-0.9,0.6-1.6,0.8c-0.9,0.3-1.5,0.8-2.4,1c-1.1,0.2-2.2,0.4-3.3,0.8
              		c-0.9,0.3-3.8-0.6-4.1,0.5c-0.3,1.5-0.6,3.1-1.4,4.5c-0.8,1.4-1.6,2.8-2.8,4c-1.3,1.2-2.5,2.8-4.2,3.5c-0.8,0.4-1.7,0.5-2.5,0.2
              		c-0.4-0.1-0.8-0.3-1.2-0.5c-0.4-0.2-0.7-0.2-1.1-0.4c-1.5-0.6-3-2.1-3.4-3.7c-0.9-3.7,0.3-7.3,2.8-10c1.3-1.4,2.5-2.7,4.2-3.6
              		c0.8-0.4,1.6-0.7,2.5-0.9c0.5-0.1,0.9,0,1.4-0.1c0.5-0.1,0.1-0.3,0.4-0.5c1.2-1,2.6,0.4,3.4,1.3c0.4,0.5,1,0.8,1.2,1.3
              		c0.2,0.6,1,1.4,1.6,1.5c1.6,0.4,3.3,0.1,4.9,0C92.1,32.7,93.9,32.1,95.6,31.7L95.6,31.7C95.5,31.8,95.5,31.7,95.6,31.7
              		C96.3,31.8,95.3,31.8,95.6,31.7z M80.3,33.3c-0.9-0.8-1.8-1.6-3.1-1.1c-1.3,0.5-2.6,1.5-3.3,2.7c-1.1,2-2.9,6.3-0.6,8.1
              		c2.3,1.8,4.5-0.2,5.8-2.1c0.8-1.2,1.6-2.4,1.9-3.8c0.1-0.7,0.1-1.4,0-2.1c-0.1-0.3-0.5-1.8-0.9-1.8C80.1,33.2,80.5,33.6,80.3,33.3
              		C79.4,32.5,80.5,33.7,80.3,33.3z"/>
              	<path d="M105.1,43c1.5-1.9,2.9-3.7,5.1-5c1.2-0.7,2.9-3.2,4.5-2.9c1.1,0.2-0.1,1.8-0.6,2c-1,0.4-1.1,0.8-1.6,1.7
              		c-0.6,1-1.5,1.7-2.2,2.7c-0.7,1-1.8,1.4-2.7,2.2c-0.8,0.7-1.2,1.6-2,2.2c-1,0.7-2,1.5-3.1,2.1c-2.1,1.1-3.8,0.3-5-1.6
              		c-1.5-2.1-0.9-4.7,0.1-6.8c0.5-1.1,1.2-2,1.5-3.2c0.3-0.9,0.1-0.9-0.3-1.7c-0.3-0.6-0.3-1.2-0.4-1.8c-1.5,1-2.8,2.4-3.8,3.9
              		c-0.5,0.7-0.9,1.5-1.4,2.2c-0.3,0.4-1,1-1,1.5c0,0.9-1.7,2.2-2.1,2.9c-0.6,1-1.2,2.1-1.8,3.1c-0.1,0.1-1.6,2.3-1.7,1.3
              		c-0.1-0.6-0.6-1.2-0.7-2.1c-0.1-0.8,0.2-1.7,0.3-2.5c0.3-1.5,2.2-3.2,3.2-4.4c1.2-1.6,2.1-3.3,3.3-4.9c0.9-1.2,1.4-2.8,2.4-3.9
              		c1-1.2,1.6-2.9,3.2-3.5c0.5-0.2,1.1-0.2,1.6-0.1c0.8,0.1,0.3,1,0.3,1.5c0,0.6-0.2,1.4,0,2c0.2,0.5,0.9,1.4,1.3,1.7
              		c1.2,0.9,1.6,2.4,2.4,3.7c0.4,0.6-0.3,1.3-0.6,1.8c-0.6,0.7-0.9,1.7-1.5,2.4c-1,1.2-1.1,2.7,0,3.9C102.8,44.8,103.9,43,105.1,43
              		C105.2,42.8,105,43,105.1,43C105.7,42.2,105,43,105.1,43z"/>
              	<path d="M110.8,35.4c0.7-0.3,1-1.2,1.5-1.7c0.6-0.6,1.1-1.2,1.6-1.9c1.2-1.5,2.6-2.4,4.2-3.3c0.7-0.4,1.5-0.9,2.4-0.9
              		c0.6,0,1.7-0.1,2.3,0.1c1.4,0.6,1.7,2.5,1.7,3.8c0,1.6-0.3,3.3-1.1,4.7c-1.1,2-2.7,2.8-4.7,3.8c-1.4,0.7-3.1,1.6-4.6,2
              		c-0.6,0.2-0.8,0-0.6,0.7c0.1,0.5,0,0.9,0.1,1.4c0.1,0.9,0.6,1,1.4,1.1c3.9,0.5,7.6-2,10.5-4.2c1.6-1.2,2.7-2.8,4.3-4
              		c0.5-0.3,1.3-1,1.9-0.6c1,0.7-0.1,1.9-0.7,2.4c-1.1,0.9-2.1,1.5-3,2.5c-0.6,0.7-1.2,1.3-1.8,1.8c-0.7,0.7-1.5,0.9-2.3,1.4
              		c-0.8,0.5-1.5,1.3-2.3,1.8c-1.2,0.8-2.6,1.3-3.8,2c-1.1,0.6-2,1.1-3.3,0.9c-1.2-0.2-2.3-0.8-3.2-1.5c-1.8-1.4-2.8-4.1-2.3-6.4
              		c0.2-1.1,0.5-2.5,1-3.5C110.2,37,110.8,36.2,110.8,35.4C111.3,35.1,110.8,35.4,110.8,35.4z M119.5,31.9c-1.3,1.7-2.7,3.5-4.3,4.9
              		c-0.4,0.6-1.2,1.2-1.2,2c0.1,1,2-0.1,2.4-0.4c1.8-1,3.2-2.1,4.2-3.9c0.4-0.7,0.8-1.6,0.6-2.4c-0.5-1.5-1.6,0.1-1.9-0.2
              		C119.4,32.1,119.7,31.9,119.5,31.9C118.8,32.8,119.7,31.8,119.5,31.9z"/>
              	<path d="M135.9,28.6c2-0.5-1.2,4.6-1.4,5.1c-0.8,1.8-1.7,3.8-2.3,5.8c-0.4,1.5-0.5,4,0.3,5.4c1.1-0.5,2.1-1.5,2.9-2.4
              		c0.8-1,2.1-2.1,2.4-3.4c1-1.2,1.8-2.5,2-4.1c0.1-1.5,0.1-2.9,1.1-4.1c0.9-1,1.5-1.9,2.8-2.4c0.9-0.3,2.9-0.9,3.5,0.1
              		c0.5,0.8-0.3,2-0.7,2.6c-0.6,1-1.2,1.9-1.6,3c1.3,0.7,3.1,0,4.4-0.3c1.5-0.4,3-0.8,4.5-1.4c0.4-0.2,1.3-0.6,1.5,0
              		c0.2,0.7-0.4,0.9-0.9,1.1c-1.7,0.6-3.3,1.2-5,1.7c-1.3,0.4-2.4,1.4-3.8,1.5c-0.6,0.1-1.2,0-1.8,0.2c-0.7,0.3-1.1,1.4-1.6,2
              		c-1,1.3-2.2,2.3-3.2,3.6c-0.9,1.3-1.9,2.6-3.2,3.5c-1,0.8-2.5,0.9-3.3,1.8c-0.9,0.6-2.1,0.7-2.9,0c-1-0.7-1.4-1.8-1.5-3
              		c-0.1-1.7-0.6-3.2-0.5-4.9c0.3-3,1.7-6.4,3.2-9c0.6-1,1.7-2.4,3-2.4c0.5,0,0.9-0.3,1.4-0.3C135.4,28.5,135.8,28.4,135.9,28.6
              		C136.2,28.6,135.8,28.5,135.9,28.6C137.8,28.1,135.8,28.5,135.9,28.6z"/>
              	<path d="M149.7,35.4c0.7-0.3,1-1.2,1.5-1.7c0.6-0.6,1.1-1.2,1.6-1.9c1.2-1.5,2.6-2.4,4.2-3.3c0.7-0.4,1.5-0.9,2.4-0.9
              		c0.6,0,1.7-0.1,2.3,0.1c1.4,0.6,1.7,2.5,1.7,3.8c0,1.6-0.3,3.3-1.1,4.7c-1.1,2-2.7,2.8-4.7,3.8c-1.4,0.7-3.1,1.6-4.6,2
              		c-0.6,0.2-0.8,0-0.6,0.7c0.1,0.5,0,0.9,0.1,1.4c0.1,0.9,0.6,1,1.4,1.1c3.9,0.5,7.6-2,10.5-4.2c1.6-1.2,2.7-2.8,4.3-4
              		c0.5-0.3,1.3-1,1.9-0.6c1,0.7-0.1,1.9-0.7,2.4c-1.1,0.9-2.1,1.5-3,2.5c-0.6,0.7-1.2,1.3-1.8,1.8c-0.7,0.7-1.5,0.9-2.3,1.4
              		c-0.8,0.5-1.5,1.3-2.3,1.8c-1.2,0.8-2.6,1.3-3.8,2c-1.1,0.6-2,1.1-3.3,0.9c-1.2-0.2-2.3-0.8-3.2-1.5c-1.8-1.4-2.8-4.1-2.3-6.4
              		c0.2-1.1,0.5-2.5,1-3.5C149.1,37,149.7,36.2,149.7,35.4C150.2,35.1,149.7,35.4,149.7,35.4z M158.4,31.9c-1.3,1.7-2.7,3.6-4.3,4.9
              		c-0.4,0.6-1.2,1.2-1.2,2c0.1,1,2-0.1,2.4-0.4c1.8-1,3.2-2.1,4.2-3.9c0.4-0.7,0.8-1.6,0.6-2.4c-0.5-1.5-1.6,0.1-1.9-0.2
              		C158.3,32.1,158.6,31.9,158.4,31.9C157.7,32.8,158.6,31.8,158.4,31.9z"/>
              	<path d="M182.8,43c1.4-1.8,3.1-3.8,5.1-5c1.2-0.7,2.9-3.2,4.5-2.9c1.1,0.2-0.1,1.8-0.6,2c-1,0.4-1.1,0.8-1.6,1.7
              		c-0.5,1-1.5,1.7-2.2,2.7c-0.7,1-1.8,1.4-2.7,2.2c-0.8,0.7-1.2,1.6-2,2.2c-1,0.7-2,1.5-3.1,2.1c-2.1,1.1-3.8,0.3-5-1.6
              		c-1.5-2.1-0.9-4.7,0.1-6.8c0.5-1.1,1.2-2,1.5-3.2c0.3-0.9,0.1-0.9-0.3-1.7c-0.3-0.6-0.3-1.2-0.4-1.8c-1.5,1-2.8,2.4-3.8,3.9
              		c-0.5,0.7-0.9,1.5-1.4,2.2c-0.3,0.4-1,1-1,1.5c0,0.9-1.7,2.2-2.1,2.9c-0.6,1-1.2,2.1-1.8,3.1c-0.1,0.1-1.6,2.3-1.8,1.3
              		c-0.1-0.6-0.6-1.2-0.7-2.1c-0.1-0.8,0.2-1.7,0.3-2.5c0.3-1.5,2.2-3.2,3.2-4.4c1.2-1.6,2.1-3.3,3.3-4.9c0.9-1.2,1.4-2.8,2.4-3.9
              		c1-1.2,1.6-2.9,3.2-3.5c0.5-0.2,1.1-0.2,1.6-0.1c0.8,0.1,0.3,1,0.3,1.5c0,0.6-0.2,1.4,0,2c0.2,0.5,0.9,1.4,1.3,1.7
              		c1.2,0.9,1.6,2.4,2.4,3.7c0.4,0.6-0.3,1.3-0.6,1.8c-0.6,0.7-0.9,1.7-1.5,2.4c-1,1.2-1.1,2.7,0,3.9C180.5,44.8,181.6,43,182.8,43
              		C182.9,42.8,182.7,43,182.8,43C184.1,41.3,182.7,43,182.8,43z"/>
              </g>
            </svg>
          </span>
          <span className="close-overlay" onClick={this.props.toggleLeft}>
            <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
          </span>
        </div>
        <div className="location-selectors">
          <ul>
            <li className={profile}>
              <span className="glyphicon glyphicon-user"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-hotel"
              ></span>
            </li>
            {conditionalTabs}
            <li className={route}>
              <span className="glyphicon glyphicon-map-marker"
                aria-hidden="true"
                onClick={this.setCurrent}
                ref="selector-location"
              ></span>
            </li>
          </ul>
        </div>
        <div className="sidebar-body">
          <div className="sidebar-accordion-title dtr-title">
            - {title} -
          </div>
          {tab}
        </div>
      </div>
    );
  }
});

module.exports = LeftSidebar;
