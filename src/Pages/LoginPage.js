import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import Login from '../Components/Login';
import Snackbar from 'material-ui/Snackbar';
import { getParams } from '../core/util.js'
import { getUserAsync } from '../core/auth';
import { init as initUserMode } from '../core/user-mode.js';
import { CONFIG } from '../core/config';

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

                initUserMode(user.userType);

                if (this.state.redirectTo) {
                  return goTo(this.state.redirectTo, this.state.redirectTo.indexOf("admin") > -1);
                }

                switch (Number(user.userType)) {
                  case 1: // demand user
                    if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
                      return goTo(`/`);
                    }

                    if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
                      return goTo(`/dashboard/listings`);
                    }

                    break;
                  case 2:
                    if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
                      return goTo(`/`);
                    }

                    if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
                      return goTo(`/dashboard/listings`);
                    }

                    break;
                  default:
                    goTo(`/`);
                }
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