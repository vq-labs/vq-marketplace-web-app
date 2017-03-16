import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import * as apiChat from '../api/chat';


import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import Ad from '../Components/Ad';



import '../App.css';

export default class Chat extends Component {
  constructor() {
      super();
      this.state = {
          messages: [] 
      };
  }

  componentDidMount() {
        apiChat.getItems().then(messages => {
            this.setState( { messages: messages });
        });
  }
 
  render() {
    

    return (
        <div className="container">
            <div className="col-xs-12 col-sm-8">
                <Paper zDepth={1} style={ { paddingBottom: '10px' } }>
                    <div class="row">
                        <div class="col-xs-12">
                            <List>
                                <Subheader>Nachrichten und Anfragen</Subheader>

                                { !this.state.messages.length && 
                                    <p style={ { padding: '20px' } }>
                                        Keine Anfragen
                                    </p>
                                }

                                { this.state.messages.map(message =>  
                                
                                    <ListItem
                                        onClick={ () => { browserHistory.push('/app/chat/' + message._id ); }}
                                        primaryText={ '"' + message.task.title + '", ' + message.users[message.withUserId].profile.firstName + ' ' + message.users[message.withUserId].profile.lastName  }
                                        secondaryText={ message.lastMsg.message }
                                        leftAvatar={<Avatar src={message.users[message.withUserId].profile.imageUrl || '/images/avatar.png'} />}
                                        rightIcon={<CommunicationChatBubble />}
                                    />

                                    )}
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