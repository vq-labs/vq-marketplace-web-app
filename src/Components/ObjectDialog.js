import React from 'react';
import FlatButton from 'material-ui/FlatButton';

export default <Dialog
    autoScrollBodyContent={true}
    actions={[
        <FlatButton
            label={'OK'}
            primary={true}
            onTouchTap={() => this.setState({
                showDetails: false,
                selectedRequest: null
            })}
        />
    ]}
    modal={false}
    open={this.state.showDetails}
    >
        <div className="container">
            { displayObject(this.state.selectedRequest || {})}
        </div>
</Dialog>;