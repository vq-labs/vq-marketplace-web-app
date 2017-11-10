import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { getUserAsync } from '../core/auth';
import ConfigEdit from '../Components/ConfigEdit';

const basicFields = [
    {
        disabled: true,
        type: 'string',
        key: 'STRIPE_PUBLIC_KEY',
        label: 'Stripe public key',
    },
    {
        disabled: true,
        type: 'string',
        key: 'STRIPE_SECRET_KEY',
        label: 'Stripe private key',
        explanation: ''
    }
];

export default class SectionPayments extends React.Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            user: null
        };
    }
    componentDidMount() {
        getUserAsync(user => {
            this.setState({user });
        });
    }

    render() {
            return (
                <div className="row">
                    <h1>Payment system</h1>

                    <h2>Connect Stripe</h2>
                    <p>
                        You can get your API keys by creating an account <a href="https://dashboard.stripe.com/register" target="href">here</a>.
                    </p>
                
                    <ConfigEdit
                        fields={basicFields}
                    />

                    <hr />

                    <h2>Connect Mangopay</h2>
                    <RaisedButton
                        style={{ marginLeft: 30 }}
                        primary={true}
                        onClick={() => {
                            alert("This feature has been disabled for your account.");
                        }}
                        label="Connect Mangopay"
                    />

                    <hr />

                    <h2>Connect Barion</h2>
                    <RaisedButton
                        style={{ marginLeft: 30 }}
                        primary={true}
                        onClick={() => {
                            alert("Contact support for connecting Barion. We are currently evaluating the possibility with this provider.");
                        }}
                        label="Connect Barion"
                    />
                </div>
            );
    }
};
