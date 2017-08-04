import React from 'react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Moment from 'react-moment';
import CircularProgress from 'material-ui/CircularProgress';
import HtmlTextField from '../Components/HtmlTextField';
import * as coreAuth from '../core/auth';
import * as apiTaskComment from '../api/task-comment';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import DOMPurify from 'dompurify'
import '../Chat.css';

const _ = require('underscore');

const defaultProfileImageUrl = '/images/avatar.png';

export default class TaskComments extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            newComment: '',
            comments: [] 
        };

        this.handleNewComment = this.handleNewComment.bind(this);
    }

    componentDidMount() {
        let taskId = this.props.taskId;

        apiTaskComment.getItems(taskId)
            .then(comments => this.setState({
                taskId,
                isLoading: false,
                comments
            }));
    }

    handleNewComment (event) {
        event.preventDefault()
        
        const taskId = this.state.taskId;
        const comments = this.state.comments;
        const newCommentBody = this.state.newComment;
        const userId = coreAuth.getUser().id;
        const newComment = {
            userId,
            comment: newCommentBody
        };

        comments.push(newComment);
        
        apiTaskComment
        .createItem(taskId, newComment)
        .then(data => {
            console.log(data);
        })

        this.setState({
            newComment: '',
            comments
        });
    }

    render() {
        return (
            <div class="container">
            <h3>{translate('COMMENTS')}</h3>
            <p>{translate('COMMENTS_DESC')}</p>
            { this.state.comments
                .map(message => {
                    const sender = this.state.users[message.userId];

                    const firstName = sender.firstName;
                    const lastName = sender.lastName;
                    const profileImageUrl = sender.imageUrl || defaultProfileImageUrl;

                    return <div className="row" style={ { paddingLeft: '20px', marginTop: '20px'} }>
                                <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                    <div className="row">
                                        <div className="col-xs-2 col-sm-1">
                                            <a onClick={ () => goTo(`/profile/${message.fromUserId}`) }>
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
                                        <div className="col-xs-10 col-sm-11" style={{ marginTop: 6 }}>
                                            <strong>
                                                <a onClick={ () => goTo(`/profile/${message.fromUserId}`) }>
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
                                    <Divider style={ { marginRight: '10px' } }/>
                                </div>
                        </div>;
                })
            }

                    <div className="row" style={{
                        paddingLeft: '20px',
                        marginTop: '20px',
                        paddingRight: '20px'
                    }}>
                        <div className="col-xs-12">
                            <form onSubmit={this.handleNewComment}>
                                    <h4>{translate("REPLY")}</h4>
                                    <HtmlTextField                                                    
                                        onChange={(event, newMessage) => this.setState({
                                            newMessage
                                        })}
                                        value={this.state.newMessage}
                                    />
                                    
                                    <RaisedButton type="submit" style={{ width: '100%' }} label={translate("SEND")} />
                            </form>
                        </div>
                </div>
        </div>
        )
    }
}