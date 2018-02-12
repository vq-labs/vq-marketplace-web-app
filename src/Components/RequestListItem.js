import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import {translate} from '../core/i18n';
import {goTo} from '../core/navigation'
import {luminateColor, getReadableTextColor, lightOrDark} from '../core/format';;
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
import Chip from 'material-ui/Chip';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import ORDER_STATUS from '../constants/ORDER_STATUS';
import * as apiOrderActions from '../api/orderActions';

export default class RequestListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            request: props.request,
            task: props.request.task,
            properties: props.properties,
            review: props
                .request
                .task
                .reviews
                .find(_ => _.fromUserId === props.request.fromUserId)
        };
    }

    componentDidMount() {
        this.setState({ready: true});
    }

    markAsDone = () => {
        if (this.state.task.taskType === 2) {
            openConfirmDialog({
                headerLabel: translate('SETTLE_ORDER'),
                confirmationLabel: translate('SETTLE_ORDER_DESC')
            }, () => {
                apiOrderActions
                    .settleOrder(this.state.request.order.id)
                    .then(_ => {
                        const request = this.state.request;
                        request.status = REQUEST_STATUS.SETTLED;
                        request.order.status = ORDER_STATUS.SETTLED;

                        this.setState({
                            request,
                            properties: {
                                ...this.state.properties,
                                bookingDetails: false,
                                leaveReviewButton: true
                            }
                        });

                        return openDialog({header: translate('ORDER_SETTLED_SUCCESS')});
                    }, errorFactory());
            });
        } else {
            openConfirmDialog({
                headerLabel: translate('REQUEST_ACTION_MARK_DONE'),
                confirmationLabel: translate('REQUEST_ACTION_MARK_DONE_DESC')
            }, () => {
    
                apiRequest
                    .updateItem(this.state.request.id, {status: REQUEST_STATUS.MARKED_DONE})
                    .then(_ => {
                        const request = this.state.request;
    
                        request.status = REQUEST_STATUS.MARKED_DONE;
    
                        request.order.autoSettlementStartedAt = getUtcUnixTimeNow();
    
                        this.setState({
                            request,
                            properties: {
                                ...this.state.properties,
                                bookingDetails: false
                            }
                        });
    
                        return openDialog({header: translate("REQUEST_ACTION_MARK_DONE_SUCCESS")});
                    }, errorFactory());
            });
        }
    }

    cancelRequest = () => {
        openConfirmDialog({
            headerLabel: translate('CANCEL_REQUEST_ACTION_HEADER'),
            confirmationLabel: translate('CANCEL_REQUEST_ACTION_DESC')
        }, () => {
            apiRequest
                .updateItem(this.state.request.id, {status: REQUEST_STATUS.CANCELED})
                .then(_ => {
                    const request = this.state.request;
                    request.status = REQUEST_STATUS.CANCELED;

                    this.setState({request});

                    return openDialog({header: translate("CANCEL_REQUEST_ACTION_SUCCESS")});
                }, errorFactory());
        })
    };

    leaveReview() {
        return this.state.task.taskType === 1 ?
            goTo(`/request/${this.state.request.id}/review`) :
            goTo(`/order/${this.state.request.order.id}/review`)
    }

    render() {

        const request = this.state.request;

        return (
            <div
                className="col-xs-12"
                style={{
                marginTop: 10
            }}>
                {
                    this.state.ready &&
                    <Paper style={{
                        padding: 10
                    }}>
                        <ListingHeader task={request.task} config={CONFIG}/>
                        <div className="row">
                            {
                                (
                                    this.state.properties.statusText ||
                                    this.state.properties.editButton ||
                                    this.state.properties.cancelButton ||
                                    this.state.properties.requestsButton ||
                                    this.state.properties.bookingDetails ||
                                    this.state.properties.markAsDoneButton ||
                                    this.state.properties.leaveReviewButton
                                ) &&
                                <div className="col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 text-left">
                                            {
                                                this.state.properties.statusText &&
                                                <p className="text-muted" style={{marginTop: 18}}>
                                                    <strong>
                                                        {String(request.status) === REQUEST_STATUS.PENDING && translate("REQUEST_STATUS_PENDING")}

                                                        {String(request.status) === REQUEST_STATUS.ACCEPTED && translate("REQUEST_STATUS_ACCEPTED")}

                                                        {String(request.status) === REQUEST_STATUS.BOOKED && translate("REQUEST_STATUS_BOOKED")}

                                                        {String(request.status) === REQUEST_STATUS.MARKED_DONE && 
                                                            <span>
                                                                {translate("REQUEST_STATUS_MARKED_DONE")}&nbsp;
                                                                ({translate("ORDER_AUTOSETTLEMENT_ON")}&nbsp;
                                                                <Moment format={`${CONFIG.DATE_FORMAT}, ${CONFIG.TIME_FORMAT}`}>{(new Date(request.order.autoSettlementStartedAt * 1000).addHours(8))}</Moment>)
                                                            </span>
                                                        }

                                                        {String(request.status) === REQUEST_STATUS.SETTLED && translate("REQUEST_STATUS_SETTLED")}

                                                        {String(request.status) === REQUEST_STATUS.CLOSED && translate("REQUEST_STATUS_CLOSED")}

                                                        {String(request.status) === REQUEST_STATUS.DECLINED && translate("REQUEST_STATUS_DECLINED")}

                                                        {String(request.status) === REQUEST_STATUS.CANCELED && translate("REQUEST_STATUS_CANCELED")}
                                                        {request.review
                                                            ? `, ${translate("REQUEST_REVIEWED")}`
                                                            : ''
                                                        }
                                                    </strong>
                                                </p>
                                            }
                                        </div>
                                        <div className="col-xs-12 col-sm-6 text-right">
                                            {
                                                this.state.properties.bookingDetails &&
                                                <IconButton
                                                    onClick={() => goTo(`/profile/${request.toUser.id}`)}
                                                    tooltipPosition="top-center"
                                                    tooltip={`${request.toUser.firstName} ${request.toUser.lastName}`}>
                                                    <Avatar src={request.toUser.imageUrl || '/images/avatar.png'}/>
                                                </IconButton>
                                            }
                                            {
                                                this.state.properties.bookingDetails &&
                                                (
                                                    request.status === REQUEST_STATUS.ACCEPTED ||
                                                    request.status === REQUEST_STATUS.BOOKED ||
                                                    request.status === REQUEST_STATUS.MARKED_DONE
                                                ) &&
                                                <IconButton
                                                    style={{
                                                    top: 10
                                                }}
                                                    tooltipPosition="top-center"
                                                    tooltip={getUserProperty(request.with, 'phoneNo')}>
                                                    <IconCall/>
                                                </IconButton>
                                            }
                                            {
                                                this.state.properties.bookingDetails &&
                                                (
                                                    request.status === REQUEST_STATUS.ACCEPTED ||
                                                    request.status === REQUEST_STATUS.BOOKED ||
                                                    request.status === REQUEST_STATUS.MARKED_DONE
                                                ) &&     
                                                <IconButton
                                                    style={{
                                                    top: 10
                                                }}
                                                    tooltip={'Chat'}
                                                    tooltipPosition="top-center"
                                                    onClick={() => goTo(`/chat/${request.id}`)}>
                                                    <IconChatBubble/>
                                                </IconButton>
                                            }
                                            {
                                                request.status === REQUEST_STATUS.PENDING &&
                                                this.state.properties.cancelButton &&
                                                <RaisedButton
                                                    primary={true}
                                                    label={translate('CANCEL')}
                                                    onTouchTap={() => this.cancelRequest()}
                                                />
                                            }
                                            {
                                                request.status === REQUEST_STATUS.ACCEPTED &&
                                                Number(this.state.task.taskType) ===  2 &&
                                                this.state.properties.bookButton &&
                                                <RaisedButton
                                                    primary={true}
                                                    label={translate('ORDER_CREATE')}
                                                    onTouchTap={() => goTo(`/request/${request.id}/book`)}
                                                />
                                            }
                                            {
                                                request.status === REQUEST_STATUS.BOOKED &&
                                                this.state.properties.markAsDoneButton &&
                                                <RaisedButton
                                                    primary={true}
                                                    label={this.state.task.taskType === 1 ? translate('REQUEST_ACTION_MARK_DONE') : translate('SETTLE_ORDER')}
                                                    onTouchTap={() => this.markAsDone()}
                                                />
                                            }
                                            {
                                                !this.state.review &&
                                                (
                                                    request.status === REQUEST_STATUS.MARKED_DONE ||
                                                    request.status === REQUEST_STATUS.SETTLED ||
                                                    request.status === REQUEST_STATUS.CLOSED
                                                ) &&
                                                (
                                                    (
                                                        Number(request.task.taskType) === 2 &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                                    ) ||
                                                    (
                                                        Number(request.task.taskType) === 1 &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                                    )
                                                ) &&
                                                this.state.properties.leaveReviewButton &&
                                                <div
                                                    style={{
                                                    display: 'inline-block',
                                                    padding: 10
                                                }}>
                                                    <RaisedButton
                                                        primary={true}
                                                        label={translate('LEAVE_REVIEW')}
                                                        onTouchTap={() => this.leaveReview()}/>
                                                </div>
                                            }
                                            {
                                                this.state.review &&
                                                (
                                                    request.status === REQUEST_STATUS.SETTLED ||
                                                    request.status === REQUEST_STATUS.CLOSED
                                                ) &&
                                                (
                                                    (
                                                        Number(this.state.task.taskType) === 2 &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                                    ) ||
                                                    (
                                                        Number(this.state.task.taskType) === 1 &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" &&
                                                        CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                                    )
                                                ) &&
                                                this.state.properties.leaveReviewButton &&
                                                this.state.properties.statusText &&
                                                <Chip labelColor={getReadableTextColor(CONFIG.COLOR_SECONDARY)} backgroundColor={CONFIG.COLOR_PRIMARY} style={{float: 'right'}}>
                                                    <Avatar
                                                        backgroundColor={luminateColor(CONFIG.COLOR_PRIMARY, -0.2)}
                                                        color={getReadableTextColor(CONFIG.COLOR_SECONDARY)}
                                                        icon={<CheckCircleIcon />}/> {translate('REQUEST_ALREADY_REVIEWED')}
                                                </Chip>
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