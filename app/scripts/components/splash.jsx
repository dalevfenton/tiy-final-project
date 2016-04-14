var React = require('react');

var Splash = React.createClass({
  render: function(){
    return (
      <div className="splash-screen">
        <div className="splash-container">
          <div className="splash-half set-geolocation">
            <span>
              This App Works Best When We Can Detect Your Location
              Would You Like To Approve This Site To Know Your Location?
            </span>
          </div>
          <div className="splash-half splash-login">
            <button>Login Form</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Splash;
