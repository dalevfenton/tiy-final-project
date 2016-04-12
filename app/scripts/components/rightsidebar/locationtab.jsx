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
  render: function(){
    // console.log('location tab currentLocation');
    // console.log(this.props.currentLocation);
    var id = "waypoint-input-" + this.props.index;

    return (
      <div className="sidebar-tab">
        <div className="waypoint-container waypoint-active">
          <form className="waypoint" onSubmit={this.handleSubmit}>
            <input type="text" autoComplete="off"
              value={this.state.display} onChange={this.setInput}
              placeholder="Find A Location To Stop" />
            <label className="waypoint-handle">
              <span className="glyphicon glyphicon-map-marker"
                aria-hidden="true"
              ></span>
            </label>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = LocationTab;
