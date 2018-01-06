import React, { Component } from 'react';
import ImageUploader from '../Components/ImageUploader';
import { CONFIG } from '../core/config';
import { translate } from '../core/i18n';

export default class NewListingImages extends Component {
    constructor(props) {
        super();
        
        this.state = {
            images: props.images || []
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        this.setState({
            images: nextProps.images
        });
    }

    render() {
        return <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
            <div className="row">
                <div className="col-xs-12">
                    <h1 style={{ color: CONFIG.COLOR_PRIMARY }}>{translate("NEW_LISTING_PHOTO_HEADER")}</h1>
                    <p className="text-muted">{translate("NEW_LISTING_PHOTO_DESC")}</p>
                </div>
            </div>
            <hr />
            <div className="row">
                <ImageUploader 
                    images={this.state.images} 
                    onChange={images => {
                        this.setState({
                            images
                        });

                        this.props.onChange(images);
                    }}
                />
            </div>
        </div>;
    }
}
