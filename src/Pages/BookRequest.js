import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import DOMPurify from 'dompurify'
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
import TaskCategories from '../Partials/TaskCategories';
import * as coreAuth from '../core/auth';
import * as apiRequest from '../api/request';
import apiOrder from '../api/order';
import apiBillingAddress from '../api/billing-address';
import { appConfig } from '../api/config';
import apiUser from '../api/user';
import { translate } from '../core/i18n';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Address from '../Components/Address';
import { goTo } from '../core/navigation';
import * as coreFormat from '../core/format';

import '../App.css';

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
      let requestId = this.props.params.requestId;

      apiBillingAddress
      .getItems()
      .then(billingAddresses => {
            const billingAddress = billingAddresses[0] || {};

            this.setState({
                billingAddressReady: true,
                isLoading: false,
                billingAddress
            });
        });

      apiRequest
      .getItem(requestId)
      .then(requestDetails => {
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
        });
    }
    render() {
        return (
            <div className="container">
                { this.state.isLoading && 
                    <div className="text-center" style={{ 'marginTop': '40px' }}>
                        <CircularProgress size={80} thickness={5} />
                    </div>
                }
                { !this.state.isLoading && this.state.requestReady &&
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>{translate('CONFIRM_BOOKING_HEADER')}</h1>
                            <p>{translate('CONFIRM_BOOKING_DESC')}</p>
                        </div>
                        <div className="col-xs-12 col-sm-6 pull-right">
                            <div className="col-xs-12">
                                <h3>{this.state.requestDetails.task.title}</h3>
                                <hr />
                                <strong>{coreFormat.displayPrice(this.state.requestDetails.task.price, this.state.requestDetails.task.currency)}</strong>
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
                                location={this.state.billingAddress}
                                onLocationChange={billingAddress => {
                                    this.setState({
                                        billingAddress
                                    });
                                }}
                            />
                        </div>    

                        <div className="col-xs-12" style={{ marginTop: 50       }}>
                            <RaisedButton
                                backgroundColor={"#546e7a"}
                                labelColor={"white"}
                                label={translate("CONFIRM_BOOKING")} 
                                onClick={() => {
                                    const billingAddress = this.state.billingAddress;
                                    const order = this.state.order;

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