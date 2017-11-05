import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

const defaultConfigsFields = [
    {
        disabled: true,
        type: 'bool',
        key: 'PRICING_HOURLY',
        label: 'Hourly pricing'
    }, {
        disabled: true,
        type: 'bool',
        key: 'PRICING_CONTRACT',
        label: 'Pricing per listing'
    }, {
        disabled: true,
        type: 'bool',
        key: 'PRICING_REQUEST',
        label: 'Pricing on request'
    }
];

export default class SectionPricing extends React.Component {
    constructor() {
        super();
        this.state = { 
            meta: {} 
        };
    }

    componentDidMount() {
        apiConfig.appConfig.getItems()
        .then(meta => {
            return this.setState({
                meta
            });
        });
    }

    render() {
        return (
            <div className="row">
                    <div className="col-xs-12">
                        <h1>Pricing configuration</h1>
                        { this.state.meta &&
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
            </div>);
        }
}
