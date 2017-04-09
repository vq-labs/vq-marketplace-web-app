import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as apiAuth from '../api/auth';
import * as coreAuth from '../core/auth';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authMode: 'login'
    };

    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin(event) {
      event.preventDefault()
       
      const data = {
        password: this.refs.password.getValue(),
        email: this.refs.email.getValue()
      };

      apiAuth.login(data).then(result => {
        coreAuth.setToken(result.token);
        coreAuth.setUserId(result.user._id);
        coreAuth.setUser(result.user);

        this.props.onLoginSuccess(result.user);
      }).catch(err => {
        alert('Wrong password');
      })
  }
  render() {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">
              <form onSubmit={this.handleLogin}>   
                <TextField
                  style={{width: '100%'}}
                  ref="email"
                  floatingLabelText="Email"
                  type="email"/>
                <br/>
                <TextField
                  style={{width: '100%'}}
                  ref="password"
                  floatingLabelText="Passwort"
                  type="password"/>
                  <br />
                  <RaisedButton 
                    type="submit" 
                    label={this.state.authMode === 'login' ? 'Anmelden' : 'Signup'} 
                    fullWidth={true} 
                  />
              </form>
            </div>
          </div>
          <hr/>
           <div className="row">
                <div className="col-xs-12">
                    <p className="text-center text-muted">
                        <a href="https://studentask.de/pw-recovery" target="_blank">Password vergessen?</a>
                    </p>
                </div>
            </div>
      </div>
    );
  }
};