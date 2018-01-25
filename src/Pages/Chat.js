import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CircularProgress from 'material-ui/CircularProgress';
import * as apiRequest from '../api/request';
import { translate } from '../core/i18n';
import { getUserAsync } from '../core/auth';
import { goTo } from '../core/navigation';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const stripHTML = html => {
   const tmp = document.createElement("DIV");
   
   tmp.innerHTML = html;
   
   return tmp.textContent || tmp.innerText || "";
};

export default class Chat extends Component {
  constructor() {
      super();

      this.state = {
        isLoading: true,
        requests: []
      };

      this.getChatHeader = message => {
        let header =  message.task ? `${message.task.titel}` : ``;
        
        header += `${message.users[message.withUserId].profile.firstName} ${message.users[message.withUserId].profile.lastName}`;
       
        return header;
      }
  }
  componentDidMount() {
    getUserAsync(user => {
        if (!user) {
            return goTo('/');
        }

        if (user.status !== '10') {
            return goTo('/email-not-verified');
        }
        
        apiRequest.getItems({})
        .then(requests => this.setState({
            isLoading: false,
            requests
        }));
    });
  }
  render() {
    return (
        <div className="container">
            { this.state.isLoading && 
                <div className="text-center" style={{ 'marginTop': '40px' }}>
                        <CircularProgress size={80} thickness={5} />
                </div>
            }
            { !this.state.isLoading && 
                <div className="row">
                    <div className="col-xs-12">
                        <div className="col-xs-3 col-sm-3">
                            <DropDownMenu
                                style={{
                                    width: '100%'
                                }}
                                value={this.state.statusFilter} onChange={(_, _2, statusFilter) => {
                                this.setState({
                                    statusFilter
                                })
                            }}>
                                <MenuItem value={undefined} primaryText="No filter" />
                                {
                                    Object.keys(REQUEST_STATUS)
                                    .filter(status => {
                                        if (status === 'CANCELED') {
                                            return false;
                                        }

                                        if (status === 'DECLINED') {
                                            return false;
                                        }

                                        if (status === 'SETTLED') {
                                            return false;
                                        }
                                        
                                        return true;
                                    })
                                    .map((status, index) =>
                                        <MenuItem
                                            key={index}
                                            value={REQUEST_STATUS[status]}
                                            primaryText={translate(`REQUEST_STATUS_${status}`)}
                                        />
                                    )
                                }
                            </DropDownMenu>
                        </div>
                        <div className="col-xs-3 col-sm-2">
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="col-xs-12 col-sm-8">
                            <Paper zDepth={1} style={{ paddingBottom: '10px' }}>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <List>
                                            <Subheader>{ translate('REQUESTS') }</Subheader>
                                            { !this.state.requests.filter(request => {
                                                    if (!this.state.statusFilter) {
                                                        return true;
                                                    }

                                                    return this.state.statusFilter === request.status;
                                                }).length && 
                                                <div className="col-xs-12">
                                                    <p className="text-muted">{translate('NO_REQUESTS')}</p>
                                                </div>
                                            }
                                            { this.state.requests && 
                                                this.state.requests
                                                .filter(request => {
                                                    if (!this.state.statusFilter) {
                                                        return true;
                                                    }

                                                    return this.state.statusFilter === request.status;
                                                })
                                                .map((request, index) => {
                                                    const lastMsg = request.lastMsg;
                                                    const lastMsgFirstName = request.with.firstName;
                                                    const lastMsgLastName = request.with.lastName;
                                                    const name = `${lastMsgFirstName} ${lastMsgLastName}`;

                                                    return <ListItem
                                                            key={index}
                                                            onClick={() => goTo(`/chat/${request.id}`)}
                                                            primaryText={request.task.title}
                                                            secondaryText={`${name}: ${stripHTML(lastMsg.message)}`}
                                                            leftAvatar={<Avatar src={request.with.imageUrl || '/images/avatar.png'} />}
                                                            rightIcon={<CommunicationChatBubble />}
                                                        />;
                                                })
                                            }
                                        </List>
                                    </div>   
                                </div>   
                            </Paper>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <div className="row">
                                <div className="col-xs-12">
                                </div>
                            </div>
                        </div>     
                    </div>
                </div>
            }
        </div>
      );
   }
};
