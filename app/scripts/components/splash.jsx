var React = require('react');

var Login = require('./login.jsx');

var Splash = React.createClass({
  callLocationSetup: function(bool, e){
    console.log(e);
    console.log(bool);
    e.preventDefault();
    this.props.setupGeo(bool);
  },
  render: function(){
    var geolcationStatus = (
      <div className="geolocation-title dtr-title">
        Your Device Does Not Support Geolocation, Some Features Will
        Be Disabled On This Device
      </div>
    )
    if ("geolocation" in navigator) {
      geolcationStatus = (
        <div>
          <div className="geolocation-title dtr-title">
            This App Works Best When We Can Detect Your Location
          </div>
          <div className="geolocation-row">
            <div className="geolocation-logo">
              <span className="glyphicon glyphicon-map-marker"
                aria-hidden="true"
              ></span>
            </div>
            <div className="geolocation-info">
              <div>
                Allowing Us To Locate You Lets Us Help Track You Along Your Route
                and Find Hotels, Food, Gas and Other Stops!
              </div>
            </div>
          </div>
          <div className="geolocation-disclaimer">
            You Can Always Let Us Set Your Location Later
          </div>
          <div className="geolocation-inputs">
            <div className="splash-half geo-auth-button geolocation-authorize"
              onClick={this.callLocationSetup.bind(this, true)}>Authorize</div>
            <div className="splash-half geo-auth-button geolocation-deny"
              onClick={this.callLocationSetup.bind(this, false)}>Deny</div>
          </div>
        </div>
      )
    }
    return (
      <div className="splash-screen">
        <div className="splash-container">
          <div className="splash-half set-geolocation">
            {geolcationStatus}
          </div>

          <div className="splash-half splash-login">
            <Login />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Splash;
