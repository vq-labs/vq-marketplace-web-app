import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'string',
        key: 'CUSTOM_CONTACT_PAGE_URL',
        label: 'Contact Page URL',
        explanation: 'If filled, users will see "Contact"-Link in the footer. You can create your custom contact page <a href="https://www.typeform.com/" target="_blank">here</a>.'
    },
    {
        type: 'string',
        key: 'CUSTOM_BLOG_PAGE_URL',
        label: 'Blog Page URL',
        explanation: 'If filled, users will see "Blog"-Link in the footer. You can create your custom blog <a href="http://wixstats.com/?a=15982&c=391&s1=" target="_blank">here</a>.'
    },
    {
        type: 'string',
        key: 'CUSTOM_HOW_IT_WORKS_URL',
        label: 'How it works URL',
        explanation: 'Walk your users through the whole process.'
    },
    {
        type: 'string',
        key: 'CUSTOM_FAQ_URL',
        label: 'FAQ URL',
        explanation: 'Every marketplace needs to have a FAQ section.'
    },
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <ConfigEdit
                header={'Custom pages'}
                desc={'Integrate your marketplace with custom pages and other websites.'}
                fields={defaultConfigsFields}
            />
        );
    }
}
