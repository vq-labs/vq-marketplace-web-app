import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Address from '../Components/Address';
import apiUser from '../api/user';
import apiPost from '../api/post';
import * as apiTaskLocation from '../api/task-location';
import apiBillingAddress from '../api/billing-address';
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
            billingAddressId: null,
            ready: false,
            isLoading: true,
            user: null,
            billingAddress: null,
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

            const data = this.state.data;

            this.setState({
                user
            });

            /**
                user.userProperties
                .forEach(userProperty => {
                    userProperty.propValue = userProperty.propValue === "1";
                });
            */

            apiPost
            .getItems({
                type: 'email'
            })
            .then(emails => {
                const emailCodes = emails
                .filter(_ => {
                    if (String(user.userType) === '1') {
                        if ([
                            "new-request-sent",
                            "request-accepted",
                            "request-marked-as-done",
                            "request-completed",
                            "request-declined",
                            "request-cancelled",
                            "request-closed",
                            "new-task",
                            "user-blocked"
                        ].indexOf(_.code) !== -1) {
                            return false;
                        }
                    }

                    if (String(user.userType) === '2') {
                        if ([
                            "new-request-received",
                            "new-order",
                            "task-request-cancelled",
                            "order-marked-as-done",
                            "order-completed",
                            "task-marked-spam",
                            "user-blocked",
                            "listing-cancelled",
                            "order-closed",
                        ].indexOf(_.code) !== -1) {
                            return false;
                        }
                    }

                    return [
                        'welcome',
                        'password-reset'
                    ].indexOf(_.code) === -1;
                })
                .map(_ => `EMAIL_${_.code}`)
                

                this.setState({
                    emails: emailCodes
                });
                /**
                const properties = emails;

                properties.push('phone');
                properties.push('emailNotifDisabled');
                */

                const propertyCodes = JSON.parse(JSON.stringify(emailCodes));

                propertyCodes.push('phoneNo');
                // propertyCodes.push('emailNotifDisabled');

                propertyCodes.forEach(userPropertyKey => {
                    let property = user.userProperties
                    .find(_ => _.propKey === userPropertyKey);
    
                    if (!property) {
                        property = {
                            propKey: userPropertyKey,
                            propValue: null
                        };
    
                        user
                        .userProperties
                        .push(userPropertyKey);
    
                        data[userPropertyKey] = false;
                    } else {
                        if (userPropertyKey === 'phoneNo') {
                            data[userPropertyKey] = property.propValue;
                        } else {
                            switch (property.propValue) {
                                case '1':
                                    data[userPropertyKey] = true;
                                    break;
                                case '0':
                                    data[userPropertyKey] = false;
                                    break;
                                default:
                                    data[userPropertyKey] = property.propValue;
                            }
                        }
                    }
                });
           
                this.setState({
                    data,
                    isLoading: false
                });
            });

            apiTaskLocation
            .getItems({
                userId: user.id
            })
            .then(defaultListingLocation => {
                if (defaultListingLocation[0]) {
                    this.setState({
                        defaultListingLocationId: defaultListingLocation[0].id,
                        defaultListingLocation: defaultListingLocation[0]
                    });
                }
            });

            apiBillingAddress
            .getItems({
                default: true
            })
            .then(billingAddresses => {
                const billingAddress = billingAddresses
                    .find(_ => _.default === true) ||
                    billingAddresses[billingAddresses.length - 1];
                
                if (billingAddress) {
                    this.setState({
                        billingAddressId: billingAddress.id,
                        billingAddressReady: true,
                        billingAddress
                    });
                } else {
                    this.setState({
                        billingAddressReady: true
                    });
                }
            });
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

                                        getUserAsync(user => {
                                            try {
                                                user.userProperties
                                                .find(_ => _.propKey === 'phoneNo')
                                                .propValue = phoneNo;
                                            } catch (err) {
                                                return alert('Error: Could not update internal model.')
                                            }
                                        });

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
                    { this.state.user && this.state.user.userType === 1 &&
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>{translate('ACCOUNT_BILLING_ADDRESS_HEADER')}</h2>
                            <p className="text-muted">{translate('ACCOUNT_BILLING_ADDRESS_DESC')}</p>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                                <Address
                                    withTaxNumber={true}
                                    location={this.state.billingAddress || {}}
                                    onLocationChange={billingAddress => {
                                        const toBeUpdated = this.state.toBeUpdated;
                                        
                                        toBeUpdated.billingAddress = true;

                                        this.setState({
                                            billingAddress,
                                            toBeUpdated
                                        });
                                    }}
                                />
                        </div>
                        <div className="col-xs-12">
                            <FlatButton
                                disabled={!this.state.toBeUpdated.billingAddress}
                                primary={true}
                                onTouchTap={
                                    () => {
                                        const billingAddress = this.state.billingAddress;
                                        const billingAddressId = this.state.billingAddressId;

                                        if (!billingAddressId) {
                                            return apiBillingAddress
                                                .createItem(billingAddress)
                                                .then(BillingAddress => {
                                                    const toBeUpdated = this.state.toBeUpdated;

                                                    toBeUpdated.billingAddress = false;

                                                    this.setState({
                                                        toBeUpdated,
                                                        billingAddress
                                                    })
                                                }, err => {
                                                    console.error(err);
                                                });
                                        }
                                      
                                        return apiBillingAddress
                                            .updateItem(billingAddressId, billingAddress)
                                            .then(data => {
                                                const toBeUpdated = this.state.toBeUpdated;

                                                toBeUpdated.billingAddress = false;

                                                this.setState({
                                                    toBeUpdated
                                                });
                                            }, err => {
                                                console.error(err);
                                            });
                                    }
                                }
                                label={translate('UPDATE')}
                            />
                        </div>
                    </div>
                    }
                    { this.state.user && this.state.user.userType === 1 &&
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>{translate('ACCOUNT_DEFAULT_LISTING_LOCATION_HEADER')}</h2>
                            <p className="text-muted">{translate('ACCOUNT_DEFAULT_LISTING_LOCATION_DESC')}</p>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <Address
                                location={this.state.defaultListingLocation || {}}
                                onLocationChange={defaultListingLocation => {
                                    const toBeUpdated = this.state.toBeUpdated;
                                    
                                    toBeUpdated.defaultListingLocation = true;

                                    this.setState({
                                        defaultListingLocationId: defaultListingLocation.id,
                                        defaultListingLocation,
                                        toBeUpdated
                                    });
                                }}
                            />
                        </div>
                        <div className="col-xs-12">
                            <FlatButton
                                disabled={!this.state.toBeUpdated.defaultListingLocation}
                                primary={true}
                                onTouchTap={
                                    () => {
                                        const defaultListingLocationId = this.state.defaultListingLocationId;
                                        const defaultListingLocation = this.state.defaultListingLocation;

                                        if (!defaultListingLocationId) {
                                            return apiTaskLocation
                                                .updateDefaultItem(defaultListingLocation)
                                                .then(_ => {
                                                    const toBeUpdated = this.state.toBeUpdated;

                                                    toBeUpdated.defaultListingLocation = false;

                                                    this.setState({
                                                        toBeUpdated
                                                    })
                                                }, err => {
                                                    console.error(err);
                                                });
                                        }
                                    }
                                }
                                label={translate('UPDATE')}
                            />
                        </div>
                    </div>
                    }

                    <div className="row">
                        <div className="col-xs-12">
                            <h2>{translate('ACCOUNT_NOTIFICATIONS_HEADER')}</h2>
                            <p className="text-muted">{translate('ACCOUNT_NOTIFICATIONS_DESC')}</p>
                        </div>

                        { false && <div className="col-xs-12">
                                <Checkbox
                                    checked={!this.state.data.emailNotifDisabled}
                                    label={translate("EMAIL_NOTIFICATIONS")}
                                    onCheck={() => {
                                        const oldState = this.state;

                                        oldState.data.emailNotifDisabled = !oldState.data.emailNotifDisabled;

                                        this.setState(oldState);

                                        apiUserProperty
                                                .createItem(
                                                    this.state.user.id,
                                                    'emailNotifDisabled',
                                                    oldState.data.emailNotifDisabled
                                                )
                                                .then(_ => _, _ => _);
                                    }}
                                />
                        </div>
                        }
                        { this.state.emails &&
                          this.state.emails.map(emailCode => {
                            const propKey = emailCode;

                            return <div className="col-xs-12">
                                <Checkbox
                                    checked={!this.state.data[propKey]}
                                    label={translate(propKey)}
                                    onCheck={() => {
                                        const data = this.state.data;

                                        data[propKey] = !data[propKey];

                                        this.setState({
                                            data
                                        });

                                        getUserAsync(user => {
                                            let property;

                                            property = user.userProperties
                                            .find(_ => _.propKey === propKey);

                                            if (!property) {
                                                property = {
                                                    propKey: propKey,
                                                    propValue: false
                                                };
                            
                                                user
                                                .userProperties
                                                .push(property);
                                            } else {
                                                property.propValue = data[propKey];
                                            }

                                            apiUserProperty
                                            .createItem(
                                                user.id,
                                                propKey,
                                                data[propKey]
                                            )
                                            .then(_ => _, _ => _);  
                                        });
                                    }}
                                />
                            </div>
                            }
                        )}
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
                                    openConfirmDialog({
                                        headerLabel: translate('DELETE_YOUR_ACCOUNT_HEADER'),
                                        confirmationLabel: translate('DELETE_YOUR_ACCOUNT_DESC')
                                    }, () => {
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