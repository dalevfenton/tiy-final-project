var React = require('react');
var $ = require('jquery');

var Waypoint = React.createClass({
  componentWillMount: function(){
    // console.log('mounting waypoint');
    // console.log(this.props.index);
    // console.log(this.props.numPoints);
    this.props.directions.on('load', this.setInput);
  },
  componentDidMount: function(){
    this.populateWaypoint();
  },
  componentDidUpdate: function(){
    this.setInput();
  },
  populateWaypoint: function(){
    //return early if there isn't a directions object
    if(!this.props.directions){
      return 'error! no directionsObj passed to Waypoint Component';
    }
    if(this.props.index == 0){
      //if we are passed index 0 then we are on the origin component
      // console.log('inside origin setting');
      //we only want to blank the origin if we are passed a null origin
      if(!this.props.directions.getOrigin()){
        //set the origin to a blank string
        this.props.directions.setOrigin('');
      }else{
        this.setInput();
      }
    }else if(this.props.index == this.props.numPoints-1){
      //if we are passed the last index value then we want to set it as dest.
      // console.log('inside destination setting');
      //we only want to blank the destination if we are passed a null dest.
      if(!this.props.directions.getDestination()){
        //set destination to a blank string
        this.props.directions.setDestination('');
      }else{
        this.setInput();
      }
    }else{
      //any index that doesn't hit the first two tests will be a waypoint
      //on the directions prop
      // console.log('inside waypoint setting');
      // console.log(this.props.directions.getWaypoints()[this.props.index-1]);
      if(!this.props.directions.getWaypoints()[this.props.index-1]){
        // console.log('inside setting waypoint on load');
        // console.log(this.props.directions.getWaypoints());
      }else{
        this.setInput();
      }
    }
  },
  setInput: function(){
    // console.log('inside setInput');
    var name = {};
    // console.log('setting input on waypoint');
    // console.log(this.props);
    if(this.props.index == 0){
      //if we are passed index 0 then we are on the origin component
      // console.log('inside origin setInput');
      name = this.props.directions.getOrigin();
    }else if(this.props.index == this.props.numPoints-1){
      //if we are passed the last index value then we want to set it as dest.
      // console.log('inside destination setInput');
      name = this.props.directions.getDestination();
    }else{
      //any index that doesn't hit the first two tests will be a waypoint
      //on the directions prop
      // console.log('inside waypoint setInput');
      var name = this.props.directions.getWaypoints()[this.props.index-1];
    }
    if(name !== undefined && name.hasOwnProperty('properties')){
      if(name.properties.hasOwnProperty('name') && name.properties.name !== undefined ){
        if(name.properties.name){
          name = name.properties.name;
        }else{
          name = name.coordinates;
        }
      }else if(name.properties.hasOwnProperty('query')){
        name = name.properties.query;
      }
    }else{
      name = '';
    }
    // console.log('name from sort:', name);
    // console.log('name from second sort', name);
    // console.log($('#waypoint-input-'+ this.props.index));
    $('#waypoint-input-'+ this.props.index).val(name);
  },
  handleSubmit:function(e){
    e.preventDefault();
    var thisWaypointVal= $('#waypoint-input-'+ this.props.index).val();
    // console.log('waypoint value in handleSubmit');
    // console.log(thisWaypointVal);
    if(this.props.index == 0){
      // console.log('setting origin');
      this.props.directions.setOrigin(thisWaypointVal);

    }else if(this.props.index == (this.props.numPoints - 1)){
      // console.log('setting destination');
      this.props.directions.setDestination(thisWaypointVal);

    }else{
      // console.log('setting waypoint');
      if(!this.props.directions.getWaypoints()[this.props.index-1]){
        this.props.directions.addWaypoint(this.props.index-1, thisWaypointVal);
      }else{
        this.props.directions.setWaypoint(this.props.index-1, thisWaypointVal);
      }
    }
    //now that our data is set, see if we can do the directions query
    this.props.updateMap();
  },
  remove: function(e){
    e.preventDefault();
    // console.log('waypoint remove called');
    if(this.props.index == 0){
      // console.log('removing origin');
      if(this.props.directions.getWaypoints()){
        var waypoints = this.props.directions.getWaypoints();
        var newOrigin = waypoints.splice(0,1);
        this.props.directions.setOrigin(newOrigin[0]);
        this.props.directions.setWaypoints(waypoints);
      }else{
        this.props.directions.setOrigin('');
      }
    }else if(this.props.index == (this.props.numPoints - 1)){
      // console.log('removing destination');
      // this.props.directions.setDestination(thisWaypointVal);
      if(this.props.directions.getWaypoints()){
        var waypoints = this.props.directions.getWaypoints();
        var newDestination = waypoints.splice(-1,1);
        this.props.directions.setDestination(newDestination[0]);
        this.props.directions.setWaypoints(waypoints);
      }else{
        this.props.directions.setDestination('');
      }
    }else{
      // console.log('removing waypoint');
      if(this.props.directions.getWaypoints()[this.props.index-1]){
        var waypoints = this.props.directions.getWaypoints();
        waypoints.splice(this.props.index-1, 1);
        this.props.directions.setWaypoints(waypoints);
      }else{
        console.log('error! remove waypoint called but waypoint doesnt exist');
      }
    }
    //now that our data is set, see if we can do the directions query
    this.props.updateMap();
  },
  render: function(){
    // console.log('inside component with index:', this.props.index);
    // console.log(this.props.directions);
    var id = "waypoint-input-" + this.props.index;
    return (
      <div className="waypoint-container">
        <form className="waypoint" onSubmit={this.handleSubmit}>
          <label className="waypoint-handle">{this.props.index+1}</label>
          <input type="text" id={id} />
        </form>
        <button onClick={this.remove} className="waypoint-remove">x</button>
      </div>
    );
  }
});

module.exports = Waypoint;
