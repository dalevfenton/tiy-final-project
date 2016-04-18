var $ = require('jquery');
var React = require('react');

var YelpList = require('./yelplist.jsx');
var Loading = require('../loading.jsx');

var FoodTab = React.createClass({
  componentWillMount: function(){
  },
  render: function(){
    var restaurants = (<Loading />);
    if(this.props.restaurants){
      restaurants = <YelpList collection={this.props.restaurants}
        type="restaurants" setBusiness={this.props.setBusiness} />
    }
    return (
      <div className="sidebar-tab">
        {restaurants}
      </div>
    );
  }
});

module.exports = FoodTab;
