import React from 'react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Moment from 'react-moment';
import HtmlTextField from '../Components/HtmlTextField';
import * as apiRequest from '../api/request';
import * as apiOrderActions from '../api/orderActions';
import { translate } from '../core/i18n';
import { goTo, tryGoBack } from '../core/navigation';
import displayTaskTiming from '../helpers/display-task-timing';
import DOMPurify from 'dompurify'
import Loader from "../Components/Loader";
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import { getConfigAsync } from '../core/config';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import ORDER_STATUS from '../constants/ORDER_STATUS';
import { getUserAsync } from '../core/auth';
import { displayPrice, displayLocation } from '../core/format';
import { stripHtml } from '../core/util';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import { openDialog as openMessageDialog } from '../helpers/open-message-dialog.js';

import '../Chat.css';

const _ = require('underscore');

const defaultProfileImageUrl = '/images/avatar.png';

const REQUEST_ORDER = [
    REQUEST_STATUS.PENDING,
    REQUEST_STATUS.ACCEPTED,
    REQUEST_STATUS.MARKED_DONE,
    REQUEST_STATUS.SETTLED,
    REQUEST_STATUS.DECLINED,
    REQUEST_STATUS.CANCELED
];

const actionBtnStyle = {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
};

export default class ChatRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            newMessage: '',
            task: {},
            users: {},
            messages: []
        };

        this.handleNewMessage = this.handleNewMessage.bind(this);
    }

    componentDidMount() {
        getConfigAsync(config => {
            getUserAsync(user => {
                let requestId = this.props.params.chatId;

                if (!user) {
                    return goTo(`/login?redirectTo=/chat/${requestId}`);
                }
                
                apiRequest.
                    getItem(requestId)
                    .then(chat => {
                        const task = chat.task;

                        if (task.status === '99') {
                            goTo('/');

                            return alert('You cannot access this page. The listing has been marked as spam.');
                        }

                        this.setState({
                            newMessage: '',
                            config,
                            isUserOwner: user.id === chat.task.userId,
                            requestId,
                            isLoading: false,
                            fromUserId: user.id,
                            toUserId: chat.messages[0].fromUserId === user.id ?
                                chat.messages[0].toUserId :
                                chat.messages[0].fromUserId,
                            messages: chat.messages,
                            users: chat.users,
                            task,
                            request: chat.request
                        });
                    });
            }, true);
        });
    }

    handleNewMessage (event) {
        event.preventDefault()
    
        let newMessage = this.state.newMessage;

        newMessage = newMessage
            .split('<p><br></p>')
            .filter(_ => _ !== '<p><br></p>')
            .join('')
            .replace(/(\r\n|\n|\r)/gm, "");

        if (newMessage < 2) {
            return alert(translate('ERROR_MESSAGE_TOO_SHORT'));
        }

        const data = {
            taskId: this.state.task.id,
            toUserId: this.state.toUserId,
            fromUserId: this.state.fromUserId,
            requestId: this.state.requestId,
            message: newMessage
        };

        this.state.messages.unshift(data);
        
        this.setState({
            newMessage: '',
            messages: this.state.messages
        });

        apiRequest
        .createItemMessage(this.state.requestId, data)
        .then(rMessage => {
            const messages = this.state.messages;
            
            messages[messages.length - 1] = rMessage;
            
            this.setState({
                messages
            });
        }, err => {
            alert('error');
        });
    }
    render() {
        return (
                <div className="container vq-no-padding st-chat-view">
                    { this.state.isLoading && 
                        <Loader isLoading={true} />
                    }
                    { !this.state.isLoading && 
                        <div className="col-xs-12">
                            <div className="col-xs-12 col-sm-8">
                                    { this.state.task &&
                                        <div className="row">
                                            <div className="hidden col-xs-12" style={{ margin: '10px' }}>
                                                <RaisedButton 
                                                    onClick={() => tryGoBack(`/chat`)}
                                                    label={translate('BACK')}
                                                />
                                            </div>    
                                            <div className="col-xs-12" style={ { margin: '10px' } }>
                                                <h1 className="st-h1">
                                                    <a style={{
                                                        textDecoration: 'none',
                                                        cursor: 'pointer'
                                                    }} onTouchTap={() => goTo(`/task/${this.state.task.id}`)}>
                                                        { this.state.task.title }
                                                    </a>
                                                </h1>
                                            </div>
                                            <div className="col-xs-12">
                                                <div className="col-xs-12 col-sm-4">
                                                    <p className="text-muted">
                                                        {translate('LISTING_DATE')}:<br />{displayTaskTiming(this.state.task.taskTimings)}
                                                    </p>
                                                </div>
                                                <div className="col-xs-12 col-sm-4">
                                                    <p className="text-muted">
                                                        {translate('LISTING_LOCATION')}:<br />{displayLocation(this.state.task.taskLocations[0])}
                                                    </p>
                                                </div>
                                                <div className="col-xs-12 col-sm-4">
                                                    <p className="text-muted">
                                                        {translate('PRICE')}:<br />{displayPrice(this.state.task.price, this.state.task.currency)}/h
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                    <Divider />
                                            </div>
                                        </div>
                                    }

                                    { this.state.users[this.state.fromUserId] &&
                                        <div className="row" style={{
                                            paddingLeft: 20,
                                            marginTop: 20,
                                            marginBottom: 20,
                                            paddingRight: 20
                                        }}>
                                            <div className="col-xs-12">
                                                <form onSubmit={this.handleNewMessage}>
                                                    <HtmlTextField                                                 
                                                        onChange={(event, newMessage) => this.setState({
                                                            newMessage
                                                        })}
                                                        value={this.state.newMessage}
                                                    />
                                                    
                                                    <RaisedButton
                                                        disabled={!stripHtml(this.state.newMessage)}
                                                        type="submit"
                                                        style={{ marginTop: 10, width: '100%' }}
                                                        label={translate("CHAT_MESSAGE_SUBMIT")}
                                                    />
                                                </form>
                                            </div>
                                        </div>
                                    } 

                                    { this.state.messages
                                        .filter(message => {
                                            if (this.state.users[message.fromUserId]) {
                                                return true;
                                            }

                                            console.error("Sender not found. Inconsistent data!");

                                            return false;
                                        })
                                        .map(message => {
                                            const sender = this.state.users[message.fromUserId];

                                            const firstName = sender.firstName;
                                            const lastName = sender.lastName;
                                            const profileImageUrl = sender.imageUrl || defaultProfileImageUrl;

                                            return <div className="row" style={{ paddingLeft: '20px', marginTop: '20px'}}>
                                                        <div className="col-xs-12" style={{ marginBottom: '20px'}}>
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
                                                                        <Moment format="DD.MM.YYYY, HH:mm">{message.createdAt}</Moment>
                                                                    </p>
                                                                </div>
                                                            </div>   
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div dangerouslySetInnerHTML={{
                                                                __html: DOMPurify.sanitize(message.message)
                                                            }} />
                                                            <Divider style={{ marginRight: '10px' }}/>
                                                        </div>
                                                </div>;
                                        })
                                    }          
                            </div>

                            <div className="col-xs-12 col-sm-4">
                                    <Paper zDepth={1} style={{ padding: '10px' }}>
                                        <div className="row">
                                            <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                                <h4>{translate("IN_THIS_CHAT")}</h4>
                                            </div>    
                                        </div>   
                                        <div className="row">
                                            <div className="col-xs-12" style={{
                                                marginBottom: '10px'
                                            }}>
                                                { Object.keys(this.state.users)
                                                .map(userId => {
                                                    const user = this.state.users[userId];
                                                    const firstName = user.firstName;
                                                    const lastName = user.lastName;
                                                    const profileImageUrl = user.imageUrl || defaultProfileImageUrl;
                                                    const name = `${firstName} ${lastName}`;
                                                    const profileBio = stripHtml(user.bio, 50);

                                                    return <div className="row" style={{ marginBottom: '10px' }}>
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
                                                                                { name }
                                                                            </strong>
                                                                            <br />
                                                                            { profileBio }
                                                                    </div>
                                                                </a>
                                                            </div>;
                                                })} 
                                            </div>
                                        </div>
                                    </Paper>
                                    { this.state.isUserOwner &&
                                      String(this.state.request.status) === '0' &&
                                        <RaisedButton
                                            labelStyle={{color: 'white'}}
                                            backgroundColor={this.state.config.COLOR_PRIMARY}
                                            style={actionBtnStyle}
                                            label={translate("BOOK")} 
                                            onClick={
                                                () => goTo(`/request/${this.state.requestId}/book`)
                                            }
                                        />
                                    }

                                    { this.state.request.order &&
                                      (
                                          String(this.state.request.order.status) === ORDER_STATUS.PENDING
                                      ) &&
                                      (
                                          this.state.request.fromUserId === this.state.fromUserId
                                      ) &&
                                        <RaisedButton
                                            label={translate('REQUEST_ACTION_MARK_DONE')}
                                            labelStyle={{color: 'white'}}
                                            backgroundColor={this.state.config.COLOR_PRIMARY}
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

                                    { this.state.isUserOwner && this.state.request.order &&
                                      (
                                          String(this.state.request.order.status) === ORDER_STATUS.PENDING ||
                                          String(this.state.request.order.status) === ORDER_STATUS.MARKED_DONE
                                      ) &&
                                        <RaisedButton
                                            label={translate('SETTLE_ORDER')}
                                            labelStyle={{color: 'white'}}
                                            backgroundColor={this.state.config.COLOR_PRIMARY}
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


                                    <Stepper className="hidden-xs" activeStep={
                                        REQUEST_ORDER.indexOf(this.state.request.status)
                                    } orientation="vertical">
                                        <Step>
                                            <StepLabel>{translate('REQUEST_RECEIVED')}</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel>{translate('REQUEST_BOOKED')}</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel>{translate('REQUEST_MARKED_AS_DONE')}</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel>{translate('REQUEST_SETLLED')}</StepLabel>
                                        </Step>
                                    </Stepper>
                            </div>
                        </div>   
                    }
            </div>    
        );
   }
};
