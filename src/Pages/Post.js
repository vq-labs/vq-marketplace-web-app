import React from 'react';
import apiPost from '../api/post';
import DOMPurify from 'dompurify'

export default class SectionPostEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            saved: false,
            type: {},
            post: {}
        };
    }
   
    getPostByCode(postCode) {
        return apiPost
            .getItem(postCode, 'code')
            .then(post => {
                this.setState({
                    post,
                    ready: true
                });
            });
    }

    getPostById(postId) {
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
        if (this.props.params && this.props.params.postId)
            return this.getPostById(this.props.params.postId);

        if (this.props.postCode)
            return this.getPostByCode(this.props.postCode);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-8 col-md-offset-2">
                            { this.state.ready &&
                                <div 
                                    className="content"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(this.state.post.body)
                                    }}
                                />
                            }
                    </div>
                </div>
            </div>
        );
    }
}
