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
    var sortable = Sortable.create(el, {'handle': ".waypoint-handle", 'draggable': 'form'});
  },
  addPoint: function(){
    this.setState({'numPoints': this.state.numPoints+1});
  },
  editPoint: function(waypoint, id){
    console.log('inside editPoint');
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
      this.props.directions.query({ proximity: this.props.map.getCenter() }, function(err, res){
        if(err){
          console.log('error during directions query:', err);
        }
        console.log(res);
      });
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
