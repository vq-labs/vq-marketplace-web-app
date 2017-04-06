import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import * as apiChat from '../api/chat';
import apiMessage from '../api/message';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Ad from '../Components/Ad';

import { translate } from '../core/i18n';

import '../App.css';

export default class Chat extends Component {
  constructor() {
      super();

      this.state = {
        messages: [] 
      };

      this.getChatHeader = message => {
        let header =  message.task ? `${message.task.titel}` : ``;
        
        header += `${message.users[message.withUserId].profile.firstName} ${message.users[message.withUserId].profile.lastName}`;
       
        return header;
      }
  }
  componentDidMount() {
    apiMessage.getItems({ group_by: 'requestId' }).then(messages => this.setState( { messages }));
  }
  render() {
    return (
        <div className="container">
            <div className="col-xs-12 col-sm-8">
                <Paper zDepth={1} style={ { paddingBottom: '10px' } }>
                    <div class="row">
                        <div class="col-xs-12">
                           
                            <List>
                                <Subheader>{ translate('REQUESTS') }</Subheader>
                                
                                { this.state.messages && Object.keys(this.state.messages).map(requestId => { 
                                    const message = this.state.messages[requestId];

                                    return  <ListItem
                                            onClick={ () => { browserHistory.push('/app/chat/' + requestId ) }}
                                            primaryText={ `${message.header}, ${message.otherUser.firstName} ${message.otherUser.lastName}`  }
                                            secondaryText={ `${message.lastMsgProfile.firstName} ${message.lastMsgProfile.lastName}: ${message.lastMsg}` }
                                            leftAvatar={<Avatar src={ message.otherUser.imageUrl || '/images/avatar.png' } />}
                                            rightIcon={<CommunicationChatBubble />}
                                        />
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
                        <Ad />
                    </div>
                </div>
            </div>     
        </div>
      );
   }
};