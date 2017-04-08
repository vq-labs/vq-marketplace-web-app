import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

const defaultConfigsFields = [
    {
        key: 'NAME',
        label: 'Marketplace name'
    },
    {
        key: 'LOGO_URL',
        label: 'Marketplace logo'
    },
    {
        key: 'PROMO_URL',
        label: 'Marketplace promo'
    }
];

export default class SectionBasics extends React.Component {
    constructor() {
        super();
        this.state = { 
            meta: {} 
        };
    }

    componentDidMount() {
        apiConfig.appConfig.getItems().then(meta => {
            return this.setState({ meta });
        });
    }

    render() {
        return (
            <div className="row">
                    <div className="col-xs-12">
                        <h1>Marketplace basics</h1>
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
