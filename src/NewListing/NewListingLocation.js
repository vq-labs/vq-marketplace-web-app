import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import DOMPurify from 'dompurify';
import Address from '../Components/Address';
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import Autocomplete from 'react-google-autocomplete';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import { translate } from '../core/i18n';
import * as coreNavigation from '../core/navigation';
import { formatGeoResults } from '../core/util';
import { getConfigAsync } from '../core/config';

const COUNTRY_CODES = {
    DE: 'Deutschland',
    HU: 'Hungary',
    PL: 'Poland'
};

export default class NewListingAddress extends Component {
    constructor(props) {
        super();

        this.state = {};
    }

    componentDidMount() {
        getConfigAsync(config => this.setState({
            config,
            ready: true
        }));
    }

    render() {
     return <div className="row">
                {this.state.ready &&
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("NEW_LISTING_ADDRESS_HEADER")}</h1>
                                <p>{translate("NEW_LISTING_ADDRESS_DESC")}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-xs-12">
                                <Address
                                    location={this.props.location}
                                    onLocationChange={this.props.onLocationChange}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
    }
}
