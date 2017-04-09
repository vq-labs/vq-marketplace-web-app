import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// Library components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Custom components
import Header from './Partials/Header';
import Task from './Pages/Task';
import TaskEdit from './Pages/TaskEdit';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import Profile from './Pages/Profile';
import ProfileEdit from './Pages/ProfileEdit';
import YourInserate from './Components/YourInserate';
import Offers from './Pages/Offers';
import NewTask from './Pages/NewListing';
import Chat from './Pages/Chat';
import ChatRoom from './Pages/ChatRoom';
import PremiumPage from './Pages/PremiumPage';
import AdminPage from './Admin/Admin';
    
import * as coreAuth from './core/auth';
import * as coreTracking from './core/tracking';
import * as corei18n from './core/i18n.js';
import * as coreUtil from './core/util.js'
import * as coreNavigation from './core/navigation';
import * as apiAuth from './api/auth';
import * as apiConfig from './api/config';

import './App.css';

coreNavigation.setBase('app');

// dummy language init
corei18n.addLang('en', {});
corei18n.addLang('de', {});
corei18n.addLang('tr', {});
corei18n.addLang('pl', {});

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      metaReady: false,
      labelsReady: false,
      user: null,
      meta: {}
    };

    const params = coreUtil.getParams(location.search);

    coreAuth.addListener('login', () => {
      apiAuth.me()
        .then(myUserData => {
          coreAuth.setUserId(myUserData._id);  
          coreAuth.setUser(myUserData);

          this.setState({
            user: myUserData
          });
        })
        .catch(err => {
          coreAuth.destroy();
          coreNavigation.goTo('/login');
        });
    });

    coreAuth.addListener('logout', () => {
      this.setState({ user: null });
    });
    
    if (params.token) {
      coreAuth.setToken(params.token);
    } else {
      coreAuth.loadFromLocalStorage();
    }

    apiConfig.appConfig.getItems({}, { cache: true })
        .then(config => {
          return this.setState({ metaReady: true, meta: config })
        });

    apiConfig.appLabel.getItems({ lang: 'en' }, { cache: true })
      .then(labels => {
        debugger;
        corei18n.addLang('en', labels);

        this.setState({ labelsReady: true })
      });
  }

  render() {
      return (
        this.state.metaReady && this.state.labelsReady && <MuiThemeProvider>
          <div>
            <Header logo={this.state.meta.LOGO_URL} homeLabel={'Offer'} user={this.state.user}></Header>
            <Router history={browserHistory} onUpdate={coreTracking.pageView}>
              <Route path="/app">
                <IndexRoute component={Offers}/>
                <Route path="yourInserate" component={YourInserate}></Route>
                <Route path="admin/:section" component={AdminPage}></Route>
                <Route path="new-listing" component={NewTask}></Route>
                <Route path="new-listing/:taskId" component={NewTask}></Route>
                <Route path="premium" component={PremiumPage}></Route>
                <Route path="chat" component={Chat}></Route>
                <Route path="chat/:chatId" component={ChatRoom}></Route>
                <Route path="signup" component={SignupPage}></Route>
                <Route path="login" component={LoginPage}></Route>
                <Route path="task/:taskId" component={Task}></Route>
                <Route path="task/:taskId/edit" component={TaskEdit}></Route>
                <Route path="profile/:profileId" component={Profile}></Route>
                <Route path="profile/:profileId/edit" component={ProfileEdit}></Route>
              </Route>
            </Router>
          </div>
        </MuiThemeProvider> 
      );
   }
}

export default App;
