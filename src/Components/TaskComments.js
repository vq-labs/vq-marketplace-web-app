import React from 'react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Moment from 'react-moment';
import HtmlTextField from '../Components/HtmlTextField';
import * as coreAuth from '../core/auth';
import * as apiTaskComment from '../api/task-comment';
import {translate} from '../core/i18n';
import {stripHTML} from "../core/format";
import {goTo} from '../core/navigation';
import {getConfigAsync} from '../core/config';
import DOMPurify from 'dompurify'
import '../Chat.css';

const _ = require('underscore');

const defaultProfileImageUrl = '/images/avatar.png';

export default class TaskComments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      task: {},
      isLoading: true,
      newComment: {
        value: '',
        rawText: ''
      },
      comments: []
    }
    this.handleNewComment = this.handleNewComment.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.task !== nextProps.task) {
      this.setState({
        task: nextProps.task,
        isLoading: false,
        comments: () => nextProps.task.comments.map(comment => {
          return comment.comment = {
            value: comment.comment,
            rawText: stripHTML(comment.comment)
          }
        })
      })
    }
  }


  componentDidMount() {
    getConfigAsync(config => {
      this.setState({
        config
      });
    });
  }


  handleNewComment(event) {
    event.preventDefault();

    const task = this.state.task;
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
      .createItem(task.id, {
        userId: user.id,
        comment: newCommentBody.value
      });


    this.setState({
      newComment: {
        value: '',
        rawText: ''
      },
      comments
    });
  }

  render() {
    return (
      <div className="col-xs-12">
        <div className="col-xs-12">
          <h3>{translate('LISTING_COMMENTS_HEADER')}</h3>
          <p>{translate('LISTING_COMMENTS_DESC')}</p>
        </div>
        {this.state.comments && this.state.comments.length > 0 && this.state.comments
          .map((message, index) => {
            const sender = message.user;
            const firstName = sender.firstName;
            const lastName = sender.lastName;
            const profileImageUrl = sender.imageUrl || defaultProfileImageUrl;

            return <div key={index} className="row"
                        style={{paddingLeft: '20px', marginTop: '20px', marginBottom: '20px'}}>
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
                      <a href="#" onClick={() => goTo(`/profile/${sender.id}`)}>
                        {firstName} {lastName}
                      </a>
                    </strong>
                    <br/>
                    {this.state.config &&
                    <p className="text-muted">
                      <Moment
                        format={`${this.state.config.DATE_FORMAT}, ${this.state.config.TIME_FORMAT}`}>{message.createdAt}</Moment>
                    </p>
                    }
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                <div dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(message.comment.value)
                }}/>
                <Divider style={{marginRight: '10px'}}/>
              </div>
            </div>;
          })
        }
        {this.props.canSubmit &&
        <div className="row" style={{
          paddingLeft: '20px',
          marginTop: '20px',
          paddingRight: '20px'
        }}>
          <div className="col-xs-12">
            <form onSubmit={this.handleNewComment}>
              <h4>{translate("REPLY")}</h4>
              <HtmlTextField
                onChange={(event, value, rawText) => this.setState({
                  newComment: {
                    value,
                    rawText
                  }
                })}
                value={this.state.newComment.value}
              />

              <RaisedButton
                disabled={!this.state.newComment.rawText}
                type="submit"
                style={{width: '100%'}}
                label={translate("LISTING_COMMENTS_SUBMIT")}
              />
            </form>
          </div>
        </div>
        }
      </div>
    )
  }
}