var React = require('react');
var MapboxClient = require('mapbox');
// var accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';

var WayPoint = React.createClass({
  getInitialState: function(){
    return {
      waypoint: '',
      edit: false
    }
  },
  componentWillMount: function(){
    if(this.props.waypoint){
      this.setState({'waypoint': this.props.waypoint});
    }
    if(this.props.type == 'edit'){
      this.setState({'edit': true});
    }
    var client = new MapboxClient('pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q');
    this.client = client;
  },
  setWaypoint: function(e){
    this.setState({'waypoint': e.target.value});
  },
  handleSubmit:function(e){
    e.preventDefault();
    this.client.geocodeForward(this.state.waypoint, function(err, res) {
      if(err){
        console.log('geocode error:');
        console.log(err);
      }else if(res){
        console.log('geocode success!');
        console.log(res);
        this.props.addPoint(res);
      }
    }.bind(this));
    this.setState({'waypoint': ''});
  },
  render: function(){
    if(this.props.type == 'edit'){
      return (
        <form className="new-waypoint" onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.setWaypoint} value={this.state.waypoint}/>
        </form>
      );
    }else{
      return (
        <div className="waypoint-item-display">
          <span>{this.props.waypoint.features[0].text}</span>
        </div>
      );
    }
  }
});

module.exports = WayPoint;
