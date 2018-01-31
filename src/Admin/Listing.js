import React from 'react';
import ConfigEdit from './Components/ConfigEdit';
import USER_TYPES from '../constants/USER_TYPES';

const listingSettingsFields = [
    {
        type: 'bool',
        key: 'LISTING_ENABLE_PUBLIC_VIEW',
        label: 'Enable listings to be viewed without registration'
    },
    {
        type: 'select',
        key: 'LISTING_PUBLIC_VIEW_MODE',
        default: '1',
        label: 'Default listing type to show to the public',
        selection: [
            { value: "1", label: 'Supply Listings' },
            { value: "2", label: 'Demand Listings' }
        ]
    }
];

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
    }
];

const workflowFields = [
  {
        condition: {
          key: 'USER_TYPE_DEMAND_LISTING_ENABLED',
          value: "1"
        },
        type: 'bool',
        key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS',
        label: 'Enable task workflow of the demand listings',
        subFields: [
          {
            type: 'bool',
            key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REQUEST_STEP_ENABLED',
            label: 'Request Step',
            explanation: 'Enable the step on task where the supply makes a request (an offer) on a demand listing. The demand will have to confirm (or cancel) the request',
            subFields: [
              {
                  type: 'bool',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REQUEST_STEP_MULTIPLE_REQUESTS_ENABLED',
                  label: 'Supply side can send multiple requests for the same demand listing.'
              }
            ]
          },
          {
            type: 'bool',
            key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_BOOKING_STEP_ENABLED',
            label: 'Booking Step',
            explanation: 'Enable the step on task where the demand books the offer of the supply side',
          },
          {
            type: 'bool',
            key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_ENABLED',
            label: 'Complete Step',
            explanation: 'Enable the step on task where the demand and the supply marks the task as complete',
            subFields: [
                {
                  type: 'bool',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_MANDATORY_FOR_SUPPLY',
                  label: 'Completion of supply side is required'
                },
                {
                  type: 'bool',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_MANDATORY_FOR_DEMAND',
                  label: 'Completion of demand side is required'
                },
              {
                  selection: [
                      { value: String(USER_TYPES.ANY), label: 'Any' },
                      { value: String(USER_TYPES.DEMAND), label: 'Demand' },
                      { value: String(USER_TYPES.SUPPLY), label: 'Supply' }
                  ],
                  type: 'select',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_COMPLETE_STEP_FIRST_SIDE_TO_COMPLETE',
                  label: 'Choose a side to enforce to mark the task as complete first'
              },
            ]
          },
          {
            type: 'bool',
            key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED',
            label: 'Review Step',
            explanation: 'Enable the step on task where the demand and the supply leave reviews for each other',
            subFields: [
                {
                  type: 'bool',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_MANDATORY_FOR_SUPPLY',
                  label: 'Completion of supply side is required'
                },
                {
                  type: 'bool',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_MANDATORY_FOR_DEMAND',
                  label: 'Review of demand side is required'
                },
                {
                  type: 'bool',
                  key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS',
                  label: 'Reviews should be provided by both sides. If not provided by both sides, the review will not be visible on neither of their profiles'
                }
            ]
          }
        ]
    },
  {
    condition: {
      key: 'LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS',
      value: '1'
    },
    type: 'hr'
  },
  {
      condition: {
          key: 'USER_TYPE_SUPPLY_LISTING_ENABLED',
          value: "1"
      },
      type: 'bool',
      key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS',
      label: 'Enable task workflow of the supply listings',
      subFields: [
        {
          type: 'bool',
          key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REQUEST_STEP_ENABLED',
          label: 'Request Step',
          explanation: 'Enable the step on task where the demand makes a request on a supply listing. The supply will have to confirm (or cancel) the request',
          subFields: [
            {
                type: 'bool',
                key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REQUEST_STEP_MULTIPLE_REQUESTS_ENABLED',
                label: 'Demand side can send multiple requests for the same supply listing.'
            }
          ]
        },
        {
          type: 'bool',
          key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_BOOKING_STEP_ENABLED',
          label: 'Booking Step',
          explanation: 'Enable the step on task where the demand books the offer of the supply side',
        },
        {
          type: 'bool',
          key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_ENABLED',
          label: 'Complete Step',
          explanation: 'Enable the step on task where the demand and the supply marks the task as complete',
          subFields: [
              {
                type: 'bool',
                key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_MANDATORY_FOR_SUPPLY',
                label: 'Completion of supply side is required'
              },
              {
                type: 'bool',
                key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_MANDATORY_FOR_DEMAND',
                label: 'Completion required by demand'
              },
              {
                  selection: [
                      { value: String(USER_TYPES.ANY), label: 'Any' },
                      { value: String(USER_TYPES.DEMAND), label: 'Demand' },
                      { value: String(USER_TYPES.SUPPLY), label: 'Supply' }
                  ],
                  type: 'select',
                  key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_COMPLETE_STEP_FIRST_SIDE_TO_COMPLETE',
                  label: 'Choose a side to enforce to mark the task as complete first'
              },
          ]
        },
        {
          type: 'bool',
          key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED',
          label: 'Review Step',
          explanation: 'Enable the step on task where the demand and the supply leave reviews for each other',
          subFields: [
              {
                type: 'bool',
                key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_MANDATORY_FOR_SUPPLY',
                label: 'Review of supply side is required'
              },
              {
                type: 'bool',
                key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_MANDATORY_FOR_DEMAND',
                label: 'Review of demand side is required'
              },
              {
                type: 'bool',
                key: 'LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS',
                label: 'Reviews should be provided by both sides. If not provided by both sides, the review will not be visible on neither of their profiles'
              }
          ]
        }
      ]
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
                    header={'Listing settings'}
                    fields={listingSettingsFields}
                />

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

              <ConfigEdit
                    header={'Workflow properties'}
                    desc={'Manage the workflow of listings.'}
                    fields={workflowFields}
                />
            </div>
        );
    }
}
