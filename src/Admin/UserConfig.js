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
        label: "Users can be both Supply or Demand. If disabled, users will have to choose one option at signup; if enabled, users can switch their roles from their avatar menu"
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
        label: "Supply users can specify their verifications on their account such as a photo of their personal ID",
        subFields: [
            {
                type: 'bool',
                key: 'USER_VERIFICATIONS_REQUIRED_FOR_SUPPLY',
                label: 'Mandatory?',
            },
        ]
    },
    {
        key: 'USER_VERIFICATIONS_ENABLED_FOR_DEMAND',
        type: "bool",
        label: "Demand users can specify their verifications on their account such as a photo of their personal ID",
        subFields: [
            {
                type: 'bool',
                key: 'USER_VERIFICATIONS_REQUIRED_FOR_DEMAND',
                label: 'Mandatory?',
            },
        ]
    },
    {
        type: 'single-image',
        key: 'USER_PROFILE_IMAGE_URL',
        label: 'Default user profile image (150px x 150px)',
        imageResolution: [ 150, 150 ]
    },
];

const userDashboardConfigFields = [
    {
        key: 'USER_HIDE_DECLINED_REQUESTS_TAB',
        type: "bool",
        label: "Hide declined requests tab from user's dashboard",
        explanation: "If you feel like showing declined requests in user's dashboard is having a negative impact, enable this option to hide it from their dashboard"
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
              <ConfigEdit
                    header={'User dashboard configuration'}
                    desc={''}
                    fields={userDashboardConfigFields}
                />

                <ConfigEdit
                    header={'Emails'}
                    desc={''}
                    fields={[
                        {
                            type: 'bool',
                            key: 'EMAILS_ENABLED',
                            label: 'Should the e-mails be sent to your users? (does not affect the welcome e-mail)'
                        }
                    ]}
                />
            </div>
        );
    }
}
