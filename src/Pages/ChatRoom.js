import React from 'react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Moment from 'react-moment';
import HtmlTextField from '../Components/HtmlTextField';
import * as apiRequest from '../api/request';
import * as apiOrderActions from '../api/orderActions';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import displayTaskTiming from '../helpers/display-task-timing';
import DOMPurify from 'dompurify'
import Loader from "../Components/Loader";
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { getConfigAsync } from '../core/config';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import ORDER_STATUS from '../constants/ORDER_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import USER_TYPES from '../constants/USER_TYPES';
import { getUserAsync } from '../core/auth';
import { getMode } from '../core/user-mode.js';
import { displayPrice, displayLocation } from '../core/format';
import { stripHTML } from '../core/format';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import { openDialog as openMessageDialog } from '../helpers/open-message-dialog.js';
import { CONFIG } from '../core/config';

import '../Chat.css';

const _ = require('underscore');

const defaultProfileImageUrl = '/images/avatar.png';

const REQUEST_ORDER = [
    REQUEST_STATUS.PENDING,
    REQUEST_STATUS.ACCEPTED,
    REQUEST_STATUS.BOOKED,
    REQUEST_STATUS.MARKED_DONE,
    REQUEST_STATUS.SETTLED,
    REQUEST_STATUS.CLOSED,
    REQUEST_STATUS.DECLINED,
    REQUEST_STATUS.CANCELED
];

let STEPER_STATUSES = [];

const actionBtnStyle = {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
};

const getReviewFromState = state => {
    try {
        return state.isUserTaskOwner ?
            state.request.order.review : state.request.review
    } catch (err) {
        return undefined;
    }
};

export default class ChatRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            newMessage: {
                value: '',
                rawText: ''
            },
            task: {},
            users: {},
            messages: [],
            isUserTaskOwner: false
        };

        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleRequestAccepted = this.handleRequestAccepted.bind(this);
    }

    componentDidMount() {
        getConfigAsync(config => {
            getUserAsync(user => {
                let requestId = this.props.params.chatId;

                if (!user) {
                    return goTo(`/login?redirectTo=/chat/${requestId}`);
                }

                apiRequest
                    .getItem(requestId)
                    .then(chat => {
                        
                        if (chat.task.status === TASK_STATUS.INACTIVE) {
                            return goTo('/');
                        }

                        if (chat.request.status === REQUEST_STATUS.CANCELED || chat.request.status === REQUEST_STATUS.DECLINED) {
                            return goTo('/');
                        }

                        const task = chat.task;

                        if (task.status === '99') {
                            goTo('/');

                            return alert('You cannot access this page. The listing has been marked as spam.');
                        }

                        this.setState({
                            newMessage: {
                                value: '',
                                rawText: ''
                            },
                            config,
                            isUserTaskOwner: user.id === chat.request.toUserId,
                            isUserRequestOwner: user.id === chat.request.fromUserId,
                            userMode: getMode(),
                            requestId,
                            user,
                            isLoading: false,
                            fromUserId: user.id,
                            toUserId: chat.request.fromUserId === user.id ?
                                chat.request.toUserId :
                                chat.request.fromUserId,
                            messages: chat.messages,
                            users: chat.users,
                            task,
                            taskType: task.taskType,
                            request: chat.request
                        });
                    });
            }, true);
        });
    }

    handleNewMessage(event) {
        event.preventDefault()

        if (this.state.newMessage.rawText < 2) {
            return alert(translate('ERROR_MESSAGE_TOO_SHORT'));
        }

        const data = {
            taskId: this.state.task.id,
            toUserId: this.state.toUserId,
            fromUserId: this.state.fromUserId,
            requestId: this.state.requestId,
            message: this.state.newMessage.value
        };

        this.state.messages.unshift(data);

        this.setState({
            isSubmitting: true,
            newMessage: {
                value: '',
                rawText: ''
            },
            messages: this.state.messages
        });

        apiRequest
            .createItemMessage(this.state.requestId, data)
            .then(rMessage => {
                const messages = this.state.messages;

                messages[0] = rMessage;

                this.setState({
                    isSubmitting: false,
                    messages
                });
            }, err => {
                this.setState({
                    isSubmitting: false
                });
                alert('error');
            });
    }

    handleRequestAccepted() {
        apiRequest
            .updateItem(this.state.requestId, {
                status: REQUEST_STATUS.ACCEPTED
            })
            .then(res => {
                this.setState({
                    request: res
                })
            });
    }

    renderStepper(orientation) {
        this.constructStepperStatuses();
        let steps = [];

        if (
            (this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REQUEST_STEP_ENABLED === "1") ||
            (this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REQUEST_STEP_ENABLED === "1")
        ) {
            steps.push(<Step>
                <StepLabel>{translate('REQUEST_STATUS_RECEIVED')}</StepLabel>
            </Step>)
        }

        if (
            this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REQUEST_STEP_ENABLED === "1"
        ) {
            steps.push(<Step>
                <StepLabel>{translate('REQUEST_STATUS_ACCEPTED')}</StepLabel>
            </Step>)
        }

        if (
            (this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_BOOKING_STEP_ENABLED === "1") ||
            (this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_BOOKING_STEP_ENABLED === "1")
        ) {
            steps.push(<Step>
                <StepLabel>{translate('REQUEST_STATUS_BOOKED')}</StepLabel>
            </Step>)
        }

        if (
            (this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_ENABLED === "1") ||
            (this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_ENABLED === "1")
        ) {
            steps.push(<Step>
                <StepLabel>{translate('REQUEST_STATUS_MARKED_DONE')}</StepLabel>
            </Step>)
        }

        if (
            (this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_ENABLED === "1") ||
            (this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_ENABLED === "1")
        ) {
            steps.push(<Step>
                <StepLabel>{this.state.request.status === REQUEST_STATUS.CLOSED ? translate('REQUEST_STATUS_CLOSED') : translate('REQUEST_STATUS_SETTLED')}</StepLabel>
            </Step>)
        }


        if (
            (this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1") ||
            (this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1")
        ) {
            steps.push(<Step>
                <StepLabel>{translate('REQUEST_STATUS_REVIEWED')}</StepLabel>
            </Step>)
        }

        return (
            <Stepper
                activeStep={this.getActiveStep(this.state.request.status)}
                orientation={orientation || 'horizontal'}
                style={{ paddingLeft: '15px', paddingRight: '15px' }}
            >
                {
                    steps.map((step, index) =>
                        step
                    )
                }
            </Stepper>
        )
    }

    getActiveStep(requestStatus) {
        let stepIndex = 1;
        let stepperMap = {};
    
        STEPER_STATUSES.forEach((STEPPER_STATUS, index) => {
            stepIndex = STEPPER_STATUS.indexOf(requestStatus) > -1 ? index : stepIndex;
        });

        if (stepIndex === STEPER_STATUSES.length - 1 && getReviewFromState(this.state)) {
            stepIndex += 1;
        }
    
        return stepIndex;
    };

    constructStepperStatuses() {
        STEPER_STATUSES = [];
        STEPER_STATUSES.push(
            [],
            [REQUEST_STATUS.PENDING]
        )
    
        if (this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REQUEST_STEP_ENABLED === "1") {
            STEPER_STATUSES.push([REQUEST_STATUS.ACCEPTED])
        }
    
        STEPER_STATUSES.push(
            [REQUEST_STATUS.BOOKED],
            [REQUEST_STATUS.MARKED_DONE],
            [REQUEST_STATUS.SETTLED, REQUEST_STATUS.CLOSED]
        )
    }

    render() {
        return (
            <div className="container vq-no-padding st-chat-view">
                {this.state.isLoading &&
                    <Loader isLoading={true} />
                }

                {!this.state.isLoading &&
                    <div className="row">
                        {
                            (
                                (
                                    this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1"
                                ) ||
                                (
                                    this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1"
                                )
                            ) &&
                            this.state.user &&
                            this.state.task &&
                            (
                                <div className="col-xs-12" style={{ marginTop: '50px' }}>
                                    <div className="col-xs-12 hidden-xs">
                                        {this.renderStepper('horizontal')}
                                    </div>
                                    <div className="col-xs-12 visible-xs" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                        <Card initiallyExpanded={true}>
                                            <CardHeader
                                                title={translate("WORKFLOW")}
                                                actAsExpander={true}
                                                showExpandableButton={true}
                                            />
                                            <CardText expandable={true}>
                                                {this.renderStepper('vertical')}
                                            </CardText>
                                        </Card>
                                    </div>
                                </div>
                            )
                        }
                        <div className="col-xs-12 col-sm-8">
                            <div className="col-xs-12">
                                <h1 style={{ color: CONFIG.COLOR_PRIMARY }}>
                                    {translate("CHAT_PAGE_HEADER")}
                                </h1>
                                <p>{translate("CHAT_PAGE_DESC")}</p>
                            </div>
                            <hr />
                            {this.state.task &&
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="col-xs-12">
                                            <h3>
                                                <a style={{
                                                    textDecoration: 'none',
                                                    cursor: 'pointer'
                                                }} onTouchTap={() => goTo(`/task/${this.state.task.id}`)}>
                                                    {this.state.task.title}
                                                </a>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        {CONFIG.LISTING_TIMING_MODE === "1" &&
                                            <div className="col-xs-12 col-sm-4">
                                                <p className="text-muted">
                                                    {translate('LISTING_DATE')}:<br />{displayTaskTiming(this.state.task.taskTimings, `${CONFIG.DATE_FORMAT}`)}
                                                </p>
                                            </div>
                                        }
                                        {CONFIG.LISTING_GEOLOCATION_MODE === "1" &&
                                            <div className="col-xs-12 col-sm-4">
                                                <p className="text-muted">
                                                    {translate('LISTING_LOCATION')}:<br />{displayLocation(this.state.task.taskLocations[0], [
                                                        REQUEST_STATUS.PENDING,
                                                        REQUEST_STATUS.DECLINED,
                                                        REQUEST_STATUS.CANCELED,
                                                        REQUEST_STATUS.SETTLED
                                                    ].indexOf(this.state.request.status) === -1)}
                                                </p>
                                            </div>
                                        }

                                        {CONFIG.LISTING_PRICING_MODE === "1" &&
                                            <div className="col-xs-12 col-sm-4">
                                                <p className="text-muted">
                                                    {translate('PRICE')}:<br />{displayPrice(this.state.task.price, this.state.task.currency)}/h
                                                            </p>
                                            </div>
                                        }

                                        {CONFIG.LISTING_QUANTITY_MODE === "1" &&
                                            <div className="col-xs-12 col-sm-4">
                                                <p className="text-muted">
                                                    {translate('LISTING_QUANTITY')}:<br /> {`${this.state.task.quantity} ${this.state.task.unitOfMeasure}`}
                                                </p>
                                            </div>
                                        }
                                    </div>
                                    <div className="col-xs-12">
                                        <Divider />
                                    </div>
                                </div>
                            }

                            {this.state.users[this.state.fromUserId] &&
                                <div className="row" style={{
                                    paddingLeft: 20,
                                    marginTop: 20,
                                    marginBottom: 20,
                                    paddingRight: 20
                                }}>
                                    <div className="col-xs-12">
                                        <form onSubmit={this.handleNewMessage}>
                                            <HtmlTextField
                                                onChange={(event, value, rawText) => this.setState({
                                                    newMessage: {
                                                        value,
                                                        rawText
                                                    }
                                                })}
                                                value={this.state.newMessage.value}
                                            />

                                            <RaisedButton
                                                disabled={this.state.isSubmitting ||  !this.state.newMessage.rawText}
                                                type="submit"
                                                style={{ marginTop: 10, width: '100%' }}
                                                label={translate("CHAT_MESSAGE_SUBMIT")}
                                            />
                                        </form>
                                    </div>
                                </div>
                            }

                            {this.state.messages
                                .filter(message => {
                                    if (this.state.users[message.fromUserId]) {
                                        return true;
                                    }

                                    console.error("Sender not found. Inconsistent data!");

                                    return false;
                                })
                                .map((message, index) => {
                                    const sender = this.state.users[message.fromUserId];

                                    const firstName = sender.firstName;
                                    const lastName = sender.lastName;
                                    const profileImageUrl = sender.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || defaultProfileImageUrl;

                                    return <div key={index} className="row" style={{ paddingLeft: '20px', marginTop: '20px' }}>
                                        <div className="col-xs-12" style={{ marginBottom: '20px' }}>
                                            <div className="row">
                                                <div className="col-xs-3 col-sm-1">
                                                    <a
                                                        style={{
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={
                                                            () => goTo(`/profile/${message.fromUserId}`)
                                                        }>
                                                        <img
                                                            alt="profile"
                                                            style={{
                                                                borderRadius: '50%',
                                                                width: '50px',
                                                                height: '50px'
                                                            }}
                                                            src={profileImageUrl}
                                                        />
                                                    </a>
                                                </div>
                                                <div className="col-xs-9 col-sm-11" style={{ marginTop: 6 }}>
                                                    <strong>
                                                        <a
                                                            style={{
                                                                textDecoration: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => goTo(`/profile/${message.fromUserId}`)}>
                                                            {firstName} {lastName}
                                                        </a>
                                                    </strong>
                                                    <br />
                                                    <p className="text-muted">
                                                        <Moment format={`${CONFIG.DATE_FORMAT}, ${CONFIG.TIME_FORMAT}`}>{message.createdAt}</Moment>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(message.message)
                                            }} />
                                            <Divider style={{ marginRight: '10px' }} />
                                        </div>
                                    </div>;
                                })
                            }
                        </div>
                        <div className="col-xs-12 col-sm-4" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                            <div className="col-xs-12">
                                <Paper zDepth={1} style={{ marginTop: '20px', padding: '15px' }}>
                                    <div className="row">
                                        <div className="col-xs-12" style={{ marginBottom: '20px' }}>
                                            <h4>{translate("IN_THIS_CHAT")}</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12" style={{
                                            marginBottom: '10px'
                                        }}>
                                            {Object.keys(this.state.users)
                                                .map(userId => {
                                                    const user = this.state.users[userId];
                                                    const firstName = user.firstName;
                                                    const lastName = user.lastName;
                                                    const profileImageUrl = user.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || defaultProfileImageUrl;
                                                    const name = `${firstName} ${lastName}`;
                                                    const profileBio = stripHTML(user.bio, 50);

                                                    return <div key={userId} className="row" style={{ marginBottom: '10px' }}>
                                                        <a href={`/app/profile/${userId}`}>
                                                            <div className="col-xs-4 col-sm-3 col-md-2">
                                                                <img alt={name}
                                                                    style={{
                                                                        borderRadius: '50%',
                                                                        width: '50px',
                                                                        height: '50px'
                                                                    }}
                                                                    src={profileImageUrl}
                                                                />
                                                            </div>
                                                            <div className="col-xs-8 col-sm-9 col-md-8">
                                                                <strong>
                                                                    {name}
                                                                </strong>
                                                                <br />
                                                                {profileBio ? profileBio : ''}
                                                            </div>
                                                        </a>
                                                    </div>;
                                                })}
                                        </div>
                                    </div>
                                </Paper>
                                {
                                    //This option is only available for supply listings as on a demand listing, the demand user directly books instead of accepting
                                    (
                                        
                                        this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REQUEST_STEP_ENABLED === "1"
                                        
                                    ) &&
                                    (
                                        this.state.isUserTaskOwner && this.state.taskType && Number(this.state.taskType) === 2 
                                    ) &&
                                    String(this.state.request.status) === REQUEST_STATUS.PENDING &&
                                    <RaisedButton
                                        primary={true}
                                        style={actionBtnStyle}
                                        label={translate("ACCEPT_REQUEST")}
                                        onClick={this.handleRequestAccepted}
                                    />
                                }
                                {
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_BOOKING_STEP_ENABLED === "1"
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_BOOKING_STEP_ENABLED === "1"
                                        )
                                    ) &&
                                    (
                                        (
                                            (
                                                this.state.taskType &&
                                                Number(this.state.taskType) === 1
                                            ) &&
                                            (
                                                this.state.isUserTaskOwner
                                            )
                                        ) ||
                                        (
                                            (
                                                this.state.taskType &&
                                                Number(this.state.taskType) === 2
                                            ) &&
                                            (
                                                this.state.isUserRequestOwner
                                            ) &&
                                            (
                                                this.state.request.status === REQUEST_STATUS.ACCEPTED
                                            )
                                        )
                                    ) &&
                                    (
                                        !this.state.request.order
                                    ) &&
                                    <RaisedButton
                                        primary={true}
                                        style={actionBtnStyle}
                                        label={translate("ORDER_CREATE")}
                                        onClick={
                                            () => goTo(`/request/${this.state.requestId}/book`)
                                        }
                                    />
                                }
                                {
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_ENABLED === "1"
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_ENABLED === "1"
                                        )
                                    ) &&
                                    (
                                        (
                                            (
                                                this.state.taskType &&
                                                Number(this.state.taskType) === 1
                                            ) &&
                                            (
                                                this.state.isUserRequestOwner
                                            )
                                        ) ||
                                        (
                                            (
                                                this.state.taskType &&
                                                Number(this.state.taskType) === 2
                                            ) &&
                                            (
                                                this.state.isUserTaskOwner
                                            )
                                        )
                                    ) &&
                                    (
                                        this.state.request.order &&
                                        (
                                            String(this.state.request.order.status) === ORDER_STATUS.PENDING
                                        )
                                    ) && //Mark done button for supplier when task is demand, for demander when task is supply                         
                                    <RaisedButton
                                        label={translate('REQUEST_ACTION_MARK_DONE')}
                                        labelStyle={{ color: 'white' }}
                                        backgroundColor={CONFIG.COLOR_PRIMARY}
                                        style={actionBtnStyle}
                                        onTouchTap={() => {
                                            const request = this.state.request;

                                            openConfirmDialog({
                                                headerLabel: translate('REQUEST_ACTION_MARK_DONE'),
                                                confirmationLabel: translate('REQUEST_ACTION_MARK_DONE_DESC')
                                            }, () => {
                                                apiRequest
                                                    .updateItem(request.id, {
                                                        status: REQUEST_STATUS.MARKED_DONE
                                                    })
                                                    .then(_ => {
                                                        request.status = REQUEST_STATUS.MARKED_DONE;
                                                        request.order.status = ORDER_STATUS.MARKED_DONE;

                                                        this.setState({
                                                            request
                                                        });

                                                        openMessageDialog({
                                                            header: translate('REQUEST_ACTION_MARK_DONE_SUCCESS')
                                                        });
                                                    });
                                            });
                                        }}
                                    />
                                }
                                {
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_ENABLED === "1"
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_ENABLED === "1"
                                        )
                                    ) &&
                                    (
                                        (
                                            (
                                                this.state.taskType &&
                                                Number(this.state.taskType) === 1
                                            ) &&
                                            (
                                                this.state.isUserTaskOwner
                                            )
                                        ) ||
                                        (
                                            (
                                                this.state.taskType &&
                                                Number(this.state.taskType) === 2
                                            ) &&
                                            (
                                                this.state.isUserRequestOwner
                                            )
                                        )
                                    ) &&
                                    (
                                        this.state.request.order &&
                                        (
                                            String(this.state.request.order.status) === ORDER_STATUS.PENDING ||
                                            String(this.state.request.order.status) === ORDER_STATUS.MARKED_DONE
                                        )
                                    ) && //Mark done button for supplier when task is supply, for demander when task is demand
                                    <RaisedButton
                                        label={translate('SETTLE_ORDER')}
                                        labelStyle={{ color: 'white' }}
                                        backgroundColor={CONFIG.COLOR_PRIMARY}
                                        style={actionBtnStyle}
                                        onTouchTap={() => {
                                            const request = this.state.request;

                                            openConfirmDialog({
                                                headerLabel: translate('SETTLE_ORDER'),
                                                confirmationLabel: translate('SETTLE_ORDER_DESC')
                                            }, () => {
                                                apiOrderActions
                                                    .settleOrder(request.order.id)
                                                    .then(_ => {
                                                        request.status = REQUEST_STATUS.SETTLED;
                                                        request.order.status = ORDER_STATUS.SETTLED;

                                                        this.setState({
                                                            request
                                                        });

                                                        openMessageDialog({
                                                            header: translate('ORDER_SETTLED_SUCCESS')
                                                        });
                                                    });
                                            });
                                        }}
                                    />
                                }
                                {
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                        )
                                    ) &&
                                    (
                                        this.state.request.order &&
                                        (
                                            String(this.state.request.status) === REQUEST_STATUS.SETTLED ||
                                            String(this.state.request.status) === REQUEST_STATUS.CLOSED
                                        ) &&
                                        (
                                            !this.state.request.order.review
                                        )
                                    ) &&
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 &&
                                            this.state.isUserTaskOwner
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 &&
                                            this.state.isUserRequestOwner
                                        )
                                    ) &&
                                    <RaisedButton
                                        label={translate('LEAVE_REVIEW')}
                                        labelStyle={{ color: 'white' }}
                                        backgroundColor={CONFIG.COLOR_PRIMARY}
                                        style={actionBtnStyle}
                                        onTouchTap={() => goTo(`/order/${this.state.request.order.id}/review`)}
                                    />
                                }
                                {
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1"
                                        )
                                    ) &&
                                    (
                                        this.state.request.order &&
                                        (
                                            String(this.state.request.status) === REQUEST_STATUS.SETTLED ||
                                            String(this.state.request.status) === REQUEST_STATUS.CLOSED
                                        ) &&
                                        (
                                            !this.state.request.review
                                        )
                                    ) &&
                                    (
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 1 &&
                                            this.state.isUserRequestOwner
                                        ) ||
                                        (
                                            this.state.taskType && Number(this.state.taskType) === 2 &&
                                            this.state.isUserTaskOwner
                                        )
                                    ) &&
                                    <RaisedButton
                                        label={translate('LEAVE_REVIEW')}
                                        labelStyle={{ color: 'white' }}
                                        backgroundColor={CONFIG.COLOR_PRIMARY}
                                        style={actionBtnStyle}
                                        onTouchTap={() => goTo(`/request/${this.state.request.id}/review`)}
                                    />
                                }
                                
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
};
