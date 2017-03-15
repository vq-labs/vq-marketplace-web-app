import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Login from '../Components/Login';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
         <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <Login onLoginSuccess={ () => browserHistory.push('/app') } />
         </div>       
    );
  }
}