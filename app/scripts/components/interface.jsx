var React = require('react');
var Sortable = require('sortablejs');

var Login = require('./login.jsx');
var Waypoint = require('./waypoint.jsx');
var RightSidebar = require('./rightsidebar.jsx');

var Interface = React.createClass({
  getInitialState: function(){
    return {
      location: null,
      numPoints: 2,
      loginToggle: false,
      toggleLeft: false,
      toggleRight: false,
      activePoint: 0
    }
  },
  toggleLeft: function(e){
    console.log('toggleLeft triggered');
    this.setState({toggleLeft: !this.state.toggleLeft});
  },
  toggleRight: function(e){
    this.setState({toggleRight: !this.state.toggleRight});
  },
  componentWillMount: function(){
    this.callback = (function(e){
      // console.log('this.callback called');
      // console.log(e);
      var numPoints = 0;
      if(this.props.directions.getOrigin()){
        numPoints += 1;
      }
      if(this.props.directions.getDestination()){
        numPoints += 1;
      }
      if(this.props.directions.getWaypoints().length > 0){
        numPoints += this.props.directions.getWaypoints().length;
      }
      console.log('number of points from directions', numPoints);
      if(numPoints < 2){
        numPoints = 2;
      }
      this.setState({'numPoints': numPoints});
      this.forceUpdate();
    }.bind(this));
    this.props.router.on('route', this.callback);
    this.props.directions.on('profile, selectRoute, load', this.callback );
    this.props.directions.on('origin', this.originSet);
    this.props.directions.on('destination', this.destinationSet);
    this.props.directions.on('waypoint', this.waypointSet);
  },
  originSet: function(e){
    // console.log('origin set');
    // console.log(this.props.directions.getOrigin());
    this.forceUpdate();
  },
  destinationSet: function(e){
    // console.log('destination set');
    // console.log(this.props.directions.getDestination());
    this.forceUpdate();
  },
  waypointSet: function(e){
    // console.log('waypoint set');
    // console.log(e);
    this.updateMap();
  },
  componentDidMount: function(){
    var el = document.getElementById('waypoint-list');
    var options = {
      'handle': ".waypoint-handle",
      'draggable': 'div.waypoint-container',
      'scroll': false,
      'sort': true,
      'onEnd': this.handleSort
    };
    var sortable = Sortable.create(el, options);

  },
  addPoint: function(){
    this.setState({'numPoints': this.state.numPoints+1});
  },
  handleSort: function(e){
    console.log(e);
    e.preventDefault();
    var origin = this.props.directions.getOrigin();
    var destination = this.props.directions.getDestination();
    var waypoints = this.props.directions.getWaypoints();
    console.log(e.oldIndex);
    console.log(e.newIndex);
    console.log(this.state.numPoints);
    if(e.oldIndex === 0){
      if(e.newIndex === this.state.numPoints-1){
        //origin moved to destination
        console.log('origin to destination');
        console.log(origin);
        console.log(destination);
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
        console.log(waypoints);
        console.log(e.oldIndex);
        console.log(e.newIndex);
        var movingPoint = waypoints.splice(e.oldIndex-1,1)[0];
        console.log(movingPoint);
        console.log(waypoints);
        waypoints.splice(e.newIndex-1, 0, movingPoint);
        console.log(waypoints);
        this.props.directions.setWaypoints(waypoints);
      }
    }
    // console.log('a sort happened');
    // console.log(e);
    // console.log(this.props.directions);
    this.updateMap();
    this.forceUpdate();
  },
  componentDidUpdate: function(){
    if(this.props.router.current == 'login' && this.state.loginToggle === false){
      this.setState({'loginToggle': true});
    }
  },
  updateMap: function(){
    // console.log('inside update map');
    if(this.props.directions.queryable()){
      console.log('sending directions query');
      console.log(this.props.map);
      this.props.directions.query({ proximity: this.props.map.getCenter() });
    }
    console.log('directions after updateMap in Interface');
    console.log(this.props.directions);
  },
  doUpdate: function(e){
    e.preventDefault();
    this.forceUpdate();
  },
  setActive: function(index){
    this.setState({activePoint: index});
  },
  render: function(){
    // console.log('interface render called');
    if(this.props.directions){
      var waypoints = [];
      var self = this;
      for(var i = 0; i < self.state.numPoints; i++){
        var active = false;
        if(this.state.activePoint == i){
          active = true;
        }
        var waypoint = (
          <Waypoint directions={self.props.directions}
            key={i} index={i} numPoints={self.state.numPoints}
            updateMap={self.updateMap} active={active} setActive={this.setActive}
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
    var leftToggle, rightToggle;
    if(this.state.toggleLeft){
      leftToggle = "map-overlay sidebar-left collapse-overlay-left collapse-overlay";
    }else{
      leftToggle = "map-overlay sidebar-left";
    }
    if(this.state.toggleRight){
      rightToggle = "map-overlay sidebar-right collapse-overlay-right collapse-overlay";
    }else{
      rightToggle = "map-overlay sidebar-right";
    }
    return (
      <div>
        <div className={leftToggle}>
          <div className="overlay-control overlay-control-left">
            <span className="close-overlay" onClick={this.toggleLeft}>
              <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
            </span>
          </div>
          <div>
            <div id="waypoint-list">
              {waypoints}
            </div>
            <button className="trip-button" onClick={this.addPoint}>+ Add New Waypoint</button>

            {login}
          </div>
        </div>
        <RightSidebar toggle={rightToggle} toggleRight={this.toggleRight}/>
      </div>
    );
  }
});


module.exports = Interface;
