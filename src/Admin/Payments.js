import React from 'react';
import { getUserAsync } from '../core/auth';
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
                                    explanation: "You don't want or can't use the online payment system? You can simply disable it and let your users post free listings in your marketplace."
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
                        <p>
                            Marketplaces and platforms use Stripe Connect to accept money and pay out to third parties. Connect provides a complete set of building blocks to support virtually any business model, including Sharing Economy businesses, e‑commerce, crowdfunding, fintech, and travel and events.<br />

                            Read more about it <a href="https://stripe.com/connect" target="_self">here</a>. You will find a more technical documentation <a href="https://stripe.com/docs/connect">here</a>.
                        </p>

                        <p>
                            After launching your Stripe Connect Account, you will have to configure the Redirect URL in the settings:
                            <br />
                            <code>
                                https://vqmarketplace.vqmarketplace.com/cb/stripe
                            </code>
                        </p>

                        <ConfigEdit
                            fields={[
                                {
                                    type: 'string',
                                    key: 'STRIPE_CLIENT_ID',
                                    label: 'Stripe Client ID',
                                    explanation: "Get it under Stripe Connect -> Settings -> Production -> client_id"
                                }
                            ]}
                        />
                    </div>
                </div>
            );
    }
};
// <StripePaymentConnector isMarketplaceOwner={true}/>