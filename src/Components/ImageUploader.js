import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import * as apiMedia from '../api/media';
import { translate } from '../core/i18n';
import Dropzone from 'react-dropzone';

import '../App.css'

export default class ImageUploader extends Component {
    constructor(props) {
        super();

        this.state = {
            images: props.images || []
        };
    }
    
    render() {
        return (
                <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
                        <div className="row">
                            <Dropzone onDrop={ files => {
                                apiMedia.upload(files[0], { width: 640, height: 640 })
                                .then(result => {
                                    const images = this.state.images;

                                    images.push({ imageUrl: result.url });

                                    this.setState({ images });

                                    this.props.onChange(images);
                                })
                            }} className="dropzone">
                                    <div className="row">
                                        <div className="text-center" style={{ marginTop: 20 }}>
                                            <RaisedButton label={translate('ADD_PICTURE_ACTION_HEADER')} primary={true}  />
                                            <p className="text-muted">{translate('ADD_PICTURE_ACTION_DESC')}</p>
                                        </div>
                                    </div>
                            </Dropzone>
                        </div>
                        { this.state.images &&
                            <div className="row" style={{ marginTop: 20 }}>
                                <hr />
                                { this.state.images.map((img, index) => 
                                    <div className="col-xs-12 col-sm-4 col-md-4 text-center">
                                        <img className="img-responsive" role="presentation" src={img.imageUrl}/>
                                        <FlatButton onTouchTap={ () => {
                                            const images = this.state.images;

                                            images.splice(index, 1);
                                            
                                            this.setState({ images });

                                            this.props.onChange(images);
                                        }} label={translate('REMOVE')} primary={false}  />
                                    </div>
                                )}
                            </div>
                        }
                </div>
        );
    }
}  
