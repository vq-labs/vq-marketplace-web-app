import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import {translate} from '../core/i18n';
import {goTo} from '../core/navigation';
import {openConfirmDialog} from '../helpers/confirm-before-action.js';
import apiTask from '../api/task';
import {CONFIG} from '../core/config';
import ListingHeader from '../Components/ListingHeader';
import {openRequestDialog} from '../helpers/open-requests-dialog';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import getUserProperty from '../helpers/get-user-property';
import Moment from 'react-moment';
import * as apiRequest from '../api/request';
import {openDialog} from '../helpers/open-message-dialog.js';
import {getUserAsync} from '../core/auth';
import {getUtcUnixTimeNow} from '../core/util';
import {factory as errorFactory} from '../core/error-handler';

export default class RequestListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            request: props.request,
            properties: props.properties
        };
    }

    componentDidMount() {
        this.setState({ready: true});
    }

    markAsDone = request => {
        openConfirmDialog({
            headerLabel: translate('REQUEST_ACTION_MARK_DONE'),
            confirmationLabel: translate('REQUEST_ACTION_MARK_DONE_DESC')
        }, () => {
            const requests = this.state.requests;

            apiRequest
                .updateItem(request.id, {status: REQUEST_STATUS.MARKED_DONE})
                .then(_ => {
                    const requestRef = requests.find(_ => _.id === request.id);

                    requestRef.status = REQUEST_STATUS.MARKED_DONE;

                    requestRef.order.autoSettlementStartedAt = getUtcUnixTimeNow();

                    this.setState({requests});

                    return openDialog({header: translate("REQUEST_ACTION_MARK_DONE_SUCCESS")});
                }, errorFactory());
        });
    }

    cancelRequest = request => {
        openConfirmDialog({
            headerLabel: translate('CANCEL_REQUEST_ACTION_HEADER'),
            confirmationLabel: translate('CANCEL_REQUEST_ACTION_DESC')
        }, () => {
            const requests = this.state.requests;

            apiRequest
                .updateItem(request.id, {status: REQUEST_STATUS.CANCELED})
                .then(_ => {
                    requests
                        .find(_ => _.id === request.id)
                        .status = REQUEST_STATUS.CANCELED;

                    this.setState({requests});

                    return openDialog({header: translate("CANCEL_REQUEST_ACTION_SUCCESS")});
                }, errorFactory());
        })
    };

    handleClose = () => {
        this.setState({selectedOrderId: null, open: false});
    };

    shouldShowPhoneNumber = request => {
        return request.status === REQUEST_STATUS.ACCEPTED || request.status === REQUEST_STATUS.BOOKED || request.status === REQUEST_STATUS.MARKED_DONE;
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

        const request = this.state.request;

        return (
            <div
                className="col-xs-12"
                style={{
                marginTop: 10
            }}>
                {this.state.ready && <Paper style={{
                    padding: 10
                }}>
                    <ListingHeader task={request.task} config={CONFIG}/>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 text-left">
                            <p
                                className="text-muted"
                                style={{
                                marginTop: 18
                            }}>
                                <strong>
                                    {String(request.status) === REQUEST_STATUS.PENDING && translate("REQUEST_STATUS_PENDING")
}

                                    {String(request.status) === REQUEST_STATUS.ACCEPTED && translate("REQUEST_STATUS_ACCEPTED")
}

                                    {String(request.status) === REQUEST_STATUS.BOOKED && translate("REQUEST_STATUS_BOOKED")
}

                                    {String(request.status) === REQUEST_STATUS.MARKED_DONE && <span>
                                        {translate("REQUEST_STATUS_MARKED_DONE")}
                                        ({translate("ORDER_AUTOSETTLEMENT_ON")}
                                        <Moment format={`${CONFIG.DATE_FORMAT}, ${CONFIG.TIME_FORMAT}`}>{(new Date(request.order.autoSettlementStartedAt * 1000).addHours(8))}</Moment>)
                                    </span>
}

                                    {String(request.status) === REQUEST_STATUS.SETTLED && translate("REQUEST_STATUS_SETTLED")
}

                                    {String(request.status) === REQUEST_STATUS.CLOSED && translate("REQUEST_STATUS_CLOSED")
}

                                    {String(request.status) === REQUEST_STATUS.DECLINED && translate("REQUEST_STATUS_DECLINED")
}

                                    {String(request.status) === REQUEST_STATUS.CANCELED && translate("REQUEST_STATUS_CANCELED")
}
                                    {request.review
                                        ? `, ${translate("REQUEST_REVIEWED")}`
                                        : ''}
                                </strong>
                            </p>
                        </div>
                        <div className="col-xs-12 col-sm-6 text-right">
                            <IconButton
                                onClick={() => goTo(`/profile/${request.toUser.id}`)}
                                tooltipPosition="top-center"
                                tooltip={`${request.toUser.firstName} ${request.toUser.lastName}`}>
                                <Avatar src={request.toUser.imageUrl || '/images/avatar.png'}/>
                            </IconButton>
                            {this.shouldShowPhoneNumber(request) && <IconButton
                                style={{
                                top: 10
                            }}
                                tooltipPosition="top-center"
                                tooltip={getUserProperty(request.with, 'phoneNo')}>
                                <IconCall/>
                            </IconButton>
}
                            {String(request.status) !== REQUEST_STATUS.SETTLED && String(request.status) !== REQUEST_STATUS.CANCELED && <IconButton
                                style={{
                                top: 10
                            }}
                                tooltip={'Chat'}
                                tooltipPosition="top-center"
                                onClick={() => goTo(`/chat/${request.id}`)}>
                                <IconChatBubble/>
                            </IconButton>
}
                            {this.shouldAllowCancel(request) && <RaisedButton
                                primary={true}
                                label={translate('CANCEL')}
                                onTouchTap={() => this.cancelRequest(request)}/>
}
                            {this.shouldAllowMarkingAsDone(request) && <RaisedButton
                                primary={true}
                                label={translate('REQUEST_ACTION_MARK_DONE')}
                                onTouchTap={() => this.markAsDone(request)}/>
}
                            {request.status === REQUEST_STATUS.ACCEPTED && <RaisedButton
                                primary={true}
                                label={translate('ORDER_CREATE')}
                                onTouchTap={() => goTo(`/request/${request.id}/book`)}/>
}
                            {!request.review && (request.status === REQUEST_STATUS.SETTLED || request.status === REQUEST_STATUS.CLOSED) && ((Number(request.task.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1") || (Number(request.task.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1")) && <div
                                style={{
                                display: 'inline-block',
                                padding: 10
                            }}>
                                <RaisedButton
                                    primary={true}
                                    label={translate('LEAVE_REVIEW')}
                                    onTouchTap={() => goTo(`/request/${request.id}/review`)}/>
                            </div>
}
                        </div>
                    </div>
                </Paper>
}
            </div>
        );
    }
}