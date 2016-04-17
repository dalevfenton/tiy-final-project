var React = require('react');

var RoutesTab = React.createClass({
  render: function(){
    var routes = this.props.savedRoutes.map(function(route, index){
      return (
        <div className="sidebar-waypoint-picker" key={index}>
          <button>
            {"Origin "}
            <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
            <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
            <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
            {" Destination"}
          </button>
        </div>
      )
    });
    return (
      <div>
        {routes}
      </div>
    );
  }
});

module.exports = RoutesTab;
