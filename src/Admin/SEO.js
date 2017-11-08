import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

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
                    header={'Social media'}
                    desc={'Connect your users with your social media channels. Clear the input field if you would like to remove the social media icon.'}
                    fields={socialMediaFields}
                />
            </div>
        );
    }
}
