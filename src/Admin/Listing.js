import React from 'react';
import ConfigEdit from './Components/ConfigEdit';




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
        key: 'LISTING_RESTRICTED_POSTAL_CODES',
        type: "string",
        label: "(beta) Restricted postal codes",
        explanation: 'The 3-first digits of a postal code. If you would like to have many restricted postal codes, separate them with a comma.'
    }, {
        disabled: true,
        type: 'bool',
        key: 'LISTING_TIMING_MODE',
        label: 'Should the listing be restricted to predefined days?',
        explanation: 'This option will add a new section to a listing creation page and restrict the visibility of the listing according to its availibity.'
    }, {
        disabled: true,
        type: 'bool',
        key: 'LISTING_DURATION_MODE',
        label: 'Duration of listing enabled?',
        explanation: 'This option will add a new section to a listing creation page.'
    }, {
        disabled: true,
        type: 'bool',
        key: 'LISTING_IMAGES_MODE',
        label: 'Enable listings with images',
        explanation: 'This option will add a new section to a listing creation page and will allow to upload images for a listing.'
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
                    header={'"Browse" Page'}
                    desc={'Configure your browsing page. Choose which browsing views are available to the user.'}
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
