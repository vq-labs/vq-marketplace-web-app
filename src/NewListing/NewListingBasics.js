import React, { Component } from 'react';
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import Autocomplete from 'react-google-autocomplete';
import { translate } from '../core/i18n';
import { formatGeoResults } from '../core/util';
import { CONFIG } from '../core/config';

export default class NewListingBasics extends Component {
    constructor(props) {
        super();

        const locationQueryString = props.location.value.formattedAddress;

        this.state = {
            title: props.title,
            description: props.description,
            location: props.location,
            locationQueryString
        };
    }

    componentDidMount() { }
    
    getRequiredStar(mode) {
        return Number(mode) === 2 ? '*' : '';
    }

    isEnabled(mode) {
        return Number(mode) !== 0;
    }

    render() {
     return <div className="row">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1 style={{color: CONFIG.COLOR_PRIMARY}}>
                                {this.props.listingType === 1 ? translate("NEW_LISTING_BASICS_HEADER") : translate("NEW_SUPPLY_LISTING_BASICS_HEADER")}
                            </h1>
                            <p>
                                {this.props.listingType === 1 ? translate("NEW_LISTING_BASICS_DESC") : translate("NEW_SUPPLY_LISTING_BASICS_DESC")}
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12">
                        {this.isEnabled(this.state.title.mode) &&
                            <div className="row">
                                <div className="col-xs-12">
                                    <h4 style={{color: CONFIG.COLOR_PRIMARY}}>{translate("LISTING_TITLE") + this.getRequiredStar(this.state.title.mode)}</h4>
                                    <TextField
                                        name="title"
                                        onChange={(ev, titleValue) => {
                                            const title = this.state.title;

                                            title.value = titleValue;

                                            this.setState({ title });

                                            this.props.onTitleChange(titleValue);
                                        }}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        value={this.state.title.value}
                                    />
                                </div>  
                            </div>
                        }
                        {this.isEnabled(this.state.description.mode) &&
                            <div className="row">
                                <div className="col-xs-12">
                                    <h4 style={{color: CONFIG.COLOR_PRIMARY}}>
                                        {translate("LISTING_DESCRIPTION") + this.getRequiredStar(this.state.description.mode)}
                                    </h4>
                                    <HtmlTextField 
                                        onChange={(ev, descriptionValue) => {
                                            const description = this.state.description;

                                            description.value = descriptionValue;

                                            this.setState({
                                                description
                                            });

                                            this.props.onDescriptionChange(descriptionValue);
                                        }}
                                        value={this.state.description.value} 
                                    />
                                </div>    
                            </div>
                        }
                        {Number(this.state.description.mode) === 1 &&
                            <div className="row">
                                <div className="col-xs-12">
                                    <h4>{translate("LOCATION") + this.getRequiredStar(this.state.location.mode)}</h4>
                                    <TextField id={'listing_location'}  name="location" style={{width: '100%'}}>
                                        <Autocomplete
                                            value={this.state.locationQueryString}
                                            onChange={(ev, locationQueryString) => this.setState({ locationQueryString })}
                                            style={{width: '100%'}}
                                            onPlaceSelected={place => {
                                                const locationValue = formatGeoResults([ place ])[0];
                                                const location = this.state.location;

                                                location.value = locationValue;
                                                
                                                const locationQueryString = locationValue.formattedAddress;

                                                this.setState({
                                                    locationQueryString,
                                                    virtual: false,
                                                    location
                                                });

                                                this.props.onLocationChange(locationValue);
                                            }}
                                            types={['(regions)']}
                                        />
                                    </TextField>
                                </div>   
                            </div>
                        } 
                        </div>
                    </div>
                </div>
            </div>
    }
}
