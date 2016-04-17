var React = require('react');

var Waypoint = require('./waypoint.jsx');

var WaypointsTab = React.createClass({
  getInitialState: function(){
    return {
      toggleSaveInput: false,
      saveName: ''
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
    this.props.saveRoute(this.state.saveName);
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
      </div>
    );
  }
});

module.exports = WaypointsTab;
