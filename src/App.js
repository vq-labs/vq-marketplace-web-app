import React, { Component } from 'react';

// Library components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AppRoutes from './AppRoutes';  
import Header from './Partials/Header';
import Footer from './Partials/Footer';
import * as coreAuth from './core/auth';
import { getLang } from './core/i18n.js';
import * as coreUtil from './core/util.js';
import * as coreConfig from './core/config.js';
import * as coreCategories from './core/categories.js';
import { Component as ConfirmDialog } from './helpers/confirm-before-action.js';
import { Component as RequestDialog } from './helpers/open-requests-dialog';
import { Component as MessageDialog } from './helpers/open-message-dialog';
import { Component as AddPaymentMethodDialog } from './helpers/add-payment-method';
import { Component as MessageSnackbar } from './helpers/display-message';
import { fetchAndAddLang } from './helpers/i18n-helpers';
import { setBase } from './core/navigation';
import { init as initUserMode } from './core/user-mode.js';
import * as apiAuth from './api/auth';
import * as apiConfig from './api/config';

setBase('app');

let muiTheme;
class App extends Component {
  constructor (props) {
    super(props);
    
    this.state = {
      ready: false,
      metaReady: false,
      labelsReady: false,
      user: null,
      meta: {}
    };

    /**
    if (location.pathname === '/') {
      goTo('/');
    }
     */

    apiConfig
    .categories
    .getItems({}, {
      cache: true
    })
    .then(categories => {
      coreCategories.set(categories);
    });

    apiConfig
    .appConfig
    .getItems({}, {
      cache: true
    })
    .then(config => {
        coreConfig.set(config);
       
        // This replaces the textColor value on the palette
        // and then update the keys for each component that depends on it.
        // More on Colors: http://www.material-ui.com/#/customization/colors
        if (location.pathname.indexOf('admin') > -1) {
          muiTheme = getMuiTheme({
            palette: {
              primary1Color: "#000639"
            }
          });
        } else {
          muiTheme = getMuiTheme({
            palette: {
              primary1Color: config.COLOR_PRIMARY  || "#000639"
            }
          });
        }

        const params = coreUtil.getParams(location.search);

        if (params.token) {
          coreAuth.setToken(params.token);
        } else {
          coreAuth.loadFromLocalStorage();
        }

        coreAuth.addListener('login', () => {
          apiAuth
            .me()
            .then(myUserData => {

              initUserMode(myUserData.userType);

              coreAuth.setUserId(myUserData.id);  
              coreAuth.setUser(myUserData);

              this.setState({
                user: myUserData
              });
            })
            .catch(err => {
              coreAuth.destroy();
            });
        }, true);

        coreAuth.addListener('logout', () => {
          this.setState({
            user: null
          });
        });

        return this.setState({
          metaReady: true,
          config
        })
      });
  }

  componentDidMount() {
    coreConfig.getConfigAsync(config => {
      fetchAndAddLang(getLang(), false, () => {
        coreAuth.getUserAsync(user => {

          if (user) {
            initUserMode(user.userType);
          }

          this.setState({
            ready: true
          });
        }, true);
      });
    });
  }

  render() {
      return (
        this.state.ready && this.state.config &&
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <Header user={this.state.user}></Header>
           
            { AppRoutes }
         
            { window.location.pathname.indexOf("admin") === -1 &&
              this.state.config.APP_FOOTER_VISIBLE === "1" &&
              <Footer
                logo={this.state.config.LOGO_URL}
                appName={this.state.config.NAME}
              >
              </Footer>
            }

            <ConfirmDialog />
            <RequestDialog />
            <MessageDialog />
            <MessageSnackbar />
            <AddPaymentMethodDialog />
          </div>
        </MuiThemeProvider> 
      );
   }
}

export default App;
