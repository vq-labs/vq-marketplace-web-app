import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../core/i18n';

var onOpen;
var cb;

export const openDialog = (data, lCb) => {
    onOpen(data);

    cb = lCb;
};

export const Component = class MessageDialog extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isOpen: false
        };
    }
    componentDidMount() {
        onOpen = data => {
            this.setState({
                header: data.header,
                desc: data.desc,
                okLabel: data.okLabel,
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
                                    label={this.state.okLabel || translate('OK')}
                                    primary={true}
                                    onTouchTap={() => {
                                        this.setState({
                                            isOpen: false
                                        });

                                        if (cb) {
                                            cb();

                                            cb = undefined;
                                        }
                                    }}
                                />
                            ]}
                            modal={false}
                            open={this.state.isOpen}
                            >
                                <div className="col-xs-12">
                                    <h1>{this.state.header}</h1>
                                    {this.state.desc}
                                </div>
                            </Dialog>
                     </div>
            );
    }
};
