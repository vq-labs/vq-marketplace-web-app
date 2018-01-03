import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from "../../Components/Loader";
import apiPost from '../../api/post';

const CodeMirror = require('react-codemirror');

require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');

export default class CodeEditor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			post: {
				code: 'code',
				body: ''
			}
		};
	}
	
	getPost() {
        return apiPost
            .getItem(this.props.postKey, 'code')
            .then(post => {
                this.setState({
					ready: true,
					post
                });
			}, err => {
				this.setState({
					ready: true
                });
			})
    }

	componentDidMount() {
        this.getPost();
	}

	render() {
		const options = {
			lineNumbers: true,
			mode: 'javascript'
        };
        
		return <div>
				<div style={{
					border: "1px solid rgb(0, 6, 57)"
				}}>
						{!this.state.ready &&
							<Loader isLoading={true} />
						}

						{this.state.ready &&
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
								options={options}
							/>
						}
				</div>

				<RaisedButton
					primary={true}
					style={{ marginTop: 15, float: "right" }}
					disabled={!this.state.dirty}
					onTouchTap={() => {
						if (!this.state.post.id) {
							return apiPost
							.createItem({
								code: this.props.postKey,
								type: "code",
								body: this.state.post.body
							}, 3000)
							.then(() => this.setState({
								dirty: false
							}));
						}

						apiPost
						.updateItem(this.state.post.id, {
							body: this.state.post.body
						}, 3000)
						.then(() => this.setState({
							dirty: false
						}));
					}}
					label={'Save'}
				/>
			</div>
	}
}