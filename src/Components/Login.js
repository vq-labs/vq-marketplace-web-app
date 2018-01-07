import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as apiAuth from '../api/auth';
import * as coreAuth from '../core/auth';
import { translate } from '../core/i18n';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      authMode: 'login'
    };

    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin(event) {
      event.preventDefault()
      
      this.setState({
        isSubmitting: true
      });

      const data = {
        email: this.refs.email.getValue()
      };

      if (this.state.authMode === 'password_reset') {
        return apiAuth.requestPasswordReset(data)
          .then(result => {
            alert('E-mail has been sent. Check your inbox');
          })
          .catch(err => {
            alert('NOT OK');
          })
      }

      data.password = this.refs.password.getValue();

      apiAuth
        .login(data)
        .then(result => {
          if (result.user && result.token) {
            coreAuth.setToken(result.token);
            coreAuth.setUserId(result.user.id);
            coreAuth.setUser(result.user);

            this.props.onLoginSuccess(result.user);
          }
        })
        .catch(err => {
          this.setState({
            isSubmitting: false
          });

          if (err.code === 'USER_NOT_VERIFIED' || (err && err.err && err.err.code && err.err.code === 'USER_NOT_VERIFIED')) {
            if (this.props.onNotVerified) {
              coreAuth.setUserId(err.user.id);
              coreAuth.setUser(err.user);
              coreAuth.setToken(err.token);
              
              return this.props.onNotVerified(err.user);
            }
          }

          alert(err ? translate(err.code) : err);
        })
  }
  render() {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">
            { this.state.authMode === 'login' &&
              <h1>
                {translate('LOGIN')}
              </h1>
            }
            { this.state.authMode === 'password_reset' &&
              <h1>
                {translate('RESET_PASSWORD')}
              </h1>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
              <form onSubmit={this.handleLogin}>   
                <TextField
                  floatingLabelFixed={true}
                  style={{width: '100%'}}
                  ref="email"
                  floatingLabelText={translate('EMAIL')}
                  type="email"/>
                <br/>
                { this.state.authMode !== 'password_reset' &&
                  <TextField
                    floatingLabelFixed={true}
                    style={{width: '100%'}}
                    ref="password"
                    floatingLabelText={translate('PASSWORD')}
                    type="password"
                  />
                }  
                  <br />
                  <RaisedButton
                    disabled={this.state.isSubmitting}
                    type="submit" 
                    label={translate('SUBMIT')}
                    fullWidth={true} 
                  />
              </form>
            </div>
          </div>
          <hr/>
           <div className="row">
                <div className="col-xs-12">
                    <p className="text-center text-muted">
                        { this.state.authMode === 'login' && 
                        <a 
                          onClick={() => this.setState({
                              authMode: 'password_reset'
                          })}
                          className="with-pointer"
                        >
                          {translate('RESET_PASSWORD')}
                        </a>
                        }
                        { this.state.authMode === 'password_reset' &&
                          <a 
                            className="with-pointer"
                            onClick={() => this.setState({
                                authMode: 'login'
                            })}
                          >
                            {translate('LOGIN')}
                          </a>
                        }
                    </p>
                </div>
            </div>
      </div>
    );
  }
};