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
                        <h1>Setting a transaction fee (commission)</h1>
                        <hr />
                        <ConfigEdit
                            fields={[
                                {
                                    type: 'bool',
                                    key: 'PAYMENTS_ENABLED',
                                    label: 'Payments enabled',
                                    explanation: "You don't want or can't use the online payment system? You can simply disable it and post free listings in your marketplace. You can change your fee at any time."
                                }, {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    regex: '^([0-9]|[0-9][0-9])$',
                                    key: 'MARKETPLACE_PROVISION',
                                    label: 'Marketplace provision',
                                    explanation: "As a marketplace administrator, you can choose to charge a transaction fee from each paid transaction in your marketplace. You can change your fee at any time. However, if you do so, it is a very good idea to notify your users to not create any unexpected surprises for them." 
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
