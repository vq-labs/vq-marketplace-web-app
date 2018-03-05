import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'string',
        key: 'SEO_TITLE',
        label: 'Title',
        explanation: 'Meta title helps you rank for a keyword and should make the user want to click to your page.'
    },
    {
        type: 'string',
        key: 'SEO_DESCRIPTION',
        label: 'Description',
        explanation: 'Meta descriptions can be any length, but search engines generally truncate snippets longer than 160 characters'
    },
    {
        type: 'string',
        key: 'SEO_KEYWORDS',
        label: 'Keywords',
        explanation: 'Meta keywords should be seperated by a comma'
    },
    {
        type: 'single-image',
        key: 'SEO_IMAGE',
        label: 'Marketplace image for social media (1200x630px recommended)',
        imageResolution: [ 1200, 630 ]
    }
];

const socialMediaFields = [
    {
        type: 'string',
        key: 'SOCIAL_FB_USERNAME',
        label: 'Facebook username'
    },
    {
        type: 'string',
        key: 'SOCIAL_TWITTER_USERNAME',
        label: 'Twitter username'
    },
    {
        type: 'string',
        key: 'SOCIAL_INSTAGRAM_USERNAME',
        label: 'Instagram username'
    },
    {
        type: 'string',
        key: 'SOCIAL_YOUTUBE_USERNAME',
        label: 'Youtube username'
    },
    {
        type: 'string',
        key: 'SOCIAL_GITHUB_USERNAME',
        label: 'Github username'
    }
];

const analyticsFields = [
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
                    header={'Search engines'}
                    desc={'Define how you appear in search results.'}
                    fields={defaultConfigsFields}
                />
                <ConfigEdit
                    header={'Analytics'}
                    desc={'Gathering traffic information on who visits your marketplace and how they browse is the key to grow your project.'}
                    fields={analyticsFields}
                />
                <ConfigEdit
                    header={'Social media'}
                    desc={'Connect your users with your social media channels. Clear the input field if you would like to remove the social media icon.'}
                    fields={socialMediaFields}
                />
            </div>
        );
    }
}
