var React = require('react');
var $ = require('jquery');
// var MapboxClient = require('mapbox');
// var accessToken = 'pk.eyJ1IjoiZGFsZWZlbnRvbiIsImEiOiJjaW1tNGY4Y3QwM3NvbzBtMG0xNG94amNyIn0.dSBZiHka-IqfB6eqBL_o1Q';

var Waypoint = React.createClass({
  componentWillMount: function(){
    console.log('mounting waypoint');
    console.log(this.props.index);
    console.log(this.props.numPoints);
    this.populateWaypoint();
    this.props.directions.on('load', this.setInput);
  },
  populateWaypoint: function(){
    //return early if there isn't a directions object
    if(!this.props.directions){
      return 'error! no directionsObj passed to Waypoint Component';
    }
    if(this.props.index == 0){
      //if we are passed index 0 then we are on the origin component
      console.log('inside origin setting');
      //we only want to blank the origin if we are passed a null origin
      if(!this.props.directions.getOrigin()){
        //set the origin to a blank string
        this.props.directions.setOrigin('');
      }
    }else if(this.props.index == this.props.numPoints-1){
      //if we are passed the last index value then we want to set it as dest.
      console.log('inside destination setting');
      //we only want to blank the destination if we are passed a null dest.
      if(!this.props.directions.getDestination()){
        //set destination to a blank string
        this.props.directions.setDestination('');
      }
    }else{
      //any index that doesn't hit the first two tests will be a waypoint
      //on the directions prop
      console.log('inside waypoint setting');
      console.log(this.props.directions.getWaypoints()[this.props.index-1]);
      if(!this.props.directions.getWaypoints()[this.props.index-1]){
        console.log('inside setting waypoint on load');
        console.log(this.props.directions.getWaypoints());
      }
    }
  },
  setInput: function(e){
    console.log('inside setInput');
    console.log(e);
    var name;
    if(this.props.index == 0){
      //if we are passed index 0 then we are on the origin component
      console.log('inside origin setInput');
      name = this.props.directions.getOrigin().properties.name;
    }else if(this.props.index == this.props.numPoints-1){
      //if we are passed the last index value then we want to set it as dest.
      console.log('inside destination setInput');
      name = this.props.directions.getDestination().properties.name;
    }else{
      //any index that doesn't hit the first two tests will be a waypoint
      //on the directions prop
      console.log('inside waypoint setInput');
      name = this.props.directions.getWaypoints()[this.props.index-1].properties.name;
    }
    $('#waypoint-input-'+ this.props.index).val(name);
  },

  setWaypoints: function(){
    console.log('inside setWaypoints');
    if(this.props.index == 0){
      console.log('setting origin');
      console.log($('#waypoint-input-'+ this.props.index).val());
      this.props.directions.setOrigin($('#waypoint-input-'+ this.props.index).val());
    }else if(this.props.index == (this.props.numPoints - 1)){
      console.log('setting destination');
      this.props.directions.setDestination(this.state.waypoint);
    }else{
      this.props.directions.addWaypoint(this.props.index, this.state.waypoint);
    }
    this.props.updateMap();
  },
  handleInput: function(e){
    if(this.props.index == 0){
      console.log(this.props.directions);
      this.props.directions.setOrigin(e.target.value);
    }else if(this.props.index == this.props.numPoints-1){
      this.props.directions.setDestination(e.target.value);
    }
  },
  handleSubmit:function(e){
    e.preventDefault();
    var thisWaypointVal= $('#waypoint-input-'+ this.props.index).val();
    if(this.props.index == 0){
      console.log('setting origin');
      this.props.directions.setOrigin(thisWaypointVal);
    }else if(this.props.index == (this.props.numPoints - 1)){
      console.log('setting destination');
      this.props.directions.setDestination(thisWaypointVal);
    }else{
      console.log('setting waypoint');
      if(!this.props.directions.getWaypoints()[this.props.index-1]){
        this.props.directions.addWaypoint(this.props.index-1, thisWaypointVal);
      }else{
        this.props.directions.setWaypoint(this.props.index-1, thisWaypointVal);
      }
    }
    this.props.updateMap();
    console.log('current directions');
    console.log(this.props.directions);

    this.props.updateMap();
  },
  render: function(){
    var id = "waypoint-input-" + this.props.index;
    console.log(id);
    return (
      <form className="waypoint" onSubmit={this.handleSubmit}>
        <label>{this.props.index+1}</label>
        <input type="text" id={id} />
        <button onClick={this.handleSubmit}>+</button>
      </form>
    );
  }
});

module.exports = Waypoint;
