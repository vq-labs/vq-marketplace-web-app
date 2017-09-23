import React from 'react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Moment from 'react-moment';
import HtmlTextField from '../Components/HtmlTextField';
import * as coreAuth from '../core/auth';
import * as apiTaskComment from '../api/task-comment';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import { stripHtml } from '../core/util';
import DOMPurify from 'dompurify'
import '../Chat.css';

const _ = require('underscore');

const defaultProfileImageUrl = '/images/avatar.png';

export default class TaskComments extends React.Component {
    constructor(props) {
        super();

        let taskId = props.taskId;

        this.state = {
            taskId,
            isLoading: true,
            newComment: '',
            comments: props.comments
        };

        this.handleNewComment = this.handleNewComment.bind(this);
    }

    componentDidMount() {

    }

    handleNewComment (event) {
        event.preventDefault()
        
        const taskId = this.state.taskId;
        const comments = this.state.comments;
        const newCommentBody = this.state.newComment;
        const user = coreAuth.getUser();

        const newComment = {
            userId: user.id,
            user,
            comment: newCommentBody
        };
        
        comments.push(newComment);
        
        apiTaskComment
            .createItem(taskId, {
                userId: user.id,
                comment: newCommentBody
            });
          

        this.setState({
            newComment: '',
            comments
        });
    }

    render() {
        return (
            <div class="container">
                <div className="col-xs-12">
                    <h3>{translate('COMMENTS')}</h3>
                    <p>{translate('COMMENTS_DESC')}</p>
                </div>
            { this.state.comments
            .map(message => {
                const sender = message.user;
                const firstName = sender.firstName;
                const lastName = sender.lastName;
                const profileImageUrl = sender.imageUrl || defaultProfileImageUrl;

                return <div className="row" style={ { paddingLeft: '20px', marginTop: '20px', marginBottom: '20px'} }>
                            <div className="col-xs-12" style={{
                                marginBottom: '20px'
                            }}>
                                <div className="row">
                                    <div className="col-xs-2 col-sm-1">
                                        <a
                                            href="#"
                                            onClick={() => goTo(`/profile/${sender.id}`)}
                                        >
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
                                    <div className="col-xs-10 col-sm-11" style={{
                                        marginTop: 6
                                    }}>
                                        <strong>
                                            <a href="#" onClick={ () => goTo(`/profile/${sender.id}`) }>
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
                                    __html: DOMPurify.sanitize(message.comment)
                                }} />
                                <Divider style={ { marginRight: '10px' } }/>
                            </div>
                    </div>;
            })
            }
            { this.props.canSubmit &&
                    <div className="row" style={{
                        paddingLeft: '20px',
                        marginTop: '20px',
                        paddingRight: '20px'
                    }}>
                        <div className="col-xs-12">
                            <form onSubmit={this.handleNewComment}>
                                    <h4>{translate("REPLY")}</h4>
                                    <HtmlTextField                                                    
                                        onChange={(event, newComment) => this.setState({
                                            newComment
                                        })}
                                        value={this.state.newComment}
                                    />
                                    
                                    <RaisedButton
                                        disabled={!stripHtml(this.state.newComment)}
                                        type="submit"
                                        style={{ width: '100%' }}
                                        label={translate("SEND")}
                                    />
                            </form>
                        </div>
                </div>
            }
        </div>
        )
    }
}