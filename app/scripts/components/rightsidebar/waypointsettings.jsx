var React = require('react');

var findClosest = require('../../functions').findClosest;
var offsetWaypoint = require('../../functions').offsetWaypoint;

var WaypointSettings = React.createClass({
  render: function(){
    //find closest point to current route
    // console.log(this.props);
    // var check = this.props.directions.directions;
    // if(!check){
    //   return (<div></div>);
    // }
    // console.log(this.props);
    // var coords = check.routes[0].geometry.coordinates;
    // var closestPt = findClosest(this.props.props.currentLocation, coords);
    // console.log('closest point found to route from currentLocation');
    // console.log(closestPt);
    //find distance to start and end of route from that point
    //set slider to min 0 and max of distance based on radio
    return (
      <div className="waypoint-search-settings">
        <input type="range" />
        <label>Miles</label>
        <input type="number" min={0} max={10} placeholder="1"
          onChange={this.props.setSearch.bind(null, 'distance')}
          value={this.props.props.distance} />
        <label>Before or After</label>
        <select className="offset-type"
          onChange={this.props.setSearch.bind(null, 'offsetType')}
          value={this.props.props.offsetType} >
          <option value="before">Before</option>
          <option value="after">After</option>
        </select>
      </div>
    );
  }
});

module.exports = WaypointSettings;
