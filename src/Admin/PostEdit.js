import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import HtmlTextField from '../Components/HtmlTextField';
import WYSIWYGEditor from './Components/WYSIWYGEditor';
const CodeMirror = require('react-codemirror');

require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');
import apiPost from '../api/post';

export default class SectionPostEdit extends React.Component {
    constructor(props) {
        super();

        this.state = {
            postId: props.params.postId,
            ready: false,
            type: {},
            post: {}
        };
    }
   
    getPost(postId) {
        return apiPost
            .getItem(postId, 'id')
            .then(post => {
                this.setState({
                    post,
                    ready: true
                });
            });
    }

    componentDidMount() {
        const postId = this.state.postId;

        this.getPost(postId);
    }

    renderAddFieldButton(fieldKey) {
        return (
          <Chip
            key={fieldKey}
            onClick={() => {
                const post = this.state.post;

                post.body = `${post.body}${fieldKey}`;
                
                this.setState({
                    post
                });
            }}
          >
            {fieldKey}
          </Chip>
        );
    }

    render() {
        return (
            <div className="container">
                { this.state.ready &&
                <div className="row">
                <div className="row">
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                            <TextField
                                disabled={true}
                                value={this.state.post.code}
                                style={{width: '100%'}}
                                inputStyle={{width: '100%'}}
                                floatingLabelText="Code"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                            <TextField
                                value={this.state.post.title}
                                onChange={(ev, value) => {
                                    const post = this.state.post;

                                    if (post.title === value) {
                                        return;
                                    }

                                    post.title = value;

                                    this.setState({
                                        dirty: true,
                                        post
                                    });
                                }}
                                style={{width: '100%'}}
                                inputStyle={{width: '100%'}}
                                floatingLabelText="Title"
                            />
                        </div>
                    </div>
                
                    <div className="row" style={{ marginTop: 30 }}>
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                          {
                            this.state.post.type === 'page' && (
                              <CodeMirror
                value={this.state.post.body}
                onChange={newCode => {
                  if (newCode !== this.state.post.body) {
                    const post = this.state.post;

                    post.body = newCode;

                    this.setState({
                      post,
                      dirty: true
                    });
                  }
                }}
                options={{
                  lineNumbers: true,
                  mode: 'javascript'
                }}
              />
                            )
                          }
                          {
                            this.state.post.type !== 'page' && (
                              <WYSIWYGEditor
                                value={this.state.post.body}
                                onChange={(ev, body) => {
                                    const post = this.state.post;

                                    if (post.body === body) {
                                        return;
                                    }

                                    this.setState({
                                        saved: false
                                    });

                                    post.body = body;

                                    this.setState({
                                        post,
                                        dirty: true
                                    });
                                }}
                            />
                            )
                          }
                        </div>
                    </div>
                    { false &&
                        <div className="row" style={{ marginTop: 30 }}>
                            <div className="col-xs-12 col-md-8 col-md-offset-2">
                                {this.renderAddFieldButton('LISTING_TITLE')}
                            </div>
                        </div>
                    }
                    <div className="row" style={{ marginTop: 30 }}>
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                            <RaisedButton
                                disabled={!this.state.dirty || this.state.isSaving}
                                onClick={() => {
                                    this.setState({
                                        isSaving: true
                                    });

                                    const post = this.state.post;

                                    apiPost
                                    .updateItem(post.id, {
                                        title: post.title,
                                        body: post.body
                                    }, 3000)
                                    .then(() => this.setState({
                                        isSaving: false,
                                        dirty: false
                                    }));
                                }}
                                label={this.state.isSaving ? 'Saving...' : 'Save'}
                            />
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}
