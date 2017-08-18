import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import Login from '../Components/Login';
import Snackbar from 'material-ui/Snackbar';

export default class LoginPage extends Component {
  constructor(props) {
        super();

        this.state = {
            loginSuccessful: false
        };
    }
  render() {
    return (
         <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <Login 
              onLoginSuccess={user => {

                this.setState({
                  loginSuccessful: true
                });

                setTimeout(() => {
                  switch (Number(user.userType)) {
                    case 1:
                      goTo(`/dashboard?userType=${user.userType}`);
                      break;
                    case 2:
                      goTo(`/`);
                      break;
                    default:
                      goTo(`/`);
                  }
                }, 1100);
              }} 
              onNotVerified={() => {
                goTo('/email-not-verified');
              }}
              />
              <Snackbar
                open={this.state.loginSuccessful}
                message={translate('LOGIN_SUCCESSFUL')}
                autoHideDuration={900}
              />
         </div>       
    );
  }
}