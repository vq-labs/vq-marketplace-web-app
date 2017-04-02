import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { translate } from '../core/i18n';

import '../App.css'

export default class ProfileImage extends Component {
    constructor(props) {
        super();

        this.state = {
            hover: false,
            image: props.imageUrl || '',
            allowChange: props.allowChange || false
        };

        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }
    mouseOver() {
        this.setState({ hover: true });
    }
    mouseOut() {
        this.setState({ hover: false });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ image: nextProps.image, allowChange: nextProps.allowChange });
    } 
    render() {
        return (
                <Dropzone onDrop={this.props.onDrop} className="st-profile-dropzone" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                        <div style={ { width: '150px', height: '150px' } }>
                            <img alt="profile" style={ { position: 'absolute', height: '150px', width: '150px' } } src={ this.state.image } />
                            { this.state.allowChange && this.state.hover &&  
                                <div style={{ width: '150px', position: 'absolute', height: '30px', bottom: '2px', textAlign: "center" }}>
                                    { translate('CHANGE_PROFILE_PICTURE') }
                                </div>
                            }
                        </div> 
                </Dropzone>
        );
    }
}  
