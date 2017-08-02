import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import * as apiRequest from '../api/request';
import * as coreAuth from '../core/auth';
import * as coreFormat from '../core/format';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const REQUEST_STATUS = {
    PENDING: 0,
    ACCEPTED: 5,
    MARKED_DONE: 10,
    SETTLED: 15,
    DECLINED: 20,
    CANCELED: 25
};

export default class Bookings extends Component {
  constructor() {
      super();

      this.state = {
        open: false,
        isLoading: true,
        requests: []
      };

  }
  
  settleOrder = () => {
    
  };

  initSettleOrder = () => {
    
  };

  cancelRequest = request => {
    const requests = this.state.requests;
    
    apiRequest.updateItem(request.id, {
        status: REQUEST_STATUS.CANCELED
    });

    requests
        .find(_ => _.id === request.id)
        .status = REQUEST_STATUS.CANCELED;

    this.setState({
        requests
    });
  };

  handleClose = () => {
    this.setState({
        selectedOrderId: null,
        open: false
    });
  };

  shouldShowPhoneNumber = request => {
    return request.status === REQUEST_STATUS.ACCEPTED ||
    request.status === REQUEST_STATUS.MARKED_DONE;
  }

  componentDidMount() {
    apiRequest
        .getItems()
        .then(requests => {
            this.setState({
                requests,
                isLoading: false
            });

            this.props.onReady && this.props.onReady();
        });
  }

  render() {
    return (
        <div className="container">
            { !this.state.requests.lenght &&
                <div className="row">
                    <div className="col-xs-12">
                    <h1>{translate('YOUR_REQUESTS')}</h1>
                    { !this.state.isLoading && this.state.requests
                        .map(request =>
                        <div className="col-xs-12">
                            <h3>{request.task.title}</h3>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 text-left"> 
                                     <h3>
                                        {coreFormat.displayPrice(request.task.price, request.task.currency)}
                                    </h3>
                                    <p className="text-muted">
                                        { request.status == REQUEST_STATUS.PENDING &&
                                            translate("PENDING")
                                        }
                                        { request.status == REQUEST_STATUS.ACCEPTED &&
                                            translate("ACCEPTED")
                                        }
                                        { request.status == REQUEST_STATUS.MARKED_DONE &&
                                            translate("MARKED_DONE")
                                        }
                                        { request.status == REQUEST_STATUS.SETTLED &&
                                            translate("SETTLED")
                                        }
                                        { request.status == REQUEST_STATUS.DECLINED &&
                                            translate("DECLINED")
                                        }
                                        { request.status == REQUEST_STATUS.CANCELED &&
                                            translate("CANCELED")
                                        }
                                    </p>
                                </div>
                                <div className="col-xs-12 col-sm-6 text-right">
                                    <IconButton
                                        onClick={() => goTo(`/profile/${request.with.id}`)}
                                        tooltip={
                                            `${request.with.firstName} ${request.with.lastName}`
                                        }
                                    >
                                        <Avatar src={request.with.imageUrl || '/images/avatar.png'} />
                                    </IconButton>
                                    { this.shouldShowPhoneNumber(request) &&
                                        <IconButton tooltip={
                                                request.with.userProperties
                                                .find(_ => _.propKey === 'phoneNo')
                                                .propValue
                                            }>
                                            <IconCall />
                                        </IconButton>
                                    }
                                    <IconButton 
                                        tooltip={'Chat'}
                                        onClick={() => goTo(`/chat/${request.id}`)}
                                    >
                                        <IconChatBubble />
                                    </IconButton>
                                   { request.status != REQUEST_STATUS.CANCELED &&
                                        <RaisedButton
                                            label={translate('CANCEL')}
                                            primary={true}
                                            onTouchTap={() => this.cancelRequest(request)}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            }
        
    <div>
        <Dialog
          actions={[
            <FlatButton
                label={translate('CANCEL')}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label={translate('CONFIRM')}
                primary={true}
                onTouchTap={this.settleOrder}
            />,
          ]}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {translate('SETTLE_ORDER')}
        </Dialog>
      </div>


        </div>
      );
   }
};
