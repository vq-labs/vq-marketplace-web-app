import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Signup from '../Components/Signup';

export default class SignupPage extends Component {
  render() {
    return (
         <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <Signup onSuccess={user => 
              browserHistory.push(`/app/profile/${user.id || user.userId}`
            )} />
         </div>       
    );
  }
}