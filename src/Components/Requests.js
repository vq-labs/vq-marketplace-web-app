import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Loader from "../Components/Loader";
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import ListingHeader from '../Components/ListingHeader';
import Moment from 'react-moment';
import * as apiRequest from '../api/request';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import { openDialog as openMessageDialog } from '../helpers/open-message-dialog.js';
import { CONFIG } from '../core/config';
import { getUserAsync } from '../core/auth';
import { getUtcUnixTimeNow } from '../core/util';
import getUserProperty from '../helpers/get-user-property';
import { factory as errorFactory } from '../core/error-handler';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';

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
    getUserAsync(user => {
        const queryObj = {};
        
        console.log('queryobj')
        if (this.state.view) {
            queryObj.view = this.state.view;

            if (this.props.showOutgoing) {
                queryObj.fromUserId = user.id;
            }
        console.log('queryobj')
        }

        console.log('apireq')

        apiRequest
            .getItems(queryObj)
            .then(requests => {
              console.log('requests', requests)
                this.setState({
                    requests,
                    isLoading: false
                });

                this.props.onReady && this.props.onReady();
            });
    });
  }

  markAsDone = request => {
    openConfirmDialog({
        headerLabel: translate('REQUEST_ACTION_MARK_DONE'),
        confirmationLabel: translate('REQUEST_ACTION_MARK_DONE_DESC')
    }, () => {
        const requests = this.state.requests;

        apiRequest
            .updateItem(request.id, {
                status: REQUEST_STATUS.MARKED_DONE
            }).then(_ => {
                const requestRef = requests
                    .find(_ => _.id === request.id);

                requestRef.status = REQUEST_STATUS.MARKED_DONE;

                requestRef.order.autoSettlementStartedAt = getUtcUnixTimeNow();
        
                this.setState({
                    requests
                });

                return openMessageDialog({
                    header: translate("REQUEST_ACTION_MARK_DONE_SUCCESS")
                });
            }, errorFactory());
    });
  }

  cancelRequest = request => {
    openConfirmDialog({
        headerLabel: translate('CANCEL_REQUEST_ACTION_HEADER'),
        confirmationLabel: translate('CANCEL_REQUEST_ACTION_DESC')
    }, () => {
        const requests = this.state.requests;

        apiRequest.updateItem(request.id, {
            status: REQUEST_STATUS.CANCELED
        }).then(_ => {
            requests
                .find(_ => _.id === request.id)
                .status = REQUEST_STATUS.CANCELED;

            this.setState({
                requests
            });

            return openMessageDialog({
                header: translate("CANCEL_REQUEST_ACTION_SUCCESS")
            });
        }, errorFactory());
    })
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
            { this.state.isLoading &&
                <Loader isLoading={true} />
            }

            { !this.state.isLoading &&
                <div className="row">
                    <div className="col-xs-12">
                    { this.props.showTitle &&
                        <h1 style={{color: CONFIG.COLOR_PRIMARY}}>
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
                        .map((request, index) =>
                            <div
                                key={index}
                                className="col-xs-12"
                                style={{ marginTop: 10 }}
                            >
                                <Paper
                                    style={{ padding: 10 }}>
                                    <ListingHeader
                                        task={request.task}
                                        config={CONFIG}
                                    />
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 text-left"> 
                                            <p className="text-muted" style={{ marginTop: 18 }}>
                                                <strong>
                                                    { String(request.status) === REQUEST_STATUS.PENDING &&
                                                        translate("REQUEST_STATUS_PENDING")
                                                    }

                                                    { String(request.status) === REQUEST_STATUS.ACCEPTED &&
                                                        translate("REQUEST_STATUS_ACCEPTED")
                                                    }

                                                    { String(request.status) === REQUEST_STATUS.MARKED_DONE &&
                                                        <span>
                                                            {translate("REQUEST_STATUS_MARKED_DONE")} ({translate("ORDER_AUTOSETTLEMENT_ON")} <Moment format={`${CONFIG.DATE_FORMAT}, ${CONFIG.TIME_FORMAT}`}>{(new Date(request.order.autoSettlementStartedAt * 1000).addHours(8))}</Moment>)
                                                        </span>
                                                    }

                                                    { String(request.status) === REQUEST_STATUS.SETTLED &&
                                                        translate("REQUEST_STATUS_SETTLED")
                                                    }

                                                    { String(request.status) === REQUEST_STATUS.CLOSED &&
                                                        translate("REQUEST_STATUS_CLOSED")
                                                    }

                                                    { String(request.status) === REQUEST_STATUS.DECLINED &&
                                                        translate("REQUEST_STATUS_DECLINED")
                                                    }

                                                    { String(request.status) === REQUEST_STATUS.CANCELED &&
                                                        translate("REQUEST_STATUS_CANCELED")
                                                    }
                                                    {request.review ? `, ${translate("REQUEST_REVIEWED")}` : ''}
                                                </strong>
                                            </p>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 text-right">
                                            <IconButton
                                                onClick={() => goTo(`/profile/${request.toUser.id}`)}
                                                tooltipPosition="top-center"
                                                tooltip={
                                                    `${request.toUser.firstName} ${request.toUser.lastName}`
                                                }
                                            >
                                                <Avatar src={request.toUser.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || '/images/avatar.png'} />
                                            </IconButton>
                                            { this.shouldShowPhoneNumber(request) &&
                                                <IconButton
                                                    style={{ top: 10 }}
                                                    tooltipPosition="top-center"
                                                    tooltip={
                                                        getUserProperty(request.with, 'phoneNo')
                                                    }>
                                                    <IconCall />
                                                </IconButton>
                                            }
                                            { String(request.status) !== REQUEST_STATUS.SETTLED && String(request.status) !== REQUEST_STATUS.CANCELED &&
                                                <IconButton
                                                    style={{ top: 10 }}
                                                    tooltip={'Chat'}
                                                    tooltipPosition="top-center"
                                                    onClick={() => goTo(`/chat/${request.id}`)}
                                                >
                                                    <IconChatBubble />
                                                </IconButton>
                                            }
                                            { this.shouldAllowCancel(request) &&
                                                <RaisedButton
                                                    primary={true}
                                                    label={translate('CANCEL')}
                                                    onTouchTap={() => this.cancelRequest(request)}
                                                />
                                            }
                                            { this.shouldAllowMarkingAsDone(request) &&
                                                <RaisedButton
                                                    primary={true}
                                                    label={translate('REQUEST_ACTION_MARK_DONE')}
                                                    onTouchTap={() => this.markAsDone(request)}
                                                />
                                            }
                                            {!request.review &&
                                                (request.status === REQUEST_STATUS.SETTLED ||
                                                 request.status === REQUEST_STATUS.CLOSED) &&
                                                <div style={{
                                                    display: 'inline-block',
                                                    padding: 10
                                                }}>
                                                    <RaisedButton
                                                        primary={true}
                                                        label={translate('LEAVE_REVIEW')}
                                                        onTouchTap={() => goTo(`/request/${request.id}/review`)}
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
        </div>
      );
   }
};
