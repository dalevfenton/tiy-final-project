var React = require('react');

var Login = require('./login.jsx');
var Map = require('./map.jsx');
var WayPoint = require('./waypoint.jsx');

var Interface = React.createClass({
  getInitialState: function(){
    return {
      location: null,
      waypoints: [],
      loginToggle: false
    }
  },
  componentWillMount: function(){
    this.callback = (function(){
      this.forceUpdate();
    }.bind(this));
    this.props.router.on('route', this.callback);
    if ("geolocation" in navigator) {
      /* geolocation is available */
      console.log('geolocation available');
      navigator.geolocation.getCurrentPosition(function(position) {
        this.setState({'location': position});
        // do_something(position.coords.latitude, position.coords.longitude);
      }.bind(this));
    } else {
      /* geolocation IS NOT available */
      console.log('no geolocation');
    }
  },
  addPoint: function(waypoint){
    console.log('waypoint inside Interfaces addPoint');
    console.log(waypoint);
    console.log(this.state.waypoints);
    var waypoints = this.state.waypoints;
    waypoints.push(waypoint);
    console.log(waypoints);
    this.setState({'waypoints': waypoints });
  },
  editPoint: function(waypoint, id){
    console.log('inside editPoint');
  },
  componentDidUpdate: function(){
    if(this.props.router.current == 'login' && this.state.loginToggle === false){
      this.setState({'loginToggle': true});
    }
  },
  render: function(){
    console.log('interface render called');
    console.log(this.state);
    var waypoints = this.state.waypoints.map(function(waypoint){
      return ( <WayPoint editPoint={this.editPoint} waypoint={waypoint}
                key={waypoint.features[0].id} /> );
    }.bind(this));
    var button;
    if(this.state.waypoints.length > 1){
      button = (
        <div className="login-button">
          <a href="#login">Save This Trip</a>
        </div>
      );
    }
    var login;
    if(this.props.router.current == 'login'){
      login = (
        <div className="login">
          <Login />
        </div>
      );
    }
    return (
      <div>
        <div className="map-container">
          <Map location={this.state.location} waypoints={this.state.waypoints} />
          <div className="map-overlay">
            <div className="brand">down the road</div>
            <WayPoint addPoint={this.addPoint} type="edit" />
            {waypoints}
            {button}
          </div>
          {login}
        </div>
      </div>
    );
  }
});

module.exports = Interface;
