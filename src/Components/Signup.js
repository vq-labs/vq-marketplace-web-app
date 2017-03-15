import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as apiAuth from '../api/auth';
import * as coreAuth from '../core/auth';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogin = this.handleLogin.bind(this);
  }
   handleLogin(event) {
      event.preventDefault()
       
      const data = {
        password: this.refs.password.getValue(),
        email: this.refs.email.getValue(),
        firstName: this.refs.firstName.getValue(),
        lastName: this.refs.lastName.getValue(),
        utm: {
            medium: 'web',
            source: 'web-app-v1'
        }
      };

      apiAuth.signup(data).then(result => {
        coreAuth.setToken(result.token);
        coreAuth.setUserId(result.user._id);
        coreAuth.setUser(result.user);
        
        this.props.onSuccess(result.user);
      }).catch(err => {
        alert('Error');
      });
  }
  render() {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">
              <form onSubmit={this.handleLogin}>   
                <TextField
                    style={{width: '100%'}}
                    ref="firstName"
                    floatingLabelText="Vorname"
                    type="text"/>
                  <br />
                <TextField
                    style={{width: '100%'}}
                    ref="lastName"
                    floatingLabelText="Nachname"
                    type="text"/>
                  <br />
                  <TextField
                    style={{width: '100%'}}
                    ref="email"
                    floatingLabelText="E-Mail-Addresse"
                    type="email"/>
                  <br/>
                  <TextField
                    style={{width: '100%'}}
                    ref="password"
                    floatingLabelText="Passwort erstellen"
                    type="password"/>
                  <br />
                  <RaisedButton type="submit" label="Registrieren" fullWidth={true} />
              </form>
            </div>
          </div>
          <hr/>
           <div class="row">
                <div className="col-xs-12">
                    <p className="text-center text-muted">
                        Indem ich mich registriere, erkläre ich mich mit StudenTask <a href="https://studentask.de/terms" target="_blank">Nutzungsbedingungen</a> und <a href="https://studentask.de/privacy" target="_blank">Datenschutzerklärung</a>  einverstanden.
                    </p>
                </div>
            </div>
      </div>
    );
  }
}

export default Signup;