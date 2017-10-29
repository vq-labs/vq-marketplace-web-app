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
    },
    {
        type: 'single-image',
        key: 'SEO_FAVICON_URL',
        label: 'Favicon (32px x 32px)',
        explanation: 'Favicons are the little piece of graphic that represents your brand on browser tabs, bookmark lists, search history, search ads and even search results. (32px x 32px)',
        imageResolution: [ 32, 32 ]
    }
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <ConfigEdit
                header={'Marketplace SEO'}
                desc={'Define how you appear in search results.'}
                fields={defaultConfigsFields}
            />
        );
    }
}
