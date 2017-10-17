import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import { translate } from '../core/i18n';
import * as DEFAULTS from '../constants/DEFAULTS';


import '../App.css';

export default class ProfileImage extends Component {
    constructor(props) {
        super();

        this.state = {
            isLoading: Boolean(props.isLoading),
            hover: false,
            image: props.imageUrl || DEFAULTS.PROFILE_IMG_URL,
            allowChange: props.allowChange || false
        };

        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }
    mouseOver() {
        this.setState({
            hover: true
        });
    }
    mouseOut() {
        this.setState({ 
            hover: false
        });
    }
    componentWillReceiveProps(nextProps) {
        
        this.setState({
            isLoading: Boolean(nextProps.isLoading), 
            image: nextProps.imageUrl || DEFAULTS.PROFILE_IMG_URL,
            allowChange: nextProps.allowChange
        });
    }
    render() {
        return (
            <Dropzone 
                disableClick={!this.state.allowChange} 
                onDrop={this.props.onDrop} 
                style={{
                    margin: '0 auto',
                    cursor: this.state.allowChange ? 'pointer' : ''
                }} 
                className="st-profile-dropzone" 
                onMouseOver={this.mouseOver}
                onMouseOut={this.mouseOut}
            >
                    { this.state.isLoading &&
                        <div className="text-center" style={{ marginTop: 20 }}>
                            <CircularProgress />
                        </div>
                    }
                    { !this.state.isLoading &&
                        <div style={{
                            margin: '0 auto',
                            width: '150px',
                            height: '150px' 
                        }}>
                            <img alt="profile" style={{
                                 margin: '0 auto',
                                 height: '150px',
                                 width: '150px',
                                 borderRadius: '100%'
                            }} src={this.state.image} />
                            { this.state.allowChange && this.state.hover &&  
                                <div style={{ position: 'absolute', width: '150px', height: '30px', top: '170px', bottom: '2px', textAlign: "center" }}>
                                    { translate('CHANGE_PROFILE_PICTURE') }
                                </div>
                            }
                        </div>
                    }
            </Dropzone>
        );
    }
}  
