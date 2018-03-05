/* eslint-disable no-console, react/no-multi-comp */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { CONFIG } from '../../core/config';

import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  PaymentRequestButtonElement,
  StripeProvider,
  Elements,
  injectStripe,
} from 'react-stripe-elements';

const handleBlur = () => {
  console.log('[blur]');
};

const handleChange = change => {
  console.log('[change]', change);
};

const handleClick = () => {
  console.log('[click]');
};

const handleFocus = () => {
  console.log('[focus]');
};

const handleReady = () => {
  console.log('[ready]');
};

const createOptions = (fontSize) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class _SplitForm extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault();

    this.props.stripe
        .createToken()
        .then(payload => {
            if (payload.error) {
                return alert(payload.error.message);
            }

            this.props.onSubmit(payload.token);
        });
  };

  render() {
    return (
      <form className="vq-payment-form" onSubmit={this.handleSubmit}>
        <div className="row">
          Card number
          <CardNumberElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </div>
        <div className="row">
          Expiration date
          <CardExpiryElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </div>
        <div className="row">
          CVC
          <CardCVCElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </div>
        <div className="row">
          Postal code
          <PostalCodeElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </div>
        <div className="row">
            <RaisedButton
                type="submit"
                primary={true}
                label={"Confirm"}
            />

            <FlatButton
                style={{ marginLeft: 15 }}
                onTouchTap={() => {
                  this.props.onCancel && this.props.onCancel();
                }}
                primary={true}
                label={"Cancel"} 
            />
        </div>
      </form>
    );
  }
}
const SplitForm = injectStripe(_SplitForm);

class _PaymentRequestForm extends React.Component {
  constructor(props) {
    super(props);

    const paymentRequest = props.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
    });

    paymentRequest.on('token', ({complete, token, ...data}) => {
      console.log('Received Stripe token: ', token);
      console.log('Received customer information: ', data);
      complete('success');
    });

    paymentRequest.canMakePayment().then(result => {
      this.setState({canMakePayment: !!result});
    });

    this.state = {
      canMakePayment: false,
      paymentRequest,
    };
  }

  render() {
    return this.state.canMakePayment ? (
      <PaymentRequestButtonElement
        className="PaymentRequestButton"
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleFocus}
        onReady={handleReady}
        paymentRequest={this.state.paymentRequest}
        style={{
          paymentRequestButton: {
            theme: 'dark',
            height: '64px',
            type: 'donate',
          },
        }}
      />
    ) : null;
  }
}

class Checkout extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
    };
    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

  render() {
    const {elementFontSize} = this.state;
    return (
      <div className="vq-checkout stripe-checkout">
        <Elements>
          <SplitForm
            onSubmit={this.props.onSubmit}
            onCancel={this.props.onCancel}
            fontSize={elementFontSize} />
        </Elements>
      </div>
    );
  }
}

const StripeCheckout = (props) => {
  return (
    <StripeProvider apiKey={CONFIG.STRIPE_PUBLIC_KEY}>
      <Checkout
        onSubmit={props.onSubmit}
        onCancel={props.onCancel}
      />
    </StripeProvider>
  );
};

export default StripeCheckout;
