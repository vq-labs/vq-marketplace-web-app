import React from 'react';
import * as apiConfig from '../api/config';
import FILTER_DEFAULTS from '../constants/FILTER_DEFAULTS';
import COUNTRY_CODES from '../constants/COUNTRIES.js';
import ConfigEdit from './Components/ConfigEdit';

const geofilterFields = [
    {   
        type: 'bool',
        key: 'LISTING_GEOFILTER_ENABLED',
        label: 'Enable geolocation of listings?'
    },
    {
        selection: COUNTRY_CODES.map(_ => {
            return { value: _.value.toLowerCase(), label: _.label };
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
        default: FILTER_DEFAULTS.LISTING_PRICE_FILTER_MIN,
        label: 'Price filter (min. value)',
    },
    {
        type: 'number',
        key: 'LISTING_PRICE_FILTER_MAX',
        default: FILTER_DEFAULTS.LISTING_PRICE_FILTER_MAX,
        label: 'Price filter (max. value)',
    },
    {
        type: 'number',
        key: 'LISTING_PRICE_FILTER_STEP',
        default: FILTER_DEFAULTS.LISTING_PRICE_FILTER_STEP,
        label: 'By how much is the price to be incremented?',
    }
];

const rangeFields = [
    {
        type: 'bool',
        key: 'LISTING_RANGE_FILTER_ENABLED',
        label: 'Enable range filtering?'
    },
    {
        type: 'number',
        key: 'LISTING_RANGE_FILTER_DEFAULT_VALUE',
        default: FILTER_DEFAULTS.LISTING_RANGE_FILTER_DEFAULT_VALUE,
        label: 'What is the default radius of search in meters'
    },
    {
        type: 'number',
        key: 'LISTING_RANGE_FILTER_MIN',
        default: FILTER_DEFAULTS.LISTING_RANGE_FILTER_MIN,
        label: 'Range filter (min. radius in meters)',
    },
    {
        type: 'number',
        key: 'LISTING_RANGE_FILTER_MAX',
        default: FILTER_DEFAULTS.LISTING_RANGE_FILTER_MAX,
        label: 'Range filter (max. radius in meters)',
    },
    {
        type: 'number',
        key: 'LISTING_RANGE_FILTER_STEP',
        default: FILTER_DEFAULTS.LISTING_RANGE_FILTER_STEP,
        label: 'By how much is the range to be incremented?',
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

                <ConfigEdit
                    header={"Range filter"}
                    fields={rangeFields}
                />
            </div>
        );
    }
}
