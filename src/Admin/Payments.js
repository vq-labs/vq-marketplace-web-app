import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { getUserAsync } from '../core/auth';
import * as apiPayment from '../api/payment';
import { displayErrorFactory } from '../core/error-handler';
import StripePaymentConnector from '../Components/PaymentConnectors/Stripe';
import ConfigEdit from './Components/ConfigEdit';

export default class SectionPayments extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            paymentAccount: null,
            activeStep: 0,
            user: null
        };
    }
    componentDidMount() {
        getUserAsync(user => {
            this.setState({
                user
            });
        });
    }

    render() {
            return (
                <div className="row">
                    <div style={{ marginBottom: 15 }}>
                        <h1>Marketplace fees</h1>
                        <hr />
                        <ConfigEdit
                            fields={[
                                {
                                    type: 'bool',
                                    key: 'PAYMENTS_ENABLED',
                                    label: 'Payments enabled',
                                    explanation: 'Allow your users to connect to Stripe and receive payouts.'
                                },
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    regex: '^([1-9]|[0-9][0-9])$',
                                    key: 'MARKETPLACE_PROVISION',
                                    label: 'Marketplace provision',
                                    explanation: 'How many percent provision should your marketplace receive from every transaction?'
                                }
                            ]}
                        />
                    </div>
                    <div style={{ marginTop: 15 }}>
                        <h1>Payment systems</h1>
                        <hr />

                        <h3>Connect Stripe</h3>
                        <StripePaymentConnector isMarketplaceOwner={true}/>
                    </div>
                </div>
            );
    }
};
