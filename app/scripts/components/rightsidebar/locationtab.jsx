var React = require('react');

var LocationTab = React.createClass({
  getInitialState: function(){
    var location = '';
    // if(this.props.currentLocation.hasOwnProperty('text')){
    //   location = this.props.currentLocation.text
    // }
    return {
      location: location,
      display: ''
    }
  },
  setInput: function(e){
    e.preventDefault();
    this.setState({display: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.props.setLocation(this.state.display);
  },
  handleUserLocation: function(e){
    e.preventDefault();
    console.log(e.target.value);
    this.props.setLocation(this.props.userLocation);
  },
  render: function(){
    // console.log('location tab currentLocation');
    // console.log(this.props.currentLocation);
    var id = "waypoint-input-" + this.props.index;
    var userLocationJSX;
    if(this.props.userLocation){
      var userLocation = this.props.userLocation.geometry.coordinates;
      userLocationJSX = (
        <div>
          <div>{userLocation}</div>
          <button onClick={this.handleUserLocation}>Lookup Stops</button>
        </div>
      );
    }else{
      userLocationJSX = (
        <div>
          <button onClick={this.doUserLocation}>Activate Location Finding</button>
        </div>
      );
    }
    return (
      <div className="sidebar-tab">
        <div className="waypoint-container waypoint-active">
          <div className="sidebar-accordion" toggle={this.toggle}
            onClick={this.setToggle}>
            <div className="sidebar-accordion-title">
              Find A Stop Near You
            </div>
            <div className="sidebar-accordion-body">
              {userLocationJSX}
            </div>
          </div>
          <div className="sidebar-accordion" toggle={this.toggle}
            onClick={this.setToggle}>
            <div className="sidebar-accordion-title">
              Find A Stop Near A Waypoint
            </div>
            <form className="waypoint" onSubmit={this.handleSubmit}>
              <input type="text" autoComplete="off"
                value={this.state.display} onChange={this.setInput}
                placeholder="Find A Stop Near A Waypoint" />
              <label className="waypoint-handle">
                <span className="glyphicon glyphicon-map-marker"
                  aria-hidden="true"
                ></span>
              </label>
            </form>
          </div>
          <div className="sidebar-accordion" toggle={this.toggle}
            onClick={this.setToggle}>
            <div className="sidebar-accordion-title">
              Find A Stop Near An Address
            </div>
            <form className="waypoint" onSubmit={this.handleSubmit}>
              <input type="text" autoComplete="off"
                value={this.state.display} onChange={this.setInput}
                placeholder="Find A Stop Near An Address" />
              <label className="waypoint-handle">
                <span className="glyphicon glyphicon-map-marker"
                  aria-hidden="true"
                ></span>
              </label>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LocationTab;
