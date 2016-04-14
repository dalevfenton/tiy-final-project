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

    return (
      <div className="login-profile">
        <div className="login-profile-avatar-wrapper">
          <div className="login-profile-avatar">
            {avatar}
          </div>
        </div>
        <div className="login-welcome dtr-title">
          {"Welcome Back " + user.get('username') + "!"}
        </div>
        <div>select an authorization for location tracking and let's get started!</div>
        <div className="onscreen-or geolocation-disclaimer">or</div>
        <button className="geo-auth-button geolocation-authorize" onClick={this.props.logOut}
          >Switch Accounts
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
      console.log('do a signup');
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
      console.log('do a login');
      console.log(this.state.username);
      console.log(this.state.password);
      Parse.User.logIn(this.state.username, this.state.password)
        .then(
          this.userSuccess.bind(this, 'login'),
          this.userError.bind(this, 'login')
        );
    }
  },
  userSuccess: function(type, data){
    console.log('inside userSuccess');
    console.log(type);
    console.log(data);
    console.log(type, ' successful for user: ', data);
    this.setState({inError: false, error: ''});
  },
  userError: function(type, error, code, info){
    console.log('user login failed');
    console.log(type, error, code, info);
    this.setState({inError: true, error: error});
  },
  logOut: function(e){
    e.preventDefault()
    Parse.User.logOut().then(
      function(user){
        console.log('user logged out');
        // this.setState({user: Parse.User.current()});
        this.forceUpdate();
      }.bind(this),
      function(error){
        console.log('user was not logged out');
        this.setState({inError: true, error: error});
      });
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
        valueLink={this.linkState('email')} placeholder="Email" />);
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
            valueLink={this.linkState('username')} placeholder="Username" />
          {email}
          <input type="password" name="password" tabIndex={3}
            valueLink={this.linkState('password')} placeholder="Password" />
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
