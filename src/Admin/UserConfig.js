import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const userConfigFields = [
    {
        type: 'bool',
        key: 'USER_ENABLE_PUBLIC_VIEW',
        label: 'Enable users to be viewed without registration'
    },
    {
        key: 'USER_ENABLE_SUPPLY_DEMAND_ACCOUNTS',
        type: "bool",
        label: "Users can be either Supply or Demand. If enabled, users will have to choose one option at signup"
    },
    {
        key: 'USER_REQUIRE_PHONE_NUMBER',
        type: "bool",
        label: "User need to specify phone number on sign-up"
    }
];

const userAccountConfigFields = [
    {
        key: 'USER_PREFERENCES_ENABLED_FOR_SUPPLY',
        type: "bool",
        label: "Supply users can specify their preferences on their account such as what type of category of listings they are interested in"
    },
    {
        key: 'USER_PREFERENCES_ENABLED_FOR_DEMAND',
        type: "bool",
        label: "Demand users can specify their preferences on their account such as what type of category of listings they are interested in"
    },
    {
        key: 'USER_DOCUMENTS_ENABLED_FOR_SUPPLY',
        type: "bool",
        label: "Supply users can specify their documents on their account such as a reference paper"
    },
    {
        key: 'USER_DOCUMENTS_ENABLED_FOR_DEMAND',
        type: "bool",
        label: "Demand users can specify their documents on their account such as a reference paper"
    },
    {
        key: 'USER_VERIFICATIONS_ENABLED_FOR_SUPPLY',
        type: "bool",
        label: "Supply users can specify their verifications on their account such as a photo of their personal ID"
    },
    {
        key: 'USER_VERIFICATIONS_ENABLED_FOR_DEMAND',
        type: "bool",
        label: "Demand users can specify their verifications on their account such as a photo of their personal ID"
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
              <ConfigEdit
                    header={'User account configuration'}
                    desc={''}
                    fields={userAccountConfigFields}
                />
            </div>
        );
    }
}
