var React = require('react');
var Panel = require('react-bootstrap').Panel;

var Accordion = React.createClass({
  toggle: function(e){
    e.preventDefault();
    console.log(this.props.panel);
    if(!this.props.disabled){
      this.props.toggleAccordion(this.props.panel);
    }
  },
  render: function(){
    var bodyClass = "sidebar-accordion-body accordion-hide";
    if(!this.props.toggle){
      bodyClass = "sidebar-accordion-body"
    }
    var titleClass = "sidebar-accordion-title dtr-title";
    if(this.props.disabled){
      titleClass += " selector-disabled"
    }
    return (
      <div className="sidebar-accordion">
        <div className={titleClass}
           onClick={this.toggle} ref="currentLocation">
          - {this.props.title} -
        </div>
        <Panel collapsible expanded={this.props.toggle}>
          <div className={bodyClass}>
            {this.props.jsx}
          </div>
        </Panel>
      </div>
    );
  }
});

module.exports = Accordion;
