var React = require('react');

var Login = require('./login.jsx');
var Map = require('./map.jsx');
var Waypoint = require('./waypoint.jsx');

var waypointsDummy = ['greenville, sc', 'atlanta, ga', 'nashville, tn'];

var Interface = React.createClass({
  getInitialState: function(){
    return {
      location: null,
      numPoints: 3,
      loginToggle: false
    }
  },
  componentWillMount: function(){
    this.callback = (function(){
      console.log('forceUpdating');
      this.forceUpdate();
    }.bind(this));
    this.props.router.on('route', this.callback);
    this.props.directions.on('load', this.callback );
  },
  handleMap: function(e){
    console.log('map load callback');
    console.log(this.props.directions);

  },
  componentDidMount: function(){

  },
  setMap: function(){

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
    // this.updateMap();
  },
  updateMap: function(){
    console.log('inside update map');
    console.log(this.props.directions);
    console.log(this.props.directions.getWaypoints());
    if(this.props.directions.queryable()){
      console.log('sending directions query');
      this.props.directions.query({ proximity: this.props.map.getCenter() }, function(err, res){
        console.log('results from directions query');
        console.log(err);
        console.log(res);
      });
    }
    console.log(this.props.directions.getWaypoints());
  },
  render: function(){
    console.log('interface render called');
    console.log(this.state);
    if(this.props.directions){
      var waypoints = [];
      var self = this;
      for(var i = 0; i < self.state.numPoints; i++){
        var waypoint = (
          <Waypoint directions={self.props.directions}
            key={i} index={i} numPoints={self.state.numPoints}
            updateMap={self.updateMap}
          /> );
        waypoints.push(waypoint);
      }
      // var waypoints = this.state.waypoints.map(function(waypoint, index, waypointsArr){
      //   console.log(index);
      //   console.log(waypointsArr);
      //   return ( <Waypoint editPoint={this.editPoint} waypoint={waypoint}
      //             key={index} index={index} length={waypointsArr.length} type="edit"
      //             directions={this.props.directions}
      //             updateMap={this.updateMap} /> );
      // }.bind(this));
    }
    console.log('waypoints', waypoints);
    var button;
    if(this.state.numPoints.length > 1){
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
        {waypoints}

        {login}
      </div>
    );
  }
});


module.exports = Interface;
