import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
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
                <Dropzone onDrop={this.props.onDrop} className="dropzone"  onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                        <div style={ { width: '150px', height: '150px'} }>
                            <img  alt="profile" style={ { position: 'absolute', height: '150px', width: '150px', borderRadius: '100%' } } src={ this.state.image } />
                        { this.state.allowChange && this.state.hover &&  
                            <div style={ { width: '150px', position: 'absolute', height: '30px', bottom: '30px', color: 'white', backgroundColor: 'black', textAlign: "center" } }>
                                    Change picture
                            </div>
                            }
                        </div> 
                </Dropzone>
        );
    }
}  
