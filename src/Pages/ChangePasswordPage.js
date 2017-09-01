import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as apiAuth from '../api/auth';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';

export default class ChangePasswordPage extends Component {
  constructor(props) {
    super(props);

    const resetCode = props.location.query.code;

    this.state = {
      resetCode,
      isSubmitted: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault()
    
    const resetCode = this.state.resetCode;

    const data = {
      newPassword: this.refs.newPassword.getValue(),
      repeatNewPassword: this.refs.repeatNewPassword.getValue()
    };

    if (!resetCode) {
      data.currentPassword = this.refs.currentPassword.getValue();
    } else {
      data.code = resetCode;
    }

    if (data.newPassword !== data.repeatNewPassword) {
        return alert('Passwords do not match');
    }
     
    this.setState({
      isSubmitted: true
    });

    return apiAuth[
      resetCode ?
      'resetPassword' :
      'changePassword'
    ](data)
      .then(() => { 
        alert('Password has been changed');

        return goTo('/login');
      }, err => {
        alert(err.err.code)
      
        this.setState({
          isSubmitted: false
        });
      });
  }
  render() {
    const columnWidth = 'col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4';

    return (
      <div className="col-xs-12">
        <div className="row">
          <div className={columnWidth}>
            <h1>{translate('RESET_PASSWORD')}</h1>
          </div>
        </div>  
        <div className="row">
          <div className={columnWidth}>
              <form onSubmit={this.handleSubmit}>
                { !this.state.resetCode &&
                <TextField
                  style={{
                    width: '100%'
                  }}
                  ref="currentPassword"
                  floatingLabelText={translate('PASSWORD')}
                  type="password"/>
                }  
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
                  floatingLabelText={translate('REPEAT_PASSWORD')}
                  type="password"/>
                <br />
                  <RaisedButton
                    disabled={this.state.isSubmitted}
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