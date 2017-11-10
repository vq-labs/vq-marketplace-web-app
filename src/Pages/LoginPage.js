import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import Login from '../Components/Login';
import Snackbar from 'material-ui/Snackbar';
import { getParams } from '../core/util.js'
import { getUserAsync } from '../core/auth';

const getOutOfHere = (user, redirectTo) => {
  if (redirectTo) {
    return goTo(redirectTo);
  }

  return goTo(`/`);
};

export default class LoginPage extends Component {
  constructor(props) {
        super();

        const redirectTo = getParams(location.search).redirectTo;

        this.state = {
            redirectTo,
            loginSuccessful: false
        };
  }

  componentDidMount() {
    getUserAsync(user => {
      if (user) {
        getOutOfHere(user, this.state.redirectTo);
      }
    }, false);
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
                  if (this.state.redirectTo) {
                    return goTo(this.state.redirectTo, this.state.redirectTo.indexOf("admin") > -1);
                  }

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
                }, 1000);
              }}
              onNotVerified={() => {
                return goTo('/email-not-verified');
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