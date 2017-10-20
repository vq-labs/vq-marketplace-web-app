import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

const selection = [
    { value: 0, label: 'disabled' },
    { value: 1, label: 'optional' },
    { value: 2, label: 'required' }
];

const defaultConfigsFields = [
    {   
        selection,
        type: 'select',
        key: 'LISTING_CATEGORY_MODE',
        label: 'Listing category'
    },
    {
        selection,
        type: 'select',
        key: 'LISTING_TITLE_MODE',
        label: 'Listing title'
    },
    {
        selection,
        type: 'select',
        key: 'LISTING_DESCRIPTION_MODE',
        label: 'Listing description'
    },
    {
        selection,
        type: 'select',
        key: 'LISTING_LOCATION_MODE',
        label: 'Listing location'
    },
    {
        selection,
        type: 'select',
        key: 'LISTING_DATE_MODE',
        label: 'Listing date'
    },
    {
        selection,
        type: 'select',
        key: 'LISTING_PRICE_MODE',
        label: 'Listing price'
    },
    {
        selection,
        type: 'select',
        key: 'LISTING_IMAGES_MODE',
        label: 'Listing images'
    },
];

export default class SectionListing extends React.Component {
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
        .then(meta => {
            return this.setState({
                ready: true,
                meta
            });
        });
    }

    render() {
        return (
            <div className="row">
                    <div className="col-xs-12">
                        <h1>Listing config</h1>
                        <p>
                            Specify what attributes of listing are disabled, optional and required.
                        </p>
                        { this.state.ready &&
                            <EditableEntity
                                showCancelBtn={false}
                                value={this.state.meta} 
                                fields={defaultConfigsFields}
                                onConfirm={
                                    updatedEntity => {
                                        const updatedData = Object.keys(updatedEntity).map(fieldKey => {
                                            const mappedItem = {};

                                            mappedItem.fieldKey = fieldKey;
                                            mappedItem.fieldValue = updatedEntity[fieldKey];

                                            return mappedItem;
                                        });

                                        apiConfig.appConfig.createItem(updatedData);

                                        this.setState({ meta: updatedEntity })
                                    }
                                }
                            />
                        }
                </div>    
            </div>
        );
    }
}
