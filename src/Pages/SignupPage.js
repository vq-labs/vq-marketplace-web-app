import React, { Component } from 'react';
import Signup from '../Components/Signup';
import USER_TYPES from '../Components/USER_TYPES';
import { goTo } from '../core/navigation';
import { getUserAsync } from '../core/auth';
import { getParams } from '../core/util.js'

const getOutOfHere = (user, redirectTo) => {
  if (redirectTo) {
    return goTo(redirectTo);
  }

  return goTo(`/email-not-verified`);
  
  /**
  switch (Number(user.userType)) {
      case USER_TYPES.BUYER:
        goTo(`/dashboard?userType=${user.userType}`);
        break;
      case USER_TYPES.SELLER:
        goTo(`/user-preferences`);
        break;
      default:
        goTo(`/`);
    }
  */
};

export default class SignupPage extends Component {
  constructor(props) {
    super();

    const redirectTo = getParams(location.search).redirectTo;

    this.state = {
        redirectTo
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
            <Signup onSuccess={user => getOutOfHere(user)} />
         </div>
    );
  }
}