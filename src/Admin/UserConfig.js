import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const userConfigFields = [
    {
        key: 'USER_ENABLE_SUPPLY_DEMAND_ACCOUNTS',
        type: "bool",
        label: "Users can be both Supply or Demand"
    }, {
        key: 'USER_REQUIRE_PHONE_NUMBER',
        type: "bool",
        label: "User need to specify phone number on sign-up"
    }
];

export default class SectionUserConfig extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <ConfigEdit
                    header={'User configuration'}
                    desc={''}
                    fields={userConfigFields}
                />
            </div>
        );
    }
}
