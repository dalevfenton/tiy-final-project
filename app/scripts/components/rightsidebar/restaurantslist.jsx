var React = require('react');

var RestaurantsList = React.createClass({
  render: function(){
    var restaurants = this.props.collection.businesses.map(function(restaurant, index){
      if(index < 10){
        return (
          <div className="restaurant-detail detail-item" key={index}>
            <h6>{restaurant.name}</h6>
            <span className="rating"><img src={restaurant.rating_img_url} /></span>
            <span className="reviews"><a href={restaurant.url}>({restaurant.review_count}) Reviews</a></span>
            <span className="address">{restaurant.location.address}, {restaurant.location.city}, {restaurant.location.state_code}</span>
          </div>
        );
      }
    }.bind(this));
    return (
      <div>
        {restaurants}
      </div>
    );
  }
});

module.exports = RestaurantsList;
