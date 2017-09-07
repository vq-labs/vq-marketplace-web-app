import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

import apiUser from '../api/user';
import * as apiUserProperty from '../api/user-property';
import { goTo, goStartPage } from '../core/navigation';
import { getUserAsync } from '../core/auth';
import { translate } from '../core/i18n';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';

import '../App.css';

export default class Account extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            ready: false,
            isLoading: true,
            user: null,
            data: {
                emailNotifDisabled: false,
                phoneNo: null
            },
            toBeUpdated: {
                phoneNo: false
            }
        };
    }
    componentDidMount() {
        getUserAsync(user => {
            if (!user) {
                return goTo('/');
            }
            
            let phoneProp = user.userProperties
                .find(_ => _.propKey === 'phoneNo');

            let emailNotifDisabledProp = user.userProperties
                .find(_ => _.propKey === 'emailNotifDisabled');

            if (!emailNotifDisabledProp) {
                emailNotifDisabledProp = {
                    propKey: 'emailNotifDisabled',
                    propValue: null
                };

                user.userProperties.push(emailNotifDisabledProp);
            } else {
                emailNotifDisabledProp.propValue = emailNotifDisabledProp.propValue === "1";
            }

            this.setState({
                data: {
                    emailNotifDisabled: emailNotifDisabledProp.propValue,
                    phoneNo: phoneProp.propValue
                },
                user,
                isLoading: false
            })
        }, true);
    }
    render() {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>{translate('ACCOUNT_SETTINGS')}</h1>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>{translate('ACCOUNT_USER_DETAILS_HEADER')}</h2>
                            <p className="text-muted">{translate('ACCOUNT_USER_DETAILS_DESC')}</p>
                        </div>

                        <div className="col-xs-12">
                              <TextField
                                    maxLength={10}
                                    required={true}
                                    onChange={(_, value) => {
                                        const data = this.state.data;

                                        data.phoneNo = value;

                                        this.setState({
                                            data,
                                            toBeUpdated: {
                                                phoneNo: true
                                            }
                                        });
                                    }}
                                    value={this.state.data.phoneNo}
                                    floatingLabelText={`${translate('PHONE_NO')}*`}
                                    type="number"
                                />
                        </div>

                        <div className="col-xs-12">
                            <FlatButton
                                disabled={!this.state.toBeUpdated.phoneNo}
                                primary={true}
                                onTouchTap={
                                    () => {
                                        const phoneNo = this.state.data.phoneNo;

                                        apiUserProperty
                                            .createItem(this.state.user.id, 'phoneNo', phoneNo)
                                            .then(_ => {
                                                this.setState({
                                                    toBeUpdated: {
                                                        phoneNo: false
                                                    }
                                                })
                                            }, _ => _);
                                    }
                                }
                                label={translate('UPDATE')}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>{translate('ACCOUNT_NOTIFICATIONS_HEADER')}</h2>
                            <p className="text-muted">{translate('ACCOUNT_NOTIFICATIONS_DESC')}</p>
                        </div>

                        <div className="col-xs-12">
                            <Checkbox
                                checked={!this.state.data.emailNotifDisabled}
                                label={translate("EMAIL_NOTIFICATIONS")}
                                onCheck={() => {
                                    const oldState = this.state;

                                    oldState.data.emailNotifDisabled = !oldState.data.emailNotifDisabled;

                                    this.setState(oldState);

                                    apiUserProperty
                                            .createItem(this.state.user.id, 'emailNotifDisabled', oldState.data.emailNotifDisabled)
                                            .then(_ => _, _ => _);
                                }}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>{translate('DELETE_YOUR_ACCOUNT_HEADER')}</h2>
                            <p className="text-muted">{translate('DELETE_YOUR_ACCOUNT_DESC')}</p>
                        </div>

                        <div className="col-xs-12">
                            <RaisedButton
                                secondary={true}
                                label={translate('DELETE_YOUR_ACCOUNT_ACTION')}
                                onTouchTap={() => {
                                    openConfirmDialog({}, () => {
                                        apiUser
                                            .deleteItem(this.state.user.id)
                                            .then(_ => {
                                                goStartPage();
                                            }, err => {
                                                alert('Error');
                                            });
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
    }
};