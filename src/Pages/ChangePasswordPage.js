import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as apiAuth from '../api/auth';
import * as coreAuth from '../core/auth';
import { translate } from '../core/i18n';

export default class ChangePasswordPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault()
    
    const data = {
      currentPassword: this.refs.currentPassword.getValue(),
      newPassword: this.refs.newPassword.getValue(),
      repeatNewPassword: this.refs.repeatNewPassword.getValue()
    };

    if (data.newPassword !== data.repeatNewPassword) {
        return alert('Passwords do not match');
    }
     
    return apiAuth.changePassword(data)
      .then(() => { alert('Password changed') })
      .catch(err => {
        console.error(err);
        
        alert(err.err.code)
      });
  }
  render() {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
              <form onSubmit={this.handleSubmit}>   
                <TextField
                  style={{width: '100%'}}
                  ref="currentPassword"
                  floatingLabelText={translate('PASSWORD')}
                  type="password"/>
                <br/>
                <TextField
                  style={{width: '100%'}}
                  ref="newPassword"
                  floatingLabelText={translate('NEW_PASSWORD')}
                  type="password"/>
                <br />
                <TextField
                  style={{width: '100%'}}
                  ref="repeatNewPassword"
                  floatingLabelText={translate('REPEAT_NEW_PASSWORD')}
                  type="password"/>
                <br />
                  <RaisedButton 
                    type="submit" 
                    label={translate('SUBMIT')}
                    fullWidth={true} 
                  />
              </form>
            </div>
          </div>
      </div>
    );
  }
};