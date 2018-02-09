import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import apiTask from '../api/task';
import { CONFIG } from '../core/config';
import ListingHeader from '../Components/ListingHeader';
import { openRequestDialog } from '../helpers/open-requests-dialog';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import getUserProperty from '../helpers/get-user-property';
import Moment from 'react-moment';
import * as apiRequest from '../api/request';
import { openDialog } from '../helpers/open-message-dialog.js';
import { getUserAsync } from '../core/auth';
import { getUtcUnixTimeNow } from '../core/util';
import { factory as errorFactory } from '../core/error-handler';

export default class TaskListItem extends Component {
  constructor(props) {
      super(props);

      this.state = {
          task: props.task,
          properties: props.properties,
          bookedRequest: props.task.requests.find(_ => _.status === REQUEST_STATUS.BOOKED)
      };
  }

  componentDidMount() {
      this.setState({
        ready: true
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

    const task = this.state.task;
    let request;

    return (
      <div
        className="col-xs-12"
        style={{ marginTop: 10 }}
      >
          { this.state.ready &&
          <Paper style={{padding: 10}}>
                    <ListingHeader task={task} />
                    <div className="row">
                        {
                          (
                            this.state.properties.editButton ||
                            this.state.properties.cancelButton ||
                            this.state.properties.requestsButton ||
                            this.state.properties.bookingDetails ||
                            this.state.properties.markAsDoneButton ||
                            this.state.properties.leaveReviewButton
                          ) &&
                          <div className="col-xs-12">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6">
                                  { 
                                    CONFIG.LISTING_EDIT_ENABLED === "1" &&
                                    this.state.properties.editButton &&
                                    this.state.task &&
                                    this.state.task.requests &&
                                    !this.state.task.requests
                                      .filter(_ => _.status === REQUEST_STATUS.PENDING).length &&
                                    <div style={{
                                        display: 'inline-block',
                                        marginTop: 10,
                                        marginRight: 5
                                    }}>
                                      <strong>
                                        <a
                                            className="vq-link"
                                            label={`${translate('EDIT_LISTING')}`}
                                            style={{color: CONFIG.COLOR_PRIMARY}}
                                            onTouchTap={() => goTo(`/task/${task.id}/edit`)}
                                        >
                                            {translate('EDIT')}
                                        </a>
                                      </strong>
                                    </div>
                                  }
                                  {
                                    this.state.properties.cancelButton &&
                                    this.state.task &&
                                    <div style={{
                                        display: 'inline-block',
                                        marginTop: 10,
                                        marginRight: 5
                                    }}>
                                      <strong>
                                        <a  
                                          className="vq-link"
                                          label={`${translate('CANCEL_LISTING_ACTION_HEADER')}`}
                                          style={{color: CONFIG.COLOR_PRIMARY}}
                                          onTouchTap={() => {
                                            openConfirmDialog({
                                              headerLabel: translate("CANCEL_LISTING_ACTION_HEADER"),
                                              confirmationLabel: translate("CANCEL_LISTING_DESC")
                                            }, () => {
                                              apiTask
                                                .updateItem(task.id, {
                                                  status: '103'
                                                })
                                                .then(_ => {
                                                  task.status = '103';

                                                  this.setState({
                                                    task
                                                  });
                                                  
                                                  if (this.props.onCancel) {
                                                    this.props.onCancel(task);
                                                  }
                                                }, err => {
                                                  console.error(err);
                                                })
                                            });
                                          }}
                                        >
                                          {translate('CANCEL')}
                                        </a>
                                      </strong>
                                  </div>
                                  }
                              </div>
                              <div className="col-xs-12 col-sm-6 text-right">
                              {
                                this.state.task.status === TASK_STATUS.BOOKED &&
                                this.state.bookedRequest &&
                                this.state.properties.bookingDetails && (
                                  <div>
                                  <IconButton
                                      onClick={() => goTo(`/profile/${this.state.bookedRequest.fromUser.id}`)}
                                      tooltipPosition="top-center"
                                      tooltip={
                                          `${this.state.bookedRequest.fromUser.firstName} ${this.state.bookedRequest.fromUser.lastName}`
                                      }
                                  >
                                      <Avatar src={this.state.bookedRequest.fromUser.imageUrl || '/images/avatar.png'} />
                                  </IconButton>
                                  { this.shouldShowPhoneNumber(this.state.bookedRequest) &&
                                      <IconButton
                                          style={{ top: 10 }}
                                          tooltipPosition="top-center"
                                          tooltip={
                                              getUserProperty(this.state.bookedRequest.fromUser, 'phoneNo')
                                          }>
                                          <IconCall />
                                      </IconButton>
                                  }
                                  { String(this.state.bookedRequest.status) !== REQUEST_STATUS.SETTLED && String(this.state.bookedRequest.status) !== REQUEST_STATUS.CANCELED &&
                                      <IconButton
                                          style={{ top: 10 }}
                                          tooltip={'Chat'}
                                          tooltipPosition="top-center"
                                          onClick={() => goTo(`/chat/${this.state.bookedRequest.id}`)}
                                      >
                                          <IconChatBubble />
                                      </IconButton>
                                  }
                                    </div>
                                )
                              }

{ 
                                    this.shouldAllowMarkingAsDone(this.state.bookedRequest) &&
                                    this.state.properties.markAsDoneButton &&
                                      <RaisedButton
                                          primary={true}
                                          label={translate('REQUEST_ACTION_MARK_DONE')}
                                          onTouchTap={() => this.markAsDone(this.state.bookedRequest)}
                                      />
                                  }
                                  {
                                    this.state.bookedRequest.status === REQUEST_STATUS.ACCEPTED  &&
                                    this.state.properties.bookButton &&
                                      <RaisedButton
                                          primary={true}
                                          label={translate('ORDER_CREATE')}
                                          onTouchTap={() => goTo(`/request/${this.state.bookedRequest.id}/book`)}
                                      />
                                  }
                                  {
                                      !this.state.bookedRequest.review &&
                                      (
                                          this.state.bookedRequest.status === REQUEST_STATUS.SETTLED ||
                                          this.state.bookedRequest.status === REQUEST_STATUS.CLOSED
                                      ) &&
                                      (
                                          (
                                              Number(this.state.bookedRequest.task.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                          ) ||
                                          (
                                              Number(this.state.bookedRequest.task.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                          )
                                      ) &&
                                      this.state.properties.leaveReviewButton &&
                                      <div style={{
                                          display: 'inline-block',
                                          padding: 10
                                      }}>
                                          <RaisedButton
                                              primary={true}
                                              label={translate('LEAVE_REVIEW')}
                                              onTouchTap={() => goTo(`/request/${this.state.bookedRequest.id}/review`)}
                                          />
                                      </div>
                                      }
                              
                              {
                                this.state.task.status === TASK_STATUS.ACTIVE &&
                                <div style={{
                                  display: 'inline-block',
                                  padding: 2
                                }}>
                                  <RaisedButton
                                      label={`${this.state.task.requests
                                        .filter(_ => _.status === REQUEST_STATUS.PENDING || _.status === REQUEST_STATUS.ACCEPTED)
                                        .length} ${translate('REQUESTS')}`}
                                      labelStyle={{color: 'white '}}
                                      backgroundColor={CONFIG.COLOR_PRIMARY}
                                      onTouchTap={() => {
                                        openRequestDialog(task.requests);
                                      }}
                                  />
                                </div>
                              }
                                  
                              </div>
                            </div>
                          </div>
                        }
                    </div>
                </Paper>
                }
            </div>
    );
  }
}