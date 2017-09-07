import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../core/i18n';

var pendingCb;
var onOpen;

export const openConfirmDialog = (data, cb) => {
    onOpen(data);

    pendingCb = cb;
};

export const Component = class ConfirmDialog extends React.Component {
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
                confirmationLabel: data.confirmationLabel,
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
                            actions={[
                                <FlatButton
                                    label={this.state.cancelLabel || translate('CANCEL')}
                                    primary={true}
                                    onTouchTap={() => {
                                        this.setState({
                                            isOpen: false
                                        });

                                        pendingCb = null;
                                    }}
                                />,
                                <FlatButton
                                    label={this.state.confirmLabel || translate('CONFIRM')}
                                    primary={true}
                                    onTouchTap={() => {
                                        pendingCb && pendingCb();

                                        pendingCb = null;

                                        this.setState({
                                            isOpen: false
                                        });
                                    }}
                                />,
                            ]}
                            modal={false}
                            open={this.state.isOpen}
                            >
                                <h1>{this.state.headerLabel}</h1>
                                {this.state.confirmationLabel || translate('ARE_YOUR_SURE')}
                            </Dialog>
                     </div>
            );
    }
};
