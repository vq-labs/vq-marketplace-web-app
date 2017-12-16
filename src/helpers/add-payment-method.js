import React from 'react';
import Dialog from 'material-ui/Dialog';
import StripeCheckout from '../Components/PaymentConnectors/StripeCheckout';
import { translate } from '../core/i18n';
import * as apiPayment from '../api/payment';
import { displayErrorFactory } from '../core/error-handler';

let finallyCb;
let pendingCb;
let onOpen;

export const openDialog = (data, cb, fCb) => {
    onOpen(data);

    finallyCb = fCb;
    pendingCb = cb;
};

export const Component = class AddPaymentMethod extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isOpen: false,
        };
    }

    componentDidMount() {
        onOpen = data => {
            this.setState({
                headerLabel: data.headerLabel,
                descLabel: data.descLabel,
                okLabel: data.okLabel,
                cancelLabel: data.cancelLabel,
                isOpen: true
            });
        }
    }

    render() {
            return (
                <div>
                    <Dialog
                        actionsContainerClassName="hidden"
                        modal={false}
                        open={this.state.isOpen}
                    >
                        <StripeCheckout
                            onSubmit={cardToken => {
                                console.log(cardToken);

                                apiPayment
                                .createItem("stripe", "card", {
                                    obj: cardToken
                                })
                                .then(() => {
                                    this.setState({
                                        isOpen: false
                                    });

                                    pendingCb && pendingCb();
                                    finallyCb && finallyCb();
    
                                    finallyCb = null;
                                    pendingCb = null;
                                })
                                .catch(displayErrorFactory);
                            }}
                            onCancel={() => {
                                this.setState({
                                    isOpen: false
                                });

                                finallyCb && finallyCb();
                                
                                finallyCb = null;
                                pendingCb = null;
                            }}
                        />
                    </Dialog>
                    </div>
            );
    }
};
