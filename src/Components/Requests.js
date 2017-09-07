import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as apiRequest from '../api/request';
import { displayPrice } from '../core/format';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';

import { getConfigAsync } from '../core/config';

const REQUEST_STATUS = {
    PENDING: '0',
    ACCEPTED: '5',
    MARKED_DONE: '10',
    SETTLED: '15',
    DECLINED: '20',
    CANCELED: '25'
};

export default class Requests extends Component {
  constructor(props) {
      super();

      this.state = {
        view: props.view,
        open: false,
        isLoading: true,
        requests: []
      };
  }
  
  componentDidMount() {
    getConfigAsync(config => {
        const queryObj = {};

        if (this.state.view) {
            queryObj.view = this.state.view;
        }

        apiRequest
            .getItems(queryObj)
            .then(requests => {
                this.setState({
                    config,
                    requests,
                    ready: true,
                    isLoading: false
                });

                this.props.onReady && this.props.onReady();
            });
    });
  }

  settleOrder = () => {
    
  };

  initSettleOrder = () => {
    
  };

  markAsDone = request => {
    const requests = this.state.requests;

    apiRequest
    .updateItem(request.id, {
        status: REQUEST_STATUS.MARKED_DONE
    });

    requests
    .find(_ => _.id === request.id)
    .status = REQUEST_STATUS.MARKED_DONE;

    this.setState({
        requests
    });
  }

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

  shouldAllowCancel = request => {
      return request.status === REQUEST_STATUS.PENDING;
        /**
         request.status != REQUEST_STATUS.CANCELED &&
         request.status != REQUEST_STATUS.MARKED_DONE &&
         request.status != REQUEST_STATUS.SETTLED &&
         request.status != REQUEST_STATUS.ACCEPTED;
        */
  }

  shouldAllowMarkingAsDone = request => {
      return request.status === REQUEST_STATUS.ACCEPTED;
  }

  render() {
    return (
        <div className="container">
            { this.state.ready &&
                <div className="row">
                    <div className="col-xs-12">
                    { this.props.showTitle &&
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                            {translate('YOUR_REQUESTS')}
                        </h1>
                    }
                    { !this.state.isLoading && !this.state.requests.length &&
                        <div className="col-xs-12">
                            <div className="row">
                                <p className="text-muted">{translate("NO_REQUESTS")}</p>
                            </div>
                        </div>
                    }
                    { !this.state.isLoading && this.state.requests
                        .map(request =>
                        <div
                            className="col-xs-12"
                            style={{ marginTop: 10 }}
                        >
                            <Paper style={{ padding: 10 }}>
                            <h3>
                                <a  href="#"
                                    className="vq-link"
                                    onTouchTap={() => goTo(`/task/${request.task.id}`)}
                                >
                                    {request.task.title}
                                </a>
                            </h3>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 text-left"> 
                                    <h3>
                                        {displayPrice(request.task.price, request.task.currency, request.task.priceType)}
                                    </h3>
                                    <p className="text-muted">
                                        { String(request.status) === REQUEST_STATUS.PENDING &&
                                            translate("PENDING")
                                        }
                                        { String(request.status) === REQUEST_STATUS.ACCEPTED &&
                                            translate("ACCEPTED")
                                        }
                                        { String(request.status) === REQUEST_STATUS.MARKED_DONE &&
                                            translate("MARKED_DONE")
                                        }
                                        { String(request.status) === REQUEST_STATUS.SETTLED &&
                                            translate("SETTLED")
                                        }
                                        { String(request.status) === REQUEST_STATUS.DECLINED &&
                                            translate("DECLINED")
                                        }
                                        { String(request.status) === REQUEST_STATUS.CANCELED &&
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
                                        <IconButton
                                            style={{ top: 10 }}
                                            tooltip={
                                                request.with.userProperties
                                                .find(_ => _.propKey === 'phoneNo')
                                                .propValue
                                            }>
                                            <IconCall />
                                        </IconButton>
                                    }
                                    { String(request.status) !== REQUEST_STATUS.SETTLED && String(request.status) !== REQUEST_STATUS.CANCELED &&
                                        <IconButton
                                            style={{ top: 10 }}
                                            tooltip={'Chat'}
                                            onClick={() => goTo(`/chat/${request.id}`)}
                                        >
                                            <IconChatBubble />
                                        </IconButton>
                                    }
                                   { this.shouldAllowCancel(request) &&
                                        <RaisedButton
                                            label={translate('CANCEL')}
                                            primary={true}
                                            onTouchTap={() => this.cancelRequest(request)}
                                        />
                                    }
                                    { this.shouldAllowMarkingAsDone(request) &&
                                        <RaisedButton
                                            label={translate('MARK_DONE')}
                                            primary={true}
                                            onTouchTap={() => this.markAsDone(request)}
                                        />
                                    }

                                    {!request.review &&
                                        request.status === REQUEST_STATUS.SETTLED &&
                                        <div style={{
                                            display: 'inline-block',
                                            padding: 10
                                        }}>
                                            <RaisedButton
                                                labelStyle={{color: 'white '}}
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                label={translate('LEAVE_REVIEW')}
                                                onTouchTap={() => {
                                                    goTo(`/request/${request.id}/review`);
                                                }}
                                            />
                                        </div>
                                        }
                                </div>
                            </div>
                            </Paper>
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
