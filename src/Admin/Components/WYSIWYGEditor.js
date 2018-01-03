import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class EditorConvertToHTML extends Component {
    constructor(props) {
        super();

        this.state = {
            editorState: props.value ?
                EditorState.createWithContent(stateFromHTML(props.value || '')) :
                EditorState.createEmpty(),
        };
    }
  
    onEditorStateChange = editorState => {
        this.setState({
            editorState
        });

        const html = stateToHTML(editorState.getCurrentContent());

        if (this.props.onChange) { 
            this.props.onChange(null, html);
        }
    };

    render() {
        const {
            editorState
        } = this.state;

        return (
            <div
                style={{
                    fontSize: '15px',
                    cursor: 'text',
                    minHeight: 100,
                    width: '100%',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#f8f8f8',
                    resize: 'vertical'
                }}
            >
                <Editor
                    toolbar={{
                        options: [
                            'inline',
                            'blockType',
                            'fontSize',
                            'list',
                            'textAlign',
                            'link',
                            'emoji',
                            'remove',
                            'history'
                        ]
                    }}
                    editorState={editorState}
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        );
    }
}

export default EditorConvertToHTML;
