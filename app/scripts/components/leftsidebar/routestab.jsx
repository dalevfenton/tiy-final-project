var React = require('react');

var RouteButton = React.createClass({
  setRoute: function(e){
    e.preventDefault();
    console.log('setRoute called');
    this.props.setRoute(this.props.index);
  },
  remove: function(e){
    e.preventDefault();
    console.log('why you delete index: ' + this.props.index);
    this.props.setupDelete(this.props.index);
  },
  render: function(){
    var button;
    if(this.props.route.get('route_name')){
      button = (
        <button onClick={this.setRoute}>
          {this.props.route.get('route_name')}
        </button>
      );
    }else{
      button = (
        <button  >
          {this.props.route.get('origin_name') + " "}
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
          {" " + this.props.route.get('destination_name')}
        </button>
      )
    }
    var className = "sidebar-waypoint-picker";
    if(this.props.active){
      className = "sidebar-waypoint-picker waypoint-picker-active";
    }
    return (
      <div className={className}>
        {button}
        <button onClick={this.remove} className="waypoint-remove" tabIndex={-1}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </button>
      </div>
    );
  }
});

var RoutesTab = React.createClass({
  getInitialState: function(){
    return {
      toggleDeleteConfirm: false,
      deleteTarget: null
    }
  },
  setupDelete: function(index){
    this.setState({toggleDeleteConfirm: true, deleteTarget: index });
  },
  cancelDelete: function(e){
    e.preventDefault();
    this.setState({toggleDeleteConfirm: false, deleteTarget: null });
  },
  doDelete: function(e){
    e.preventDefault();
    this.props.deleteRoute(this.state.deleteTarget);
  },
  render: function(){
    var routes = this.props.savedRoutes.map(function(route, index){
      var active = false;
      if(this.props.currentRoute && this.props.currentRoute.id === route.id ){
        active = true;
      }
      return (
        <RouteButton key={index} index={index} route={route} active={active}
          setRoute={this.props.setRoute} setupDelete={this.setupDelete} />
      )
    }.bind(this));

    var deleteConfirm = "";
    if(this.state.toggleDeleteConfirm){
      var routeName = this.props.savedRoutes[this.state.deleteTarget];
      routeName = routeName.get('route_name');

      deleteConfirm = (
        <div>
          <div>Really Delete {routeName}?</div>
          <div>
            <button onClick={this.doDelete}>Yes</button>
            <button onClick={this.cancelDelete}>No</button>
          </div>
        </div>
      )
    }
    return (
      <div>
        {routes}
        {deleteConfirm}
      </div>
    );
  }
});

module.exports = RoutesTab;
