import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

const browsingFields = [
    {
        type: 'bool',
        key: 'LISTINGS_VIEW_LIST',
        label: 'List'
    },
    {
        disabled: true,
        type: 'bool',
        key: 'LISTINGS_VIEW_GRID',
        label: 'Grid'
    },
    {
        type: 'bool',
        key: 'LISTINGS_VIEW_MAP',
        label: 'Map'
    },
    {
        selection: [
            { value: '2', label: 'List' },
            { value: '3', label: 'Map' }
        ],
        type: 'select',
        key: 'LISTINGS_DEFAULT_VIEW',
        label: 'Default browsing view'
    },
];

const newListingFields = [
    {
        disabled: true,
        type: 'bool',
        key: 'LISTING_TIMING_MODE',
        label: 'Should the listing be restricted to predefined days?',
        explanation: 'This option will enable a calendar and restrict the visibility of the listing according to its availibity.'
    }
];

export default class SectionListing extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {}
    render() {
        return (
            <div>
                <ConfigEdit
                    header={'Browse'}
                    desc={'Configure your browsing page.'}
                    fields={browsingFields}
                />

                <ConfigEdit
                    header={'Listing properties'}
                    desc={'Adapt the process of creating listings. Some of these options are only configurable once at the launch of a marketplace and may be only changed by the support team.'}
                    fields={newListingFields}
                />
            </div>
        );
    }
}
