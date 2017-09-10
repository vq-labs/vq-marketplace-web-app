import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as apiRequest from '../api/request';
import apiOrder from '../api/order';
import apiBillingAddress from '../api/billing-address';
import { translate } from '../core/i18n';
import Address from '../Components/Address';
import { goTo } from '../core/navigation';
import * as coreFormat from '../core/format';
import Loader from "../Components/Loader";
import { getConfigAsync } from '../core/config';

import '../App.css';

const REQUEST_STATUS = {
    PENDING: '0',
    ACCEPTED: '5',
    MARKED_DONE: '10',
    SETTLED: '15',
    DECLINED: '20',
    CANCELED: '25'
};

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
    }

    componentDidMount() {
        getConfigAsync(config => {
            let requestId = this.props.params.requestId;
            
            this.setState({
                ready: true,
                config
            });

            apiRequest
            .getItem(requestId)
            .then(requestDetails => {
                const request = requestDetails.request;

                if (request.status !== REQUEST_STATUS.PENDING) {
                    // booked is just hotfix - it requires different solution
                    return goTo(`/order/booked`);
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
                .getItems()
                .then(billingAddresses => {
                    const billingAddress = billingAddresses[0] || {};
        
                    this.setState({
                        billingAddressReady: true,
                        billingAddress
                    });
                });
            });
        });
    }

    render() {
        return (
            <div className="container">
                { this.state.ready && 
                <div className="row">
                    <div className="col-xs-12">
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                            {translate('CONFIRM_BOOKING_HEADER')}
                        </h1>
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
                                            this.setState({
                                                billingAddress: this.state.requestDetails.task.taskLocations[0]
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
                                <strong>{coreFormat.displayPrice(this.state.requestDetails.task.price, this.state.requestDetails.task.currency, this.state.requestDetails.task.priceType)}</strong>
                            </div>
                            <div className="col-xs-12">
                                <p className="text-muted">Application by:</p>
                                <h3>{this.state.requestDetails.users[this.state.requestDetails.request.fromUserId].firstName} {this.state.requestDetails.users[this.state.requestDetails.request.fromUserId].lastName}</h3>
                                <hr />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <h3>{translate('BILLING_ADDRESS')}</h3>
                            <Address
                                withTaxNumber={true}
                                location={this.state.billingAddress}
                                onLocationChange={billingAddress => {
                                    this.setState({
                                        billingAddress
                                    });
                                }}
                            />
                        </div>

                        <div className="col-xs-12" style={{ marginTop: 50 }}>
                            <RaisedButton
                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                labelColor={"white"}
                                label={translate("CONFIRM_BOOKING")} 
                                onClick={() => {
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
                                                return;
                                            }

                                            if (!billingAddress[fieldKey]) {
                                                isInvalid = true;

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
                                                goTo(`/order/${rOrder.id}`);
                                            });
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
                                }}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default BookRequest;