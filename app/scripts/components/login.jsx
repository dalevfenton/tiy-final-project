var React = require('react');

var Login = React.createClass({
  getInitialState: function(){
    return {
      username: '',
      email: '',
      password: '',
      toggleSignUp: false,
    }
  },
  toggleSignUp: function(e){
    e.preventDefault();
    this.setState({toggleSignUp: !this.state.toggleSignUp});
  },
  handleSubmit: function(e){
    e.preventDefault();
  },
  render: function(){

    if(this.state.toggleSignUp){
      //show signup form for unregistered users
      return (
        <div className="login-container signup-form">
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="username" placeholder="Username" />
            <input type="email" name="useremail" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
          <a href="#" onClick={this.toggleSignUp} >Have An Account? Log In!</a>
        </div>
      )
    }else{
      //show login form for registered users
      return (
        <div className="login-container login-form">
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Log In</button>
          </form>
          <a href="#" onClick={this.toggleSignUp} >Don't Have An Account? Sign Up!</a>
        </div>
      )
    }

  }
});

module.exports = Login;
