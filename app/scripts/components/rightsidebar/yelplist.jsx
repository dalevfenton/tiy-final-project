var React = require('react');

var YelpList = React.createClass({
  render: function(){
    var businesses = this.props.collection.businesses.map(function(business, index){
      if(index < 10){
        return (
          <div className="business-detail detail-item" key={index}>
            <h6>{business.name}</h6>
            <span className="rating"><img src={business.rating_img_url} /></span>
            <span className="reviews"><a href={business.url}>({business.review_count}) Reviews</a></span>
            <span className="address">{business.location.address}, {business.location.city}, {business.location.state_code}</span>
          </div>
        );
      }
    }.bind(this));
    if(!businesses){
      businesses = (<h3>No Results Found</h3>)
    }
    return (
      <div>
        {businesses}
      </div>
    );
  }
});

module.exports = YelpList;
