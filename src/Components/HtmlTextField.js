import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

export default class HtmlTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
        placeholder: props.placeholder,
        editorState: EditorState.createWithContent(stateFromHTML(props.value || ''))
    };

    this.onChange = changedEditorState => {
        const html = stateToHTML(changedEditorState.getCurrentContent());
        
        this.props.onChange(null, html);

        this.setState({ 
            editorState: changedEditorState 
        });
    };

    this.focus = () => this.refs.editor.focus();
  }

  componentWillReceiveProps (nextProps) {
        if (!nextProps.value) {
            const emptyState = EditorState.createWithContent(stateFromHTML(''));

            this.setState({ 
                editorState: emptyState
            });
        }
  }

  render() {
    return (
        <div>
            <div onClick={this.focus} style={{
                    fontSize: '16px',
                    cursor: 'text',
                    minHeight: 80,
                    padding: 10
            }}>
                <Editor 
                    ref="editor" 
                    editorState={this.state.editorState} 
                    onChange={this.onChange}
                    placeholder={this.state.placeholder}
                />
                
            </div>
            <hr />
        </div>
    
    );
  }
}
