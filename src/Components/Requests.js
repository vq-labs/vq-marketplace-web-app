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
import RequestListItem from './RequestListItem';
import * as apiRequest from '../api/request';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import { openDialog } from '../helpers/open-message-dialog.js';
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
        status: props.status,
        isLoading: true,
        requests: [],
        properties: props.properties
      };
  }
  
  componentDidMount() {
    getUserAsync(user => {
        const queryObj = {};
        
        if (this.state.status) {
            queryObj.status = this.state.status;
        }
        queryObj.userId = user.id;

        apiRequest
            .getItems(queryObj)
            .then(requests => {
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

                return openDialog({
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

            return openDialog({
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
    request.status === REQUEST_STATUS.BOOKED ||
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
      return request.status === REQUEST_STATUS.BOOKED;
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
                        <RequestListItem
                            request={request}
                            properties={this.state.properties}
                            onCancel={() => openDialog({
                                header: translate('CANCEL_REQUEST_ACTION_HEADER'),
                                desc: translate('CANCEL_REQUEST_ACTION_DESC')
                              }, () => {
                                const tasks = this.state.tasks;

                                tasks.splice(index, 1);

                                this.setState({
                                  tasks
                                });
                              })
                            }
                        />
                        </div>
                    )}
                   
                    </div>
                </div>
            }
        </div>
      );
   }
};
