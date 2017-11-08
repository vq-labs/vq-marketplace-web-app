import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

const geofilterFields = [
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
            <div className="row">
                    <div className="col-xs-12">
                        <h1>Filters</h1>
                        <p>
                            Configure the filters for browsing listings.
                        </p>
                    </div>
                    <div className="col-xs-12">
                        <h3>Location filter</h3>
                            <EditableEntity
                                showCancelBtn={false}
                                value={this.state.config} 
                                fields={geofilterFields}
                                onConfirm={
                                    updatedEntity => {
                                        const updatedData = Object.keys(updatedEntity).map(fieldKey => {
                                            const mappedItem = {};

                                            mappedItem.fieldKey = fieldKey;
                                            mappedItem.fieldValue = updatedEntity[fieldKey];

                                            return mappedItem;
                                        });

                                        apiConfig
                                        .appConfig
                                        .createItem(updatedData);

                                        this.setState({
                                            config: updatedEntity
                                        });
                                    }
                                }
                            />
                </div>    
            </div>
        );
    }
}
