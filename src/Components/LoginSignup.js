import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import Login from './Login';
import Signup from './Signup';

export default class LoginSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'signup'
    };
  }
  render() {
    return (
      <div className="col-xs-12">
        <Tabs value={this.state.value}
              onChange={(value) => this.setState({
                value
              })}
        >
            <Tab label="Login" value="login" >
                { this.state.value === 'login' && <Login onLoginSuccess={() => this.props.onSuccess() }/> }
            </Tab>
            <Tab label="Registieren" value="signup">
                { this.state.value === 'signup' && <Signup onSuccess={() => this.props.onSuccess() }/> }
            </Tab>
        </Tabs>
      </div>
    );
  }
};