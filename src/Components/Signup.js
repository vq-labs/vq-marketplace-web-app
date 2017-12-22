import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { appUserProperty } from '../api/config';
import * as apiAuth from '../api/auth';
import * as coreAuth from '../core/auth';
import { getAppPath } from '../core/navigation';
import { translate } from '../core/i18n';
import { CONFIG } from '../core/config';

const USER_TYPES = {
  BUYER: 1, // client
  SELLER: 2 // student
};

class Signup extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userType: CONFIG.USER_ENABLE_SUPPLY_DEMAND_ACCOUNTS === "1" ? USER_TYPES.BUYER : 0,
      userProperties: []
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    appUserProperty
      .getItems()
      .then(userProperties => this.setState({
        userProperties
      }));
  }

  handleLogin(event) {
      event.preventDefault();

      const refs = this.refs;
      const data = {};

      Object
        .keys(refs)
        .forEach(refKey => {
          data[refKey] = refs[refKey].getValue();
        });

      data.userType = this.state.userType;

      if (data['repeatPassword'] !== data['password']) {
        return alert(translate('PASSWORDS_DO_NOT_MATCH'));
      }

      apiAuth
        .signup(data)
        .then(result => {
          coreAuth.setToken(result.token);
          coreAuth.setUserId(result.user.id);
          coreAuth.setUser(result.user);
          
          this.props.onSuccess(result.user);
        })
        .catch(err => {
            err = err.err || err;

            const translated = translate(err.code);

            return alert(translated === err.code ? err.desc : translated);
        });
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
        <h1 
          style={{color: CONFIG.COLOR_PRIMARY}}
        >
          {translate('SIGNUP_PAGE_TITLE')}
        </h1>
        <p>{translate('SIGNUP_PAGE_DESC')}</p>
        
          <div className="row">
            <div className="col-xs-12">
                <form onSubmit={this.handleLogin}>   
                  <TextField
                      required={true}
                      floatingLabelFixed={true}
                      style={{width: '100%'}}
                      ref="firstName"
                      floatingLabelText={`${translate('FIRST_NAME')} *`}
                      type="text"/>
                    <br />
                  <TextField
                      required={true}
                      floatingLabelFixed={true}
                      style={{width: '100%'}}
                      ref="lastName"
                      floatingLabelText={`${translate('LAST_NAME')} *` }
                      type="text"/>
                    <br />
                    <TextField
                      required={true}
                      floatingLabelFixed={true}
                      style={{width: '100%'}}
                      ref="email"
                      floatingLabelText={`${translate('EMAIL_ADDRESS')} *`}
                      type="email"/>
                    <br/>
                    <TextField
                      required={true}
                      floatingLabelFixed={true}
                      style={{width: '100%'}}
                      ref="password"
                      floatingLabelText={`${translate('PASSWORD')} *`}
                      type="password"/>
                    <br />
                    <TextField
                      required={true}
                      floatingLabelFixed={true}
                      style={{width: '100%'}}
                      ref="repeatPassword"
                      floatingLabelText={`${translate('REPEAT_PASSWORD')} *`}
                      type="password"/>
                    <br />
                    { CONFIG.USER_REQUIRE_PHONE_NUMBER === "1" && this.state.userProperties
                      .map(userProperty =>
                        <TextField
                          floatingLabelFixed={true}
                          onChange={(_, newValue) => {
                            newValue = String(newValue);

                            newValue = newValue.split('.').join('');
                            newValue = newValue.split('+').join('');
                            newValue = newValue.split(' ').join('');

                            if (!isNaN(Number(newValue)) && newValue.length < 14) {
                              this.setState({
                                phoneNo: newValue
                              });
                            } else {
                              this.setState({
                                phoneNo: this.state.phoneNo
                              });
                            }
                          }}
                          required={userProperty.required}
                          key={userProperty.propKey}
                          value={this.state.phoneNo}
                          ref={userProperty.propKey}
                          style={{width: '100%'}}
                          floatingLabelText={`${translate(userProperty.labelKey)} ${userProperty.required ? '*' : ''}`}
                          type="text"
                        />
                      )
                    }
                    
                    <div className="row">
                      { CONFIG.USER_ENABLE_SUPPLY_DEMAND_ACCOUNTS === "1" &&
                      <div class="col-xs-12">
                          <h4>{translate('FIND_OR_POST_TASKS')}</h4>
                          <div className="col-xs-6">
                            { this.state.userType === USER_TYPES.BUYER &&
                              <FlatButton
                                className="btn-block"
                                onClick={() => this.setState({ userType: USER_TYPES.SELLER })}
                                label={translate('SIGNUP_SUPPLY_USER_TYPE')}
                                fullWidth={true}
                              />
                            }
                            { this.state.userType === USER_TYPES.SELLER &&
                              <RaisedButton
                                label={translate('SIGNUP_SUPPLY_USER_TYPE')}
                                labelStyle={{color: 'white '}}
                                backgroundColor={CONFIG.COLOR_PRIMARY}
                                fullWidth={true}
                              />
                            }
                          </div>
                          <div className="col-xs-6">
                            { this.state.userType === USER_TYPES.SELLER &&
                              <FlatButton
                                className="btn-block"
                                onClick={() => this.setState({ userType: USER_TYPES.BUYER })}
                                label={translate('SIGNUP_DEMAND_USER_TYPE')}
                                fullWidth={true}
                              />
                            }
                            { this.state.userType === USER_TYPES.BUYER &&
                              <RaisedButton
                                label={translate('SIGNUP_DEMAND_USER_TYPE')}
                                labelStyle={{color: 'white '}}
                                backgroundColor={CONFIG.COLOR_PRIMARY}
                                fullWidth={true}
                              />
                            }
                          </div>
                      </div>
                      }
                         
                          <div className="col-xs-12">
                          <div className="col-xs-12" style={{
                            marginTop: 20
                          }}>
                                <Checkbox
                                    checked={this.state.termsAccepted}
                                    label={translate("TERMS_AND_PRIVACY_AGREEMENT_STATEMENT")}
                                    onCheck={() => {
                                        this.setState({
                                          termsAccepted: !this.state.termsAccepted
                                        })
                                    }}
                                />
                                <p className="text-center text-muted">
                                  <ul className="text-left">
                                    <li>
                                      <a href="/app/terms" target="_blank">{translate('TERMS_OF_SERVICE')}</a>
                                    </li>
                                    <li>
                                      <a href="/app/privacy" target="_blank">{translate('PRIVACY_POLICY')}</a>
                                    </li>
                                  </ul>
                                </p>
                            </div>
                        </div>
                    </div>
                    <br />
                    <RaisedButton
                      disabled={!this.state.termsAccepted || String(this.state.phoneNo).length < 9}
                      type="submit"
                      label={translate('REGISTER')}
                      fullWidth={true}
                    />
                </form>
              </div>
            </div>
            <hr/>
            <div class="row">
                  <div className="col-xs-12">
                      <p className="text-center text-muted">
                        {translate('ALREADY_HAVE_AN_ACCOUNT')}<br />
                        <a href={getAppPath('/login')}>{translate('LOGIN_TO_CONTINUE')}</a>
                      </p>
                  </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Signup;
