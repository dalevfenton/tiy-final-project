var React = require('react');

var WaypointSettings = React.createClass({
  render: function(){
    console.log(this.props);
    return (
      <div className="waypoint-search-settings">
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