import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const browsingFields = [
    {
        type: 'bool',
        key: 'LISTINGS_VIEW_LIST',
        label: 'List'
    },
    {
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
            { value: '1', label: 'Grid' },
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
    },
    {
        type: 'bool',
        key: 'LISTING_DESC_MODE',
        label: 'Enable Listing Basic details',
        explanation: 'This option will add a new section to a listing creation page and will allow to specify the title and description.'
    }, {
        type: 'bool',
        key: 'LISTING_TIMING_MODE',
        label: 'Enable Listing calendar',
        explanation: 'This option will add a calendar to a listing creation page and restrict the visibility of the listing according to its availibity.'
    }, {
        type: 'bool',
        key: 'LISTING_DURATION_MODE',
        label: 'Enable Listing Duration',
        explanation: 'This option will add a new section to a listing creation page.'
    }, {
        type: 'bool',
        key: 'LISTING_IMAGES_MODE',
        label: 'Enable Listing Images',
        explanation: 'This option will add a new section to a listing creation page and will allow to upload images for a listing.'
    },
    {
        type: 'bool',
        key: 'LISTING_PRICING_MODE',
        label: 'Enable Listing pricing',
        explanation: 'This option will add a new section to a listing creation page and will allow to specify the the price for a listing'
    },
    {
        type: 'bool',
        key: 'LISTING_QUANTITY_MODE',
        label: 'Enable Listing quantity',
        explanation: 'This option will add a new section to a listing creation page and will allow to specify the wholesale quantity'
    },
    {
        type: 'bool',
        key: 'LISTING_DISCUSSION_MODE',
        label: 'Enable Listing comments',
        explanation: 'Users will be able to comment under listings'
    }, 
    {
        type: 'bool',
        key: 'LISTING_GEOLOCATION_MODE',
        label: 'Enable Listing Geo-Location',
        explanation: 'Users will be able to specify the location of the listing'
    },
    {
        type: 'bool',
        key: 'LISTING_EDIT_ENABLED',
        label: 'Enable editing of listings after they have been published.'
    },
    {
        type: 'bool',
        key: 'MULTIPLE_REQUESTS_ENABLED',
        label: 'User can send multiple requests for the same listing.'
    },
    {
        type: 'bool',
        key: 'LISTING_TASK_WORKFLOW_ENABLED',
        label: 'Enable task workflow of the listings',
        explanation: 'Request received -> Request booked -> Market as done -> Done & Paid -> Reviewed'
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
