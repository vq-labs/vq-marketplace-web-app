import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import * as apiMedia from '../api/media';
import { translate } from '../core/i18n';
import { displayErrorFactory } from '../core/error-handler';

import '../App.css'

export default class ImageUploader extends React.Component {
    constructor(props) {
        super();

        this.state = {
            imageResolution: props.imageResolution || [],
            singleImageMode: props.singleImageMode,
            newImageIsUploaded: false,
            images: props.images || []
        };
    }
    
    componentWillReceiveProps (nextProps) {
        this.setState({
            images: nextProps.images || []
        });
    } 

    shouldShowDropzone() {
        if (!this.state.singleImageMode) {
            return true;
        }

        return this.state.singleImageMode && !this.state.images.length;
    }

    render() {
        return (
                <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
                        <div className="row">
                           { this.shouldShowDropzone() &&
                            <Dropzone onDrop={files => {
                                this.setState({
                                    newImageIsUploaded: true
                                });

                                apiMedia.upload(files[0], {
                                    width: this.state.imageResolution[0] || undefined,
                                    height: this.state.imageResolution[1] || undefined
                                })
                                .then(result => {
                                    const images = this.state.images;

                                    images.push({ 
                                        imageUrl: result.url
                                    });

                                    this.setState({
                                        newImageIsUploaded: false,
                                        images
                                    });

                                    this.props.onChange(images);
                                }, err => {
                                    this.setState({
                                        newImageIsUploaded: false
                                    });

                                    displayErrorFactory()(err);
                                });
                            }} className="dropzone">
                                    <div className="row">
                                        <div className="text-center" style={{ marginTop: 20 }}>
                                            <RaisedButton label={translate('ADD_PICTURE_ACTION_HEADER')} primary={true}  />
                                            <p className="text-muted">{translate('ADD_PICTURE_ACTION_DESC')}</p>
                                        </div>
                                    </div>
                            </Dropzone>
                            }
                        </div>
                        <div className="row" style={{ marginTop: 20 }}>
                            { this.state.newImageIsUploaded &&
                                <div className="col-xs-12 col-sm-4 col-md-4 text-center">
                                    <CircularProgress />
                                </div>
                            }
                            <hr />
                            { this.state.images
                                .map((img, index) =>
                                <div key={index} className="col-xs-12 col-sm-4 col-md-4 text-center">
                                    <img className="img-responsive" role="presentation" src={img.imageUrl}/>
                                    <FlatButton 
                                        onTouchTap={() => {
                                            const images = this.state.images;
     
                                            images.splice(index, 1);
                                            
                                            this.setState({
                                                images
                                            });

                                            this.props.onChange(images);
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
