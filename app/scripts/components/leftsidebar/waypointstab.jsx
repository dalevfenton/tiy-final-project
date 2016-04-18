var React = require('react');

var Waypoint = require('./waypoint.jsx');

var WaypointsTab = React.createClass({
  getInitialState: function(){
    return {
      toggleSaveInput: false,
      saveName: ''
    }
  },
  componentDidUpdate: function(){
    if(this.props.props.state.currentRoute){
      var saveName = this.props.props.state.currentRoute.get('route_name');
      if(this.state.saveName !== saveName){
        this.setState({'saveName': saveName});
      }
    }
  },
  handleInput: function(e){
    this.setState({saveName: e.target.value});
  },
  toggleSaveInput: function(e){
    e.preventDefault();
    this.setState({toggleSaveInput: !this.state.toggleSaveInput});
  },
  saveRoute: function(e){
    e.preventDefault();
    var type = 'new';
    if(this.props.props.state.currentRoute){
      type = 'edit';
    }
    this.props.saveRoute(this.state.saveName, this.handleSave, type);
  },
  handleSave: function(type, obj){
    // console.log('handlesave called');
    // console.log(type);
    // console.log(obj);
    if(type == 'success'){
      var name;
      if(obj.get('route_name')){
        name = obj.get('route_name');
      }else{
        var origin = obj.get('origin_name');
        var destination = obj.get('desination_name');
        name =  origin + " to " + destination;
      }
      name += " saved successfully!";
      this.setState({
        inError: false,
        error: '',
        toggleSaveInput: false,
        saveName: '',
        message: name
      });
    }else if(type=='error'){
      console.log(obj);
      this.setState({
        inError: true,
        error: obj,
        message: ''
      });
    }
  },
  render: function(){
    var waypoints = [];
    var self = this;
    for(var i = 0; i < self.props.props.state.numPoints; i++){
      // var point = new Point();
      var active = false;
      if(self.props.props.state.activePoint == i){
        active = true;
      }
      var waypoint = (
        <Waypoint directions={self.props.props.directions}
          key={i} index={i} active={active}
          numPoints={self.props.props.state.numPoints}
          updateMap={self.props.props.updateMap}
          setActive={self.props.props.setActive}
          removePoint={self.props.props.removePoint}
        /> );
      waypoints.push(waypoint);
    }
    var save = "trip-button geo-auth-button geolocation-deny slid-up";
    var saveInput = "route-name-input slid-up";
    var buttonText = "Save This Route";

    var placeholder = "Name This Route";
    if(this.props.props.directions.queryable()){
      //if we lose a complete route then make sure we're hiding this input also
      if(this.state.toggleSaveInput){
        var origin = this.props.props.directions.getOrigin();
        var destination = this.props.props.directions.getDestination();
        origin = origin.properties.text || origin.properties.name;
        destination = destination.properties.text || destination.properties.name;
        placeholder =  origin + " to " + destination;
        saveInput = "route-name-input";
        buttonText = "Set A Name";
      }
      save = "trip-button geo-auth-button geolocation-deny";
    }
    if(this.props.props.state.currentRoute){
      buttonText = "Resave This Route";
      // routeName = this.props.props.state.currentRoute.get('route_name');
    }
    var errorMessage = "";
    if(this.state.inError){
      errorMessage = (<div className="login-error">{this.state.error.message}</div>);
    }
    var message = "";
    if(this.state.message !== ""){
      message = (<div className="message-success">{this.state.message}</div>);
    }
    return (
      <div>
        <div className="top-layer">
          <div id="waypoint-list">
            {waypoints}
          </div>
          <button className="trip-button geo-auth-button geolocation-authorize"
            onClick={this.props.props.addPoint}>
            + Add New Waypoint
          </button>
        </div>
        <div className="bottom-layer">
          <button className={save}
            onClick={this.toggleSaveInput}>
            {buttonText}
          </button>
          <form onSubmit={this.saveRoute} className={saveInput}>
            <input type="text" value={this.state.saveName}
              onChange={this.handleInput} placeholder={placeholder}
            />
          </form>
        </div>
        {errorMessage}
        {message}
      </div>
    );
  }
});

module.exports = WaypointsTab;
