import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import * as apiMedia from '../api/media';
import { translate } from '../core/i18n';
import { displayErrorFactory } from '../core/error-handler';

import '../App.css'

export default class FileUploader extends React.Component {
    constructor(props) {
        super();

        this.state = {
            newFileIsUploading: false,
            files: props.files || []
        };
    }
    
    componentWillReceiveProps (nextProps) {
        this.setState({
            files: nextProps.files || []
        });
    } 

    shouldShowDropzone() {
        return !this.state.files.length;
    }

    render() {
        return (
                <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
                        <div className="row">
                           { this.shouldShowDropzone() &&
                            <Dropzone onDrop={files => {
                                this.setState({
                                    newFileIsUploading : true
                                });

                                apiMedia
                                .uploadFile(files[0], {})
                                .then(result => {
                                    const files = this.state.files;

                                    files.push({ 
                                        fileUrl: result.url
                                    });

                                    this.setState({
                                        newFileIsUploading: false,
                                        files
                                    });

                                    this.props.onChange(files);
                                }, err => {
                                    this.setState({
                                        newFileIsUploading: false
                                    });

                                    displayErrorFactory()(err);
                                });
                            }} className="dropzone">
                                    <div className="row">
                                        <div className="text-center" style={{ marginTop: 20 }}>
                                            <RaisedButton label={translate('ADD_FILE_ACTION_HEADER')} primary={true}  />
                                            <p className="text-muted">{translate('ADD_FILE_ACTION_DESC')}</p>
                                        </div>
                                    </div>
                            </Dropzone>
                            }
                        </div>
                        <div className="row" style={{ marginTop: 20 }}>
                            { this.state.newFileIsUploading &&
                                <div className="col-xs-12 col-sm-4 col-md-4 text-center">
                                    <CircularProgress />
                                </div>
                            }
                            <hr />
                            { this.state.files
                                .map((img, index) =>
                                <div key={index} className="col-xs-12 col-sm-4 col-md-4 text-center">
                                    <a href={img.fileUrl} target="_blank"><AttachmentIcon /></a>
                                    <FlatButton 
                                        onTouchTap={() => {
                                            const files = this.state.files;
     
                                            files.splice(index, 1);
                                            
                                            this.setState({
                                                files
                                            });

                                            this.props.onChange(files);
                                        }}
                                        label={translate('REMOVE')}
                                        primary={false}  
                                    />
                                </div>
                            )}
                        </div>
                </div>
        );
    }
}  
