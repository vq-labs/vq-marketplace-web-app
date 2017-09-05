import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'string',
        key: 'NAME',
        label: 'Marketplace name'
    },
    {
        type: 'string',
        key: 'DOMAIN',
        label: 'What is your domain url? (with http or https)'
    },
    {
        type: 'single-image',
        key: 'LOGO_URL',
        label: 'Marketplace logo'
    },
    {
        type: 'single-image',
        key: 'PROMO_URL',
        label: 'Marketplace promo for buyers/clients'
    },
    {
        type: 'single-image',
        key: 'PROMO_URL_SELLERS',
        label: 'Marketplace promo for sellers/taskers'
    },
    {
        type: 'string',
        key: 'SOCIAL_FB_USERNAME',
        label: 'Facebook username'
    },
    {
        type: 'string',
        key: 'COMPANY_NAME_SHORT',
        label: 'Short version of company name (will be included in landing page)'
    },
    {
        type: 'string',
        key: 'COMPANY_NAME',
        label: 'What is your company name? (will be included in emails and impressum)'
    },
    {
        type: 'string',
        key: 'COMPANY_ADDRESS',
        label: 'What is your company address? (will be included in emails and impressum)'
    },
    {
        type: 'string',
        key: 'COMPANY_CEO',
        label: 'Who is the CEO of your company? (will be included in emails and impressum)'
    },
    {
        type: 'string',
        key: 'COMPANY_URL',
        label: 'Company website (will be included in landing page, emails and impressum)'
    }
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <ConfigEdit
                fields={defaultConfigsFields}
            />
        );
    }
}
