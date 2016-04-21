var React = require('react');
var Parse = require('parse');
var LinkedStateMixin = require('react/lib/LinkedStateMixin');

var MiniProfile = React.createClass({
  componentWillMount: function(){

  },
  render: function(){
    var user = Parse.User.current();
    var avatar = "";
    if(user.get('avatar')){
      //show user's image avatar
      avatar = (<img src={user.get('avatar').get('url')} />);
    }
    var locationCallToAction = "";
    if(localStorage.getItem('geolocation') === undefined){
      locationCallToAction = (
        <div>
          <div>select an authorization for location tracking and let's get started!</div>
          <div className="onscreen-or geolocation-disclaimer">or</div>
        </div>
      );
    }
    return (
      <div className="login-profile">
        <div className="login-profile-avatar-wrapper">
          <div className="login-profile-avatar">
            {avatar}
          </div>
        </div>
        <div className="login-welcome dtr-title">
          {"Hi " + user.get('username') + " Let's Hit The Road!"}
        </div>
        {locationCallToAction}
        <button className="geo-auth-button geolocation-authorize" onClick={this.props.logOut}
          >Log Out
        </button>
      </div>
    );
  }
});

var Login = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function(){
    return {
      username: '',
      email: '',
      password: '',
      error: '',
      inError: false,
      toggleSignUp: false,
    }
  },
  toggleSignUp: function(e){
    e.preventDefault();
    this.setState({toggleSignUp: !this.state.toggleSignUp});
  },
  handleSubmit: function(e){
    e.preventDefault();
    if(this.state.toggleSignUp){
      var user = new Parse.User();
      user.set("username", this.state.username);
      user.set("password", this.state.password);
      user.set("email", this.state.email);
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(false);
      user.setACL(acl);
      user.signUp()
      .then(
        this.userSuccess.bind(this, 'signup'),
        this.userError.bind(this, 'signup')
      );
    }else{
      Parse.User.logIn(this.state.username, this.state.password)
        .then(
          this.userSuccess.bind(this, 'login'),
          this.userError.bind(this, 'login')
        );
    }
  },
  userSuccess: function(type, data){
    // console.log(type, ' successful for user: ', data);
    this.callback('success', type);
    this.setState({inError: false, error: '', username: '',
       email: '', password: ''});
  },
  userError: function(type, error){
    // console.log('user login failed');
    // console.log(type, error);
    this.setState({inError: true, error: error});
    this.callback('error', type);
  },
  callback: function(result, type){
    if(this.props.callback){
      this.props.callback(result, type);
    }
  },
  logOut: function(e){
    e.preventDefault()
    Parse.User.logOut().then(
      this.userSuccess.bind(this, 'logout'),
      this.userError.bind(this, 'logout')
    );
  },
  render: function(){
    if (Parse.User.current()){
      return (<MiniProfile logOut={this.logOut} state={this.state} />);
    }

    var errorMessage = "";
    if(this.state.inError){
      errorMessage = (<div className="login-error">{this.state.error.message}</div>);
    }
    var email = "";
    var disclaimer, button;
    if(this.state.toggleSignUp){
      email = (<input type="email" name="useremail" tabIndex={2}
        valueLink={this.linkState('email')} placeholder="Email"
        autoComplete="off" />);
      disclaimer = "Have An Account? Log In!";
      button = "Sign Up"
    }else{
      disclaimer = "Don't Have An Account? Sign Up!";
      button = "Log In"
    }

    //show form for unregistered users
    return (
      <div className="login-container signup-form">
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="username" tabIndex={1}
            valueLink={this.linkState('username')} placeholder="Username"
            autoComplete="off" />
          {email}
          <input type="password" name="password" tabIndex={3}
            valueLink={this.linkState('password')} placeholder="Password"
            autoComplete="off" />
          {errorMessage}
          <a className="geolocation-disclaimer" tabIndex={5}
            href="#" onClick={this.toggleSignUp}>{disclaimer}</a>
          <button className="geo-auth-button geolocation-authorize" tabIndex={4}
            type="submit" onClick={this.handleSubmit}>{button}</button>
        </form>
      </div>
    )
  }
});

module.exports = Login;
