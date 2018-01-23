import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { trimSpaces } from "../core/format";

// const striptags = require('striptags');

export default class HtmlTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
        placeholder: props.placeholder,
        editorState: EditorState.createWithContent(stateFromHTML(props.value || ''))
    };

    this.onChange = changedEditorState => {
        let html = stateToHTML(changedEditorState.getCurrentContent());
        const rawText = trimSpaces(changedEditorState.getCurrentContent().getPlainText());
        /*
            html = striptags(html, [
                'p',
                'br'
            ]);
        */

        this.props.onChange(null, html, rawText);

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
                    fontSize: '15px',
                    cursor: 'text',
                    minHeight: 100,
                    padding: 10,
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    backgroundColor: '#f8f8f8',
                    resize: 'vertical'
            }}>
                <Editor
                    stripPastedStyles={true}
                    ref="editor" 
                    editorState={this.state.editorState} 
                    onChange={this.onChange}
                    placeholder={this.state.placeholder}
                />
            </div>
        </div>
    );
  }
}
