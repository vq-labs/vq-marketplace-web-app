import React from 'react';
import * as apiConfig from '../api/config';
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
        explanation: 'Demand side will be able insert "I am searching for / Ill buy" and supply side would be able to send requests for those listings',
    },
    {
        type: 'bool',
        key: 'USER_TYPE_SUPPLY_LISTING_ENABLED',
        label: 'Enable "Supply" listings',
        explanation: 'Supply side will be able to offer services / products / things to rent.',
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
                    header={"Login for users"}
                    fields={userTypeFields}
                />

                <ConfigEdit
                    header={"Allowed actions"}
                    desc={"There are two listings types: 'Request Listings' and 'Offer Listings'."}
                    fields={userTypeActions}
                />
            </div>
        );
    }
}
