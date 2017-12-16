import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import * as apiRequest from '../api/request';
import apiOrder from '../api/order';
import apiBillingAddress from '../api/billing-address';
import { translate } from '../core/i18n';
import Address from '../Components/Address';
import { goTo, goBack } from '../core/navigation';
import * as coreFormat from '../core/format';
import Loader from "../Components/Loader";
import { CONFIG } from '../core/config';
import { openDialog } from '../helpers/open-message-dialog.js';
import { openDialog as openAddPaymentMethodDialog } from '../helpers/add-payment-method.js';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import { Component as AddPaymentMethodDialog } from '../helpers/add-payment-method';
import '../App.css';
import {
    Step,
    Stepper,
    StepLabel,
  } from 'material-ui/Stepper';
import { displayErrorFactory } from '../core/error-handler';

class BookRequest extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            requestDetails: {},
            requestReady: false,
            billingAddressReady: false,
            billingAddress: null,
            order: {},
            isLoading: true
        };

        this.confirmBooking = this.confirmBooking.bind(this);
    }

    componentDidMount() {
        let requestId = this.props.params.requestId;
        
        this.setState({
            ready: true
        });

        apiRequest
        .getItem(requestId)
        .then(requestDetails => {
            const request = requestDetails.request;

            if (request.status !== REQUEST_STATUS.PENDING) {
                return goTo(`/chat/${request.id}`);
            }

            const order = this.state.order;

            order.amount = requestDetails.task.price;
            order.currency = requestDetails.task.currency;
            order.taskId = requestDetails.task.id;
            order.requestId = requestDetails.request.id;

            this.setState({
                order,
                requestReady: true,
                isLoading: false,
                requestDetails
            });

            apiBillingAddress
            .getItems({
                default: true
            })
            .then(billingAddresses => {
                const billingAddress = billingAddresses[0] || {};
    
                this.setState({
                    billingAddressReady: true,
                    billingAddress
                });
            });
        });
    }

    continueToPayments() {
        
    }

    confirmBooking() {
        this.setState({
            isSubmitted: true
        });

        const billingAddress = this.state.billingAddress;
        const order = this.state.order;
        
        const REQUIRED_FIELDS = {
            countryCode: "LOCATION_COUNTRY_CODE",
            street: "LOCATION_STREET",
            // streetNumber: "LOCATION_STREET_NO",
            city: "LOCATION_CITY",
            postalCode: "LOCATION_POSTAL_CODE"
        };

        let isInvalid = false;
        
        Object
            .keys(REQUIRED_FIELDS)
            .forEach(fieldKey => {
                if (isInvalid) {
                    this.setState({
                        isSubmitted: false
                    });

                    return;
                }

                if (!billingAddress[fieldKey]) {
                    isInvalid = true;

                    this.setState({
                        isSubmitted: false
                    });

                    return alert(
                        translate(`${REQUIRED_FIELDS[fieldKey]}`) + ' ' + translate('IS_REQUIRED')
                    );
                }
            });

        if (isInvalid) {
            return;
        }

        const createOrder = order => {
            apiOrder
                .createItem(order)
                .then(rOrder => {
                    return openDialog({
                        header: translate('BOOKING_SUCCESS_HEADER'),
                        desc: translate('BOOKING_SUCCESS_DESC')
                    }, () => {
                        goTo(`/chat/${rOrder.requestId}`);
                    });
                }, displayErrorFactory({
                    // possible error codes: NO_SUPPLY_PAYMENT_ACCOUNT
                    self: this,
                    finallyCb: () => {
                        this.setState({
                            isSubmitted: false
                        });
                    }
                }));
        };

        if (!billingAddress.id) {
            // commit billing address
            return apiBillingAddress
                .createItem(billingAddress)
                .then(rBillingAddress => {
                    billingAddress.id = rBillingAddress.id;
                    order.billingAddressId = rBillingAddress.id;

                    return createOrder(order);
                });
        }
        
        // commit booking order
        order.billingAddressId = billingAddress.id;

        return createOrder(order);
    }

    render() {
        return (
            <div className="container">
                

                { this.state.ready &&
                <div className="row">
                    <div className="col-xs-12">
                        <Stepper activeStep={0}>
                            <Step>
                                <StepLabel>Billing address</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Payment method</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Confirmation</StepLabel>
                            </Step>
                        </Stepper>

                        <p>{translate('CONFIRM_BOOKING_DESC')}</p>
                    </div>
                </div>
                }

                { this.state.isLoading && 
                    <Loader
                        isLoading={true}
                    />
                }
                { !this.state.isLoading && this.state.requestReady &&
                    <div className="row">
                        {this.state.requestDetails.task.taskLocations.length &&
                            <div className="col-xs-12" style={{
                                marginTop: 10,
                                marginBottom: 10
                            }}>
                                <strong>
                                    <a
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        onTouchTap={() => {
                                            const billingAddress = this.state.requestDetails.task.taskLocations[0];

                                            delete billingAddress.id;

                                            this.setState({
                                                billingAddress
                                            });
                                        }}
                                    >
                                        {translate('BILLING_ADDRESS_USE_LISTING_LOCATION')}
                                    </a>
                                </strong>
                            </div>
                        }

                        <div className="col-xs-12 col-sm-6 pull-right">
                            <div className="col-xs-12">
                                <h3>{this.state.requestDetails.task.title}</h3>
                                <hr />
                                {CONFIG.LISTING_TIMING_MODE === "1" &&
                                    <div>
                                        <strong>
                                            {
                                                this.state.requestDetails.task.price * this.state.requestDetails.task.taskTimings[0].duration
                                            } {this.state.requestDetails.task.currency}
                                        </strong>
                                        <br />
                                        <p>
                                            {coreFormat.displayPrice(this.state.requestDetails.task.price, this.state.requestDetails.task.currency, this.state.requestDetails.task.priceType)}, {this.state.requestDetails.task.taskTimings[0].duration}h
                                        </p>
                                    </div>
                                 }
                            </div>
                            <div className="col-xs-12">
                                <p className="text-muted">Application by:</p>
                                <strong>{this.state.requestDetails.users[this.state.requestDetails.request.fromUserId].firstName} {this.state.requestDetails.users[this.state.requestDetails.request.fromUserId].lastName}</strong>
                                <hr />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <h3>{translate('BILLING_ADDRESS')}</h3>
                            <Address
                                deriveOnly={true}
                                withTaxNumber={true}
                                location={this.state.billingAddress}
                                onLocationChange={billingAddress => {
                                    this.setState({
                                        billingAddress
                                    });
                                }}
                            />

                            <div className="row">
                            <div className="col-xs-12" style={{
                                marginTop: 50
                            }}>

                            { CONFIG &&
                                <FlatButton
                                    style={{ float: 'left' }}
                                    label={translate('BACK')}
                                    primary={true}
                                    disabled={false}
                                    onTouchTap={() => goBack()}
                                />
                            }
                            {
                                this.state.billingAddress &&
                                <RaisedButton
                                    style={{float: 'right'}}
                                    disabled={this.state.isSubmitted || String(this.state.billingAddress.postalCode) < 4}
                                    primary={true}
                                    label={translate("CONFIRM_BOOKING")} 
                                    onClick={() => {
                                        openAddPaymentMethodDialog({}, () => {
                                            this.confirmBooking();
                                        });
                                    }}
                                />
                            }
                        </div>
                        </div>
                        </div>
                    </div>
                }
            <AddPaymentMethodDialog />
            </div>
        );
    }
}

export default BookRequest;