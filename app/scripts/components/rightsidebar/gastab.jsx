var React = require('react');
var $ = require('jquery');

var Loading = require('../loading.jsx');
var StationsList = require('./stationslist.jsx');

var GasTab = React.createClass({
  componentWillMount: function(){
  },
  render: function(){
    var stations = (<Loading />);
    if(this.props.stations){
      stations = <StationsList collection={this.props.stations}  />
    }
    return (
      <div className="sidebar-tab">
        {stations}
      </div>
    );
  }
});

module.exports = GasTab;
