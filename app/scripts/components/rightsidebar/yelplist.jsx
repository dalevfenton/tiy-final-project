var React = require('react');

var YelpDetail = React.createClass({
  setBusiness: function(){
    this.props.setBusiness(this.props.index);
  },
  render: function(){
    var business = this.props.business;
    return (
      <div className="business-detail detail-item" key={this.props.index} onClick={this.setBusiness}>
        <a href={business.url}>
          <h6 className="business-detail-title dtr-title">{business.name}</h6>
        </a>
        <div className="business-detail-info">
          <span className="rating"><img src={business.rating_img_url} /></span>
          <span className="reviews"><a href={business.url}>({business.review_count}) Reviews</a></span>
        </div>
        <span className="business-detail-address">{business.location.address}, {business.location.city}, {business.location.state_code}</span>
      </div>
    );
  }
});

var YelpList = React.createClass({
  setBusiness: function(index){
    this.props.setBusiness(this.props.type, index);
  },
  render: function(){
    var businesses = this.props.collection.businesses.map(function(business, index){
      if(index < 10){
        return (
          <YelpDetail business={business} index={index} key={index}
            setBusiness={this.setBusiness} />

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
