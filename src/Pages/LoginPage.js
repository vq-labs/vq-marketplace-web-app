import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import Login from '../Components/Login';

export default class LoginPage extends Component {
  render() {
    return (
         <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <Login onLoginSuccess={user => {
              goTo(`/dashboard?userType=${user.userType}`)}
            } />
         </div>       
    );
  }
}