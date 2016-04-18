var React = require('react');

var Indicator = React.createClass({
  render: function(){
    if(!this.props.items){
      return <div className="hide-me"></div>;
    }
    var items = this.props.items;
    if(this.props.items.hasOwnProperty('businesses')){
      items = this.props.items.businesses;
    }
    return (
      <div className="selector-indicator">{items.length}</div>
    );
  }
});

module.exports = Indicator;
