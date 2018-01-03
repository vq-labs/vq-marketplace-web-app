import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const userTypeFields = [
    {
        type: 'bool',
        key: 'USER_TYPE_SUPPLY_LOGIN_ENABLED',
        label: 'Supply user login enabled',
    },
    {
        type: 'bool',
        key: 'USER_TYPE_DEMAND_LOGIN_ENABLED',
        label: 'Demand user login enabled',
    },
    {
        type: 'bool',
        key: 'USER_TYPE_GENERAL_LOGIN_ENABLED',
        label: 'General user login enabled',
    },
    {
        type: 'bool',
        key: 'USER_TYPE_SUPPLY_DOCUMENT_REQUIRED',
        label: 'Require documents from Supply Type users?',
    },
    {
        type: 'bool',
        key: 'USER_TYPE_DEMAND_DOCUMENT_REQUIRED',
        label: 'Require documents from Demand Type users?',
    },
];

const userTypeActions = [
    {
        type: 'bool',
        key: 'USER_TYPE_DEMAND_LISTING_ENABLED',
        label: 'Enable "Demand" listings',
        explanation: 'The Demand side will be able insert demand listings for which the supply side would be able to send requests.',
    },
    {
        type: 'bool',
        key: 'USER_TYPE_SUPPLY_LISTING_ENABLED',
        label: 'Enable "Supply" listings',
        explanation: 'The Supply side will be able to create supply listings that can by booked by demand side.',
    }
];

export default class SectionUserTypes extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() { }

    render() {
        return (
            <div>
                <ConfigEdit
                    header={"Demand and Supply Model"}
                    desc={`Users and listings can be of both types: 'Demand' and 'Supply'. Read more about the <a href="https://vqlabs.freshdesk.com/solution/articles/33000212957-demand-supply-model" target="_blank">Demand and Supply Model</a>.`}
                    fields={userTypeActions}
                />
            </div>
        );
    }
}
