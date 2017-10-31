import React, { Component } from 'react';
import Address from '../Components/Address';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';

export default class NewListingAddress extends Component {
    constructor(props) {
        super();

        this.state = {
            location: props.location || {}
        };
    }

    componentDidMount() {
        getConfigAsync(config => this.setState({
            config,
            ready: true
        }));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            location: nextProps.location
        });
    }

    render() {
     return <div className="row">
                {this.state.ready &&
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1 style={{
                                    color: this.state.config.COLOR_PRIMARY
                                }}>{translate("NEW_LISTING_ADDRESS_HEADER")}</h1>
                                <p>{translate("NEW_LISTING_ADDRESS_DESC")}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-xs-12">
                                <Address
                                    deriveOnly={true}
                                    countryRestriction={'hu'}
                                    location={this.state.location}
                                    onLocationChange={this.props.onLocationChange}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
    }
}
