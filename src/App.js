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
import Offers from './Pages/Offers';
import NewTask from './Pages/NewListing';
import Chat from './Pages/Chat';
import ChatRoom from './Pages/ChatRoom';
import PremiumPage from './Pages/PremiumPage';
import AdminPage from './Admin/Admin';

import * as coreAuth from './core/auth';
import * as coreStyle from './core/style';
import * as coreTracking from './core/tracking';

import * as apiAuth from './api/auth';
import * as corei18n from './core/i18n.js'
import * as coreNavigation from './core/navigation';
import TRANSLATIONS from './generated/Translations.js';

coreNavigation.setBase('app');

Object.keys(TRANSLATIONS).forEach(langKey => corei18n.addLang(langKey, TRANSLATIONS[langKey]));

import './App.css';

class App extends Component {
  constructor () {
    super();

    this.state = {
      user: null
    };

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
          browserHistory.push('/app/login');
        });
    });

    coreAuth.addListener('logout', () => {
      this.setState({ user: null });
    });

    coreAuth.loadFromLocalStorage();
  }

  render() {
      return (
      <MuiThemeProvider>
        <div>
          <Header logo={coreStyle.get('logo')} user={this.state.user}></Header>
          <Router history={browserHistory} onUpdate={coreTracking.pageView}>
            <Route path="/app">
              <IndexRoute component={Offers}/>
              <Route path="admin/:section" component={AdminPage}></Route>
              <Route path="new-listing" component={NewTask}></Route>
              <Route path="premium" component={PremiumPage}></Route>
              <Route path="chat" component={Chat}></Route>
              <Route path="chat/:chatId" component={ChatRoom}></Route>
              <Route path="signup" component={SignupPage}></Route>
              <Route path="login" component={LoginPage}></Route>
              <Route path="task/:taskId" component={Task}></Route>
              <Route path="task/:taskId/edit" component={TaskEdit}></Route>
              <Route path="profile" component={Profile}>
                <Route path=":profileId" component={Profile}></Route>
              </Route>
            </Route>
          </Router>
        </div>
      </MuiThemeProvider>
      );
   }
}

export default App;
