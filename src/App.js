import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// Library components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Custom components
import ChangePasswordPage from './Pages/ChangePasswordPage';  
import Header from './Partials/Header';
import Footer from './Partials/Footer';
import Task from './Pages/Task';
import Dashboard from './Pages/Dashboard';
import TaskEdit from './Pages/TaskEdit';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import Profile from './Pages/Profile';
import ProfileEdit from './Pages/ProfileEdit';
import MyListings from './Pages/MyListings';
import BrowseListings from './Pages/BrowseListings';
import Account from './Pages/Account';
import NewTask from './NewListing/NewListing';
import Chat from './Pages/Chat';
import EmailNotVerified from './Pages/EmailNotVerified';
import ChatRoom from './Pages/ChatRoom';
import BookRequest from './Pages/BookRequest';
import NotFound from './Pages/NotFound';
import PremiumPage from './Pages/PremiumPage';
import AdminPage from './Admin/Admin';
import AdminUserPage from './Admin/User';
import PostEdit from './Admin/PostEdit';
import Post from './Pages/Post';
import PostPrivacyPolicy from './Pages/PostPrivacyPolicy';
import PostTermsOfService from './Pages/PostTermsOfService';
import Review from './Pages/Review';
import StartPage from './Pages/StartPage';
import Imprint from './Pages/Imprint';
import UserDocuments from './Pages/UserDocuments';
import UserPreferences from './Pages/UserPreferences';
import UserVerifications from './Pages/UserVerifications';
import * as coreAuth from './core/auth';
import * as coreTracking from './core/tracking';
import { getLang } from './core/i18n.js';
import * as coreUtil from './core/util.js';
import * as coreConfig from './core/config.js';
import * as coreCategories from './core/categories.js';
import { Component as ConfirmDialog } from './helpers/confirm-before-action.js';
import { Component as RequestDialog } from './helpers/open-requests-dialog';
import { Component as MessageDialog } from './helpers/open-message-dialog';
import { Component as MessageSnackbar } from './helpers/display-message';
import { fetchAndAddLang } from './helpers/i18n-helpers';
import { setBase } from './core/navigation';
import * as apiAuth from './api/auth';
import * as apiConfig from './api/config';

setBase('app');

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
              coreAuth.setUserId(myUserData.id);  
              coreAuth.setUser(myUserData);

              this.setState({
                user: myUserData
              });
            }).catch(err => {
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
          meta: config
        })
      });
  }

  componentDidMount() {
    coreConfig.getConfigAsync(config => {
      fetchAndAddLang(getLang(), false, () => {
        coreAuth.getUserAsync(user => {
          this.setState({
            ready: true
          });
        }, true);
      });
    });
  }

  render() {
      return (
        this.state.ready && this.state.metaReady && <MuiThemeProvider>
          <div>
            <Header
              appName={this.state.meta.NAME}
              logo={this.state.meta.LOGO_URL}
              user={this.state.user}>
            </Header>
            <Router history={browserHistory} onUpdate={coreTracking.pageView}>
              <Route path="/">
                <IndexRoute component={StartPage}/>
              </Route>
              <Route path="/app">
                <IndexRoute component={BrowseListings}/>
                <Route path="account" component={Account}></Route>
                <Route path="dashboard" component={Dashboard}></Route>
                <Route path="change-password" component={ChangePasswordPage}></Route>
                <Route path="my-listings" component={MyListings}></Route>
                <Route path="listings" component={BrowseListings}></Route>
                <Route path="user-preferences" component={UserPreferences}></Route>
                <Route path="user-verifications" component={UserVerifications}></Route>
                <Route path="user-documents" component={UserDocuments}></Route>
                <Route path="admin/:section" component={AdminPage}></Route>
                <Route path="admin/user/:userId" component={AdminUserPage}></Route>
                <Route path="new-listing" component={NewTask}></Route>
                <Route path="new-listing/:taskId" component={NewTask}></Route>
                <Route path="premium" component={PremiumPage}></Route>
                <Route path="chat" component={Chat}></Route>
                <Route path="chat/:chatId" component={ChatRoom}></Route>
                <Route path="request/:chatId" component={ChatRoom}></Route>
                <Route path="request/:requestId/book" component={BookRequest}></Route>
                <Route path="request/:requestId/review" component={Review}></Route>
                <Route path="order/:orderId/review" component={Review}></Route>
                <Route path="signup" component={SignupPage}></Route>
                <Route path="login" component={LoginPage}></Route>
                <Route path="post/:postId" component={Post}></Route>
                <Route path="terms" component={PostTermsOfService}></Route>
                <Route path="privacy" component={PostPrivacyPolicy}></Route>
                <Route path="imprint" component={Imprint}></Route>
                <Route path="email-not-verified" component={EmailNotVerified}></Route>
                <Route path="post/:postId/edit" component={PostEdit}></Route>
                <Route path="task/:taskId" component={Task}></Route>
                <Route path="task/:taskId/edit" component={TaskEdit}></Route>
                <Route path="profile/:profileId" component={Profile}></Route>
                <Route path="my-listings" component={MyListings}></Route>
                <Route path="profile/:profileId/edit" component={ProfileEdit}></Route>
                <Route path="*" component={NotFound}></Route>
              </Route>
            </Router>
            <Footer
              logo={this.state.meta.LOGO_URL}
              appName={this.state.meta.NAME}
            >
            </Footer>

            <ConfirmDialog />
            <RequestDialog />
            <MessageDialog />
            <MessageSnackbar />
          </div>
        </MuiThemeProvider> 
      );
   }
}

export default App;
