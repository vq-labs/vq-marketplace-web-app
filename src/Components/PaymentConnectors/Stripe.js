import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from "../Loader";
import * as apiPayment from '../../api/payment';
import { displayErrorFactory } from '../../core/error-handler';

export default class StripePaymentConnector extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            paymentAccount: null
        };
    }

    componentDidMount() {
        apiPayment[this.props.isMarketplaceOwner ? "getAccount" : "getUserAccount"]("stripe")
        .then(rAccount => {
            console.log(rAccount);

            return this.setState({
                isLoading: false,
                paymentAccount: rAccount
            });
        })
        .catch(displayErrorFactory({
            self: this,
            ignoreCodes: [ "NOT_FOUND" ]
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
                                    disabled={this.state.isLoading}
                                    style={{ marginLeft: 30 }}
                                    primary={true}
                                    onClick={() => {
                                        apiPayment[this.props.isMarketplaceOwner ? "createAccount" : "createUserAccount"]("stripe")
                                        .then(paymentAccount => {
                                            this.setState({
                                                paymentAccount
                                            });

                                            return alert("Account has been created. Check your email.");
                                        })
                                        .catch(err => displayErrorFactory({
                                            ignoreCodes: [ "NOT_FOUND" ]
                                        }));
                                    }}
                                    label="Connect Stripe"
                                />
                            }
                            { !this.state.paymentAccount &&
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
