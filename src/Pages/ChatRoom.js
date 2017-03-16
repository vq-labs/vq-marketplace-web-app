import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import Ad from '../Components/Ad';
import Moment from 'react-moment';
import * as coreAuth from '../core/auth';
import * as apiChat from '../api/chat';
import '../App.css';
import '../Chat.css';


import '../App.css';

export default class ChatRoom extends Component {
  constructor() {
    super();
    this.state={
        newMessage: '',
        task: {},
        users: {},
        messages: [] 
    };

    this.handleNewMessage=this.handleNewMessage.bind(this);
  }

  componentDidMount() {
        let chatId=this.props.params.chatId;

        apiChat.getItem(chatId).then(chat => {
            this.setState({
                messages: chat.messages, 
                users: chat.users, 
                task: chat.task 
            });
        });
  }
 
  handleNewMessage (event) {
        event.preventDefault()
       
        const data={
            message: this.refs.newMessage.getValue()
        };

        this.refs.newMessage.value="";

        this.state.messages.push({ 
            message: data.message, 
            senderUserId: coreAuth.getUserId()
        });
        
        this.setState({
            newMessage: '',
            messages: this.state.messages
        });

        apiChat.createItem(this.state.messages[0].chatId, data).then(chatMessage => {
            console.log(chatMessage);
        });
  }

  render() {
    return (
            <div className="container st-chat-view">
                <div className="col-xs-12 col-sm-8">
                    <Paper zDepth={1} style={ { paddingBottom: '10px' } }>
                        <div className="row">
                            <div className="col-xs-12" style={ { margin: '10px' } }>
                                <RaisedButton onClick={ () => browserHistory.push('/app/chat/') } label="Zurück zu allen Nachrichten"/>
                            </div>    
                            <div className="col-xs-12" style={ { margin: '10px' } }>
                                <h1 className="st-h1">
                                    <a href={ '/app/task/' + this.state.task._id }>
                                        { this.state.task.title }
                                    </a>
                                </h1>
                                <Divider />
                            </div>
                        </div>
                        { this.state.messages.map(message => 
                                <div className="row" style={ { paddingLeft: '20px', marginTop: '20px'} }>

                                    <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                        <div className="row">
                                            <div className="col-xs-2 col-sm-1">
                                                <a href={ '/app/profile/' + message.senderUserId }>
                                                    <img alt="profile data" style={ { width: '60px', height: '60px' } } src={this.state.users[message.senderUserId].profile.imageUrl || 'images/avatar.png'} />
                                                </a>
                                            </div>
                                            <div className="col-xs-10 col-sm-11">
                                                <strong><a href={ '/app/profile/' + message.senderUserId }>{this.state.users[message.senderUserId].profile.firstName} {this.state.users[message.senderUserId].profile.lastName}</a></strong>
                                                <br />
                                                <p className="text-muted">
                                                    <Moment format="DD.MM.YYYY">{message.timestamp}</Moment>
                                                </p>
                                            </div>
                                         </div>   
                                    </div>

                                    <div className="col-xs-12">
                                        <p>{message.message}</p>
                                    
                                        <Divider style={ { marginLeft: '10px', marginRight: '10px' } }/>
                                    </div>
                                
                                </div>

                                
                            ) }
                            <div className="row" style={ { 
                                paddingLeft: '20px',
                                marginTop: '20px',
                                paddingRight: '20px'
                                } 
                                
                            }>
                            <div className="col-xs-12">
                                <form onSubmit={this.handleNewMessage}>
                                        <TextField
                                            onChange={ (event, target, value) => {
                                                this.setState( { newMessage: value } );
                                            }}
                                            value={this.state.newMessage}
                                            ref="newMessage"
                                            style={ { width: '100%' } }
                                            floatingLabelText="Antworten"
                                            multiLine={true}
                                            rows={4}
                                            rowsMax={5}
                                        />
                                        <RaisedButton type="submit" style={ { width: '100%' } } label="Senden" />
                                </form>
                            </div>
                        </div>
                    </Paper>
                   </div>

                   <div className="col-xs-12 col-sm-4">
                         <Paper zDepth={1} style={ { padding: '10px' } }>
                            <div className="row">
                                <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                    <h4>In diesem Chat</h4>
                                </div>    
                            </div>   
                            <div className="row">
                              <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                    { Object.keys(this.state.users).map(userId => <div className="row" style={ { marginBottom: '10px' } }>
                                        <a href={ '/app/profile/' + userId }>
                                            <div className="col-xs-3">
                                                <img  alt="profile data" style={ { width: '60px', height: '60px' } } src={this.state.users[userId].profile.imageUrl || 'images/avatar.png'} />
                                            </div>
                                            <div className="col-xs-9">
                                                
                                                    <strong>
                                                        {this.state.users[userId].profile.firstName} {this.state.users[userId].profile.lastName}
                                                    </strong>
                                                    <br />
                                                    { this.state.users[userId].profile.bio }
                                            </div>
                                         </a>
                                        </div>
                                    )} 
                                </div>   
                            </div>
                         </Paper>

        
                        <div className="row" style={ { paddingTop: '30px' } }>
                            <div className="col-xs-12">
                                <Ad />
                            </div>    
                        </div>
   
                   </div>
            </div>    
    );
   }
};


// this.getUserEditableTalent(talent)