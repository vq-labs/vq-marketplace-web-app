import React from 'react';
import * as apiConfig from '../api/config';
import ConfigEdit from './Components/ConfigEdit';

const geofilterFields = [
    {   
        type: 'bool',
        key: 'LISTING_GEOFILTER_ENABLED',
        label: 'Enable geolocation of listings?'
    },
    {
        selection: [ "AT","BE","BG","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","GB" ].map(_ => {
            _ = _.toLowerCase();

            return { value: _, label: _ };
        }),
        type: 'select',
        key: 'LISTING_GEOFILTER_COUNTRY_RESTRICTION',
        label: 'Restrict filtering to one country'
    },
    {   
        selection: [
            { value: 'address', label: 'address' },
            { value: 'cities', label: 'cities' },
            { value: 'coutries', label: 'coutries' },
            { value: 'regions', label: 'regions' }
        ],
        type: 'select',
        key: 'LISTING_GEOFILTER_MODE',
        label: 'Location filter mode (how exact should be the filtering?'
    }
];

const priceFields = [
    {   
        type: 'bool',
        key: 'LISTING_PRICE_FILTER_ENABLED',
        label: 'Enable price filtering?'
    },
    {
        type: 'number',
        key: 'LISTING_PRICE_FILTER_MIN',
        label: 'Price filter (min. value)',
    },
    {
        type: 'number',
        key: 'LISTING_PRICE_FILTER_MAX',
        label: 'Price filter (max. value)',
    },
    {
        type: 'number',
        key: 'LISTING_PRICE_FILTER_STEP',
        label: 'By how much is the price to be incremented?',
    }
];

export default class SectionFilters extends React.Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            meta: {} 
        };
    }

    componentDidMount() {
        apiConfig
        .appConfig
        .getItems()
        .then(config => {
            return this.setState({
                ready: true,
                config
            });
        });
    }

    render() {
        return (
            <div>
                <ConfigEdit
                    header={"Price filter"}
                    fields={priceFields}
                />

                <ConfigEdit
                    header={"Location filter"}
                    fields={geofilterFields}
                />
            </div>
        );
    }
}
