import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from "../Loader";
import * as apiPayment from '../../api/payment';
import { displayErrorFactory } from '../../core/error-handler';
import { openConfirmDialog } from '../../helpers/confirm-before-action.js';
import { openDialog as openMessageDialog } from '../../helpers/open-message-dialog.js';

export default class StripePaymentConnector extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            isSubmitted: false,
            paymentAccount: null
        };
    }
    
    componentDidMount() {
        apiPayment[this.props.isMarketplaceOwner ? "getAccount" : "getUserAccount"]("stripe")
        .then(rAccount => {
            return this.setState({
                isLoading: false,
                paymentAccount: rAccount
            });
        },
        displayErrorFactory({
            self: this,
            ignoreCodes: [ "STRIPE_NOT_CONNECTED" ]
        }));
    }

    render() {
            return (
                <div>
                    { this.state.isLoading &&
                        <Loader isLoading={true} />
                    }
                    { !this.state.isLoading &&
                        <div>
                            {
                                !this.state.paymentAccount &&
                                <RaisedButton
                                    disabled={this.state.isSubmitted}
                                    style={{ marginLeft: 30 }}
                                    primary={true}
                                    onClick={() => {
                                        this.setState({
                                            isSubmitted: true
                                        });

                                        apiPayment[this.props.isMarketplaceOwner ? "createAccount" : "createUserAccount"]("stripe")
                                        .then(paymentAccount => {
                                            this.setState({
                                                paymentAccount
                                            });

                                            return alert("Account has been created. Check your email.");
                                        })
                                        .catch(displayErrorFactory({
                                            ignoreCodes: [ "NOT_FOUND" ],
                                            onError: {
                                                "STRIPE_ERROR": (err) => {
                                                    openConfirmDialog({
                                                        headerLabel: "It seeems you already have an account on Stripe.",
                                                        confirmationLabel: "By confirming, you will be redirected to Stripe to connect your account to VQ Marketplace."
                                                    }, () => {
                                                        // clicked on OK
                                                        window.open(err.redirectUrl, "_blank");

                                                        openMessageDialog({
                                                            header: "Connecting to Stripe...",
                                                            desc: "It will automatically refresh once your are successfully connected!"
                                                        });
                                                    }, () => {
                                                        this.setState({
                                                            isSubmitted: false
                                                        });
                                                    })
                                                }
                                            }
                                        }));
                                    }}
                                    label="Connect Stripe"
                                />
                            }
                            {
                               !this.state.paymentAccount  
                               &&
                                <div style={{ marginTop: 15 }}>
                                    <p>
                                        Before connecting to Stripe review the supported countries <a href="https://stripe.com/global" target="_blank">here</a>.
                                    </p>
                                </div>
                            }

                            {
                                this.state.paymentAccount &&
                                <div>
                                    <p>
                                        Stripe account has been connected. Your accountID: {this.state.paymentAccount.accountId || this.state.paymentAccount.id}
                                    </p>
                                </div>
                            }
                        </div>
                    }
                </div>
            );
    }
};
