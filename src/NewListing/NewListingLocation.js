import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import DOMPurify from 'dompurify'
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import Autocomplete from 'react-google-autocomplete';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import { translate } from '../core/i18n';
import * as coreNavigation from '../core/navigation';
import { formatGeoResults } from '../core/util';

const COUNTRY_CODES = {
    DE: 'Deutschland',
    HU: 'Hungary'
};

export default class NewListingAddress extends Component {
    constructor(props) {
        super();

        let locationQueryString = '';

        if (props.location.street)
            locationQueryString += props.location.street;

        if (props.location.streetNumber)
            locationQueryString += ` ${props.location.streetNumber}`;

        this.state = {
            countryRestriction: props.countryRestriction,
            locationQueryString: locationQueryString,
            countryCode: props.location.countryCode || 'DE',
            street: props.location.street,
            streetNumber: props.location.streetNumber,
            formattedAddress: props.location.formattedAddress,
            addressAddition: props.location.addressAddition,
            city: props.location.city,
            postalCode: props.location.postalCode,
            lat: props.location.lat,
            lng: props.location.lng
        };
    }

    componentDidMount() {
       
    }
    
    getRequiredStar(mode) {
        return Number(mode) === 2 ? '*' : '';
    }

    isEnabled(mode) {
        return Number(mode) !== 0;
    }

    onAddressFieldChange(fieldKey) {
        return (ev, newValue) => {
            const location = this.state;
            
            location[fieldKey] = newValue;

            this.setState(location);

            this.props.onLocationChange(location);
        };
    }

    render() {
     return <div className="row">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>{translate("NEW_LISTING_ADDRESS_HEADER")}</h1>
                            <p>{translate("NEW_LISTING_ADDRESS_DESC")}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-12">
                                        <h4>{translate("LOCATION_COUNTRY") + '*'}</h4>
                                        <TextField
                                            name="countryCode"
                                            onChange={this.onAddressFieldChange('countryCode')}
                                            style={{width: '100%'}}
                                            inputStyle={{width: '100%'}}
                                            value={this.state.countryCode}
                                        />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <h4>{translate("LOCATION_STREET") + '*'}</h4>
                                    <TextField id={'listing_location'}  name="location" style={{width: '100%'}}>
                                        <Autocomplete
                                            value={this.state.locationQueryString}
                                            onChange={(ev, locationQueryString) => this.setState({ locationQueryString, street: locationQueryString })}
                                            style={{width: '100%'}}
                                            componentRestrictions={{country: this.state.countryRestriction}}
                                            onPlaceSelected={place => {
                                                const locationValue = formatGeoResults([ place ])[0];
                                                let locationQueryString = '';

                                                if (locationValue.route)
                                                    locationQueryString += locationValue.route;

                                                if (locationValue.streetNumber)
                                                    locationQueryString += ` ${locationValue.streetNumber}`;

                                                const location = {
                                                    locationQueryString,
                                                    postalCode: locationValue.postalCode,
                                                    countryCode: locationValue.countryCode,
                                                    city: locationValue.city,
                                                    addressAddition: this.state.addressAddition,
                                                    street: locationValue.route,
                                                    streetNumber: locationValue.streetNumber,
                                                    lat: locationValue.lat,
                                                    lng: locationValue.lng
                                                };

                                                this.setState(location);

                                                this.props.onLocationChange(location);
                                            }}
                                            types={[ 'address' ]}
                                        />
                                    </TextField>
                                </div>   
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                        <h4>{translate("LOCATION_ADDRESS_ADDITION")}</h4>
                                        <TextField
                                            name="addressAddition"
                                            onChange={this.onAddressFieldChange('addressAddition')}
                                            style={{width: '100%'}}
                                            inputStyle={{width: '100%'}}
                                            value={this.state.addressAddition}
                                        />
                                </div>  
                                <div className="col-xs-6">
                                    <h4>{translate("LOCATION_CITY") + '*'}</h4>
                                    <TextField
                                        name="city"
                                        onChange={this.onAddressFieldChange('city')}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        value={this.state.city}
                                    />
                                </div>
                                <div className="col-xs-6">
                                    <h4>{translate("LOCATION_POSTAL_CODE") + '*'}</h4>
                                    <TextField
                                        name="postalCode"
                                        onChange={this.onAddressFieldChange('postalCode')}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        value={this.state.postalCode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    }
}
