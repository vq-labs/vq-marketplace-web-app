import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

const defaultConfigsFields = [
    {
        key: 'NAME',
        label: 'Marketplace name'
    },
    {
        key: 'DOMAIN',
        label: 'What is your domain url? (with http or https)'
    },
    {
        key: 'LOGO_URL',
        label: 'Marketplace logo'
    },
    {
        key: 'PROMO_URL',
        label: 'Marketplace promo'
    },
    {
        key: 'SOCIAL_FB_USERNAME',
        label: 'Facebook username'
    },
    {
        key: 'COMPANY_NAME_SHORT',
        label: 'Short version of company name (will be included in landing page)'
    },
    {
        key: 'COMPANY_NAME',
        label: 'What is your company name? (will be included in emails and impressum)'
    },
    {
        key: 'COMPANY_ADDRESS',
        label: 'What is your company address? (will be included in emails and impressum)'
    },
    {
        key: 'COMPANY_CEO',
        label: 'Who is the CEO of your company? (will be included in emails and impressum)'
    },
    {
        key: 'COMPANY_URL',
        label: 'Company website (will be included in landing page, emails and impressum)'
    },
];

export default class SectionBasics extends React.Component {
    constructor() {
        super();
        this.state = { 
            meta: {} 
        };
    }

    componentDidMount() {
        apiConfig.appConfig.getItems()
        .then(meta => {
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
