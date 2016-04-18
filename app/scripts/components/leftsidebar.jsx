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
    // console.log(e);
    if($(e.target).hasClass('glyphicon-user')){
      this.setState({currentTab: 'profile'})
    }
    if($(e.target).hasClass('glyphicon-map-marker')){
      this.setState({currentTab: 'route'})
    }
    if($(e.target).hasClass('glyphicon-road')){
      this.setState({currentTab: 'savedRoutes'})
    }
  },
  saveRoute: function(name, cb, type){
    console.log(this.props);
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
      }else if(!this.props.state.routes){
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
