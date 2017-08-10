import React from 'react';
import * as apiConfig from '../api/config';
import apiPost from '../api/post';
import EditableEntity from '../Components/EditableEntity';
import * as coreNavigation from '../core/navigation';
import HtmlTextField from '../Components/HtmlTextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import * as coreUtil from '../core/util.js'
import { translate } from '../core/i18n';
import RaisedButton from 'material-ui/RaisedButton';

export default class SectionPostEdit extends React.Component {
    constructor(props) {
        super();

        this.state = {
            postId: post.params.postId,
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
                <div className="row">
                    <div className="col-xs-12 col-md-8 col-md-offset-2">
                            { this.state.ready &&
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
                                            body: post.body
                                        }, 3000)
                                        .then(() => this.setState({
                                            saved: true
                                        }))

                                        this.setState({ 
                                            post,
                                            dirty: true
                                        });
                                    }}
                                    value={this.state.post.body} 
                                />
                            }
                    </div>
                </div>
            </div>
        );
    }
}
