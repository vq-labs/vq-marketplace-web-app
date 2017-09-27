import React from 'react';
import Snackbar from 'material-ui/Snackbar';

var pendingCb;
var onOpen;

export const displayMessage = (data, cb) => {
    onOpen(data);

    pendingCb = cb;
};

export const Component = class MessageSnackbar extends React.Component {
    constructor(props) {
        super();

        this.state = {
            isOpen: false
        };
    }
    componentDidMount() {
        onOpen = data => {
            if (!this.state.isOpen) {
                this.setState({
                    label: data.label,
                    isOpen: true
                });
            }
        }
    }
    render() {
            return (
                    <div>
                         <Snackbar
                            open={this.state.isOpen}
                            message={this.state.label}
                            autoHideDuration={3000}
                            onRequestClose={() => {
                                this.setState({
                                    isOpen: false,
                                    label: null
                                });
                            }}
                        />
                     </div>
            );
    }
};
