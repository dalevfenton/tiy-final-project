var React = require('react');
var Sortable = require('sortablejs');

var Login = require('./login.jsx');
var Waypoint = require('./waypoint.jsx');


var Interface = React.createClass({
  getInitialState: function(){
    return {
      location: null,
      numPoints: 2,
      loginToggle: false
    }
  },
  componentWillMount: function(){
    this.callback = (function(){
      this.forceUpdate();
    }.bind(this));
    this.props.router.on('route', this.callback);
    this.props.directions.on('load', this.callback );
  },
  componentDidMount: function(){
    var el = document.getElementById('waypoint-list');
    var options = {
      'handle': ".waypoint-handle",
      'draggable': 'form',
      'scroll': false,
      'onSort': this.handleSort
    };
    var sortable = Sortable.create(el, options);
  },
  addPoint: function(){
    this.setState({'numPoints': this.state.numPoints+1});
  },
  handleSort: function(e){
    var origin = this.props.directions.getOrigin();
    var destination = this.props.directions.getDestination();
    var waypoints = this.props.directions.getWaypoints();
    if(e.oldIndex === 0){
      if(e.newIndex === this.state.numPoints-1){
        //origin moved to destination
        console.log('origin to destination');
        this.props.directions.setOrigin(destination);
        this.props.directions.setDestination(origin);
      }else if(0 < e.newIndex < this.state.numPoints-1){
        //origin moved to waypoint
        console.log('origin to waypoint');
        var newOrigin = waypoints.splice(0,1);
        waypoints.splice(e.newIndex-1, 0, origin);
        this.props.directions.setOrigin(newOrigin[0]);
        this.props.directions.setWaypoints(waypoints);
      }else{
        //this should never actually get called I think
        console.log('origin stayed in same place');
      }
    }else if(e.oldIndex === this.state.numPoints-1){
      if(e.newIndex === 0){
        //destination to origin
        console.log('destination moved to origin');
        this.props.directions.setOrigin(destination);
        this.props.directions.setDestination(origin);
      }else if(0 < e.newIndex < this.state.numPoints-1){
        //destination to waypoint
        console.log('destination moved to waypoint');
        var newDestination = waypoints.splice(-1,1);
        waypoints.splice(e.newIndex-1, 0, destination);
        this.props.directions.setWaypoints(waypoints);
        this.props.directions.setDestination(newDestination[0]);
      }else{
        //this should never actually get called I think
        console.log('destination stayed in same place');
      }
    }else if(0 < e.oldIndex < this.state.numPoints-1){
      if(e.newIndex === 0){
        //waypoint to origin
        console.log('waypoint moved to origin');
        var newOrigin = waypoints.splice(e.oldIndex-1,1);
        waypoints.splice(0, 0, origin);
        this.props.directions.setOrigin(newOrigin[0]);
        this.props.directions.setWaypoints(waypoints);
      }else if(e.newIndex === this.state.numPoints-1){
        //waypoint to destination
        console.log('waypoint moved to destination');
        var newDestination = waypoints.splice(e.oldIndex-1,1);
        waypoints.splice(-1, 0, destination);
        this.props.directions.setDestination(newDestination[0]);
        this.props.directions.setWaypoints(waypoints);
      }else{
        //waypoint to waypoint
        console.log('waypoint moved to another waypoint');
        var movingPoint = waypoints.splice(e.oldIndex-1,1);
        waypoints.splice(e.newIndex-1, 0, movingPoint);
        this.props.directions.setWaypoints(waypoints);
      }
    }
    console.log('a sort happened');
    console.log(e);
    console.log(this.props.directions);
    this.updateMap();
    this.forceUpdate();
  },
  componentDidUpdate: function(){
    if(this.props.router.current == 'login' && this.state.loginToggle === false){
      this.setState({'loginToggle': true});
    }
  },
  updateMap: function(){
    console.log('inside update map');
    if(this.props.directions.queryable()){
      console.log('sending directions query');
      this.props.directions.query({ proximity: this.props.map.getCenter() });
    }
    console.log('directions after updateMap in Interface');
    console.log(this.props.directions);
  },
  render: function(){
    console.log('interface render called');
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
    }
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
        <div id="waypoint-list">
          {waypoints}
        </div>
        <button onClick={this.addPoint}>+</button>
        {login}
      </div>
    );
  }
});


module.exports = Interface;
