import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

const fields = [
    {
        type: 'string',
        key: 'GOOGLE_ANALYTICS_ID',
        label: 'Google Analytics Tracking ID',
        explanation: 'Tracking ID of your Google Analytics account. <a target="_blank" href="https://vqlabs.freshdesk.com/solution/articles/33000212285-how-to-track-your-marketplace-traffic-with-google-analytics">Read more about connecting Google Analytics</a>.'
    }
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <div>
                <ConfigEdit
                    header={'Analytics'}
                    desc={'Gathering traffic information on who visits your marketplace and how they browse is the key to grow your project.'}
                    fields={fields}
                />
            </div>
        );
    }
}
