var React = require('react');

var RouteButton = React.createClass({
  setRoute: function(e){
    e.preventDefault();
    this.props.setRoute(this.props.index);
  },
  render: function(){
    var button;
    if(this.props.route.get('route_name')){
      button = (
        <button>
          {this.props.route.get('route_name')}
        </button>
      );
    }else{
      button = (
        <button>
          {this.props.route.get('origin_name') + " "}
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          {" " + this.props.route.get('destination_name')}
        </button>
      )
    }
    return (
      <div className="sidebar-waypoint-picker" onClick={this.setRoute}>
        {button}
      </div>
    );
  }
});

var RoutesTab = React.createClass({
  render: function(){
    var routes = this.props.savedRoutes.map(function(route, index){
      return (
        <RouteButton key={index} index={index} route={route}
          setRoute={this.props.setRoute} />
      )
    }.bind(this));
    return (
      <div>
        {routes}
      </div>
    );
  }
});

module.exports = RoutesTab;
