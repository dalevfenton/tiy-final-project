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
      console.log('setting waypoint');
      this.setState({'waypoint': this.props.waypoint});
      this.setWaypoints();
    }
    if(this.props.type == 'edit'){
      this.setState({'edit': true});
    }
    // var client = new MapboxClient('pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q');
    // this.client = client;
  },
  setWaypoints: function(){
    console.log('inside setDestination');
    if(this.props.index == 0){
      console.log('setting origin');
      this.props.directions.setOrigin(this.props.waypoint);
    }else if(this.props.index == (this.props.length - 1)){
      console.log('setting destination');
      this.props.directions.setDestination(this.props.waypoint);
      this.props.updateMap();
    }else{
      this.props.directions.addWaypoint(this.props.index, this.props.waypoint);
    }
  },
  setWaypoint: function(e){
    this.setState({'waypoint': e.target.value});
  },
  handleSubmit:function(e){
    e.preventDefault();
    console.log('current directions');
    console.log(this.props.directions);

    // this.client.geocodeForward(this.state.waypoint, function(err, res) {
    //   if(err){
    //     console.log('geocode error:');
    //     console.log(err);
    //   }else if(res){
    //     console.log('geocode success!');
    //     console.log(res);
    //     this.props.addPoint(res);
    //   }
    // }.bind(this));
    // this.setState({'waypoint': ''});
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
