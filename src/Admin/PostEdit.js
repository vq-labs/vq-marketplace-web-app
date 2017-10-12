import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import HtmlTextField from '../Components/HtmlTextField';
import apiPost from '../api/post';
import * as coreNavigation from '../core/navigation';
import { translate } from '../core/i18n';

export default class SectionPostEdit extends React.Component {
    constructor(props) {
        super();

        this.state = {
            postId: props.params.postId,
            ready: false,
            saved: false,
            type: {},
            post: {}
        };
    }
   
    getPost(postId) {
        return apiPost
            .getItem(postId, 'id')
            .then(post => {
                this.setState({
                    saved: true,
                    post,
                    ready: true
                });
            });
    }

    componentDidMount() {
        const postId = this.state.postId;

        this.getPost(postId);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-6 text-left">
                        <RaisedButton onClick={ () => coreNavigation.goTo(`/admin/posts`) } label={translate('BACK')}/>
                    </div>
                    <div className="col-xs-6 text-right">
                        <p>{this.state.saved ? 'Saved' : 'Saving...'}</p>
                    </div>
                </div>
                { this.state.ready &&
                <div className="row">
                    <div className="row">
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                            <TextField
                                value={this.state.post.title}
                                onChange={(ev, value) => {
                                    const post = this.state.post;

                                    post.title = value;

                                    this.setState({
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
                                        <HtmlTextField 
                                            onChange={(ev, body) => {
                                                const post = this.state.post;

                                                if (post.body === body) {
                                                    return;
                                                }

                                                this.setState({
                                                    saved: false
                                                });

                                                post.body = body;

                                                apiPost.updateItem(post.id, {
                                                    title: post.title,
                                                    body: post.body
                                                }, 3000)
                                                .then(() => this.setState({
                                                    saved: true
                                                }));

                                                this.setState({ 
                                                    post,
                                                    dirty: true
                                                });
                                            }}
                                            value={this.state.post.body} 
                                        />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
