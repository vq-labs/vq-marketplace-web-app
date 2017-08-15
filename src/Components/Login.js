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
      authMode: 'login'
    };

    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin(event) {
      event.preventDefault()
       
      const data = {
        email: this.refs.email.getValue()
      };

      if (this.state.authMode === 'password_reset') {
        return apiAuth.resetPassword(data)
          .then(result => {
            alert('OK');
          })
          .catch(err => {
            alert('NOT OK');
          })
      }

      data.password = this.refs.password.getValue();

      apiAuth.login(data)
        .then(result => {
          if (result.user && result.token) {
            coreAuth.setToken(result.token);
            coreAuth.setUserId(result.user.id);
            coreAuth.setUser(result.user);

            this.props.onLoginSuccess(result.user);
          }
        })
        .catch(err => {
          if (err && err.err && err.err.code && err.err.code === 'USER_NOT_VERIFIED') {
            if (this.props.onNotVerified) {
              coreAuth.setUserId(err.user.id);
              coreAuth.setUser(err.user);
              coreAuth.setToken(err.token);
              
              return this.props.onNotVerified(err.user);
            }
          }

          const errorMessage = err.desc;

          if (errorMessage) {
            return alert(errorMessage);
          }

          alert(err.err ? err.err.code : err);
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
                  floatingLabelText={translate('EMAIL')}
                  type="email"/>
                <br/>
                { this.state.authMode !== 'password_reset' && <TextField
                  style={{width: '100%'}}
                  ref="password"
                  floatingLabelText={translate('PASSWORD')}
                  type="password"/>
                }  
                  <br />
                  <RaisedButton 
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
                        { this.state.authMode === 'login' && <a onClick={() => this.setState({
                            authMode: 'password_reset'
                          })
                        } target="_blank">{translate('RESET_PASSWORD')}</a>
                        }
                        { this.state.authMode === 'password_reset' && <a onClick={() => this.setState({
                            authMode: 'login'
                          })
                        } target="_blank">{translate('LOGIN')}</a>
                        }
                    </p>
                </div>
            </div>
      </div>
    );
  }
};