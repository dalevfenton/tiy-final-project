var React = require('react');

var YelpList = require('./yelplist.jsx');
var Loading = require('../loading.jsx');

var HotelTab = React.createClass({
  render: function(){
    var hotels = (<Loading />);
    if(this.props.hotels){
      hotels = <YelpList collection={this.props.hotels}  />
    }
    return (
      <div className="sidebar-tab">
        {hotels}
      </div>
    );
  }
});

module.exports = HotelTab;
