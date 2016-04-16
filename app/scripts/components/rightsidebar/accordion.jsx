var React = require('react');

var Accordion = React.createClass({
  getInitialState: function(){
    return {
      toggle: this.props.toggle
    }
  },
  toggle: function(e){
    e.preventDefault();
    this.setState({toggle: !this.state.toggle});
  },
  render: function(){
    var bodyClass = "sidebar-accordion-body accordion-hide";
    if(!this.state.toggle){
      bodyClass = "sidebar-accordion-body"
    }
    return (
      <div className="sidebar-accordion">
        <div className="sidebar-accordion-title dtr-title"
           onClick={this.toggle} ref="currentLocation">
          - {this.props.title} -
        </div>
        <div className={bodyClass}>
          {this.props.jsx}
        </div>
      </div>
    );
  }
});

module.exports = Accordion;
