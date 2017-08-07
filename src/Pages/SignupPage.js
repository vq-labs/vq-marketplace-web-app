import React, { Component } from 'react';
import Signup from '../Components/Signup';
import { goTo } from '../core/navigation';

export default class SignupPage extends Component {
  render() {
    return (
         <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <Signup onSuccess={user => {
              const userId = user.id || user.userId;

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
            }} />
         </div>       
    );
  }
}