import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CircularProgress from 'material-ui/CircularProgress';
import apiMessage from '../api/message';
import * as apiRequest from '../api/request';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import { goTo } from '../core/navigation';

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
    !coreAuth.getUserId() && goTo('/login');

    apiRequest.getItems({})
    .then(requests => this.setState({
        isLoading: false,
        requests
    }));
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
                        <div className="col-xs-12 col-sm-8">
                            <Paper zDepth={1} style={ { paddingBottom: '10px' } }>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <List>
                                            <Subheader>{ translate('REQUESTS') }</Subheader>
                                            { this.state.requests && 
                                                this.state.requests
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
