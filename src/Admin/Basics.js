import React from 'react';
import ConfigEdit from './Components/ConfigEdit';
import LabelEdit from './Components/LabelEdit';
import LANGUAGES from '../constants/LANGUAGES';

const basicFields = [
    {
        type: 'string',
        key: 'NAME',
        label: 'Marketplace name',
        explanation: 'It is used on the landing page in the footer and in the emails as the sender name.'
    },
    {
        type: 'select',
        multiple: false,
        key: 'DEFAULT_LANG',
        label: 'Default marketplace language',
        selection: LANGUAGES
    },
    {
        type: 'select',
        multiple: true,
        key: 'LANGUAGES',
        label: 'Supported languages',
        selection: LANGUAGES
    },
    {
        disabled: true,
        type: 'select',
        multiple: true,
        key: 'PRICING_DEFAULT_CURRENCY',
        label: 'Default currency',
        selection: [
            { value: 'EUR', label: 'EUR' },
            { value: 'HUF', label: 'HUF' },
            { value: 'PLN', label: 'PLN' },
            { value: 'USD', label: 'USD' }
        ]
    }
];

const sloganFields = [
    {
        type: 'string',
        key: 'START_PAGE_HEADER',
        label: 'Slogan for Demand Side',
        explanation: 'Use the slogan to quickly tell visitors what your marketplace is about. "Buy food from locals" or "Get guitar lessons from a pro" are good examples.'
    },
    {
        type: 'string',
        key: 'START_PAGE_DESC',
        label: 'Description for Demand Side',
        explanation: 'Use the description to share your main value proposition. "FoodMarket is the easiest way to order directly from local providers" or "GuitarPro is the best place to find music teachers" are good examples.'
    },
    {
        type: 'string',
        key: 'START_PAGE_HEADER_SELLERS',
        label: 'Slogan for Supply Side',
        explanation: 'Use the slogan to quickly tell what your marketplace is about to the Providers/Sellers of your marketplace. "Share your food with locals" or "Offer your skills in Music" are good examples.'
    },
    {
        type: 'string',
        key: 'START_PAGE_DESC_SELLERS',
        label: 'Description for Supply',
        explanation: 'Use the description to specify what the Providers can get from the Marketplace. "Share your food with locals and build your personal food business" or "Offer your specific skill and start earning extra money" are good examples.'
    }
];

const otherFields = [
    {
        type: 'string',
        key: 'DOMAIN',
        label: 'What is your domain url? (with http or https)',
        explanation: 'It is used to build website paths in the emails. It must be specified for the e-mail actions routing to work correctly.'
    },
    {   
        selection: [
            { value: 'DD.MM.YY', label: 'DD.MM.YY' },
            { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
            { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD' },
            { value: 'YYYY.MM.DD.', label: 'YYYY.MM.DD.' },
            { value: 'YY.MM.DD', label: 'YY.MM.DD' },
            { value: 'YY.MM.DD.', label: 'YY.MM.DD.' },
            { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }
        ],
        type: 'select',
        key: 'DATE_FORMAT',
        label: 'Date format'
    },
    {
        selection: [
            { value: 'HH:mm', label: 'HH:mm' },
        ],
        type: 'select',
        key: 'TIME_FORMAT',
        label: 'Time format'
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
            <div>
                <ConfigEdit
                    header={'Marketplace Basics'}
                    desc={'Configure the basics of your marketplace.'}
                    fields={basicFields}
                />
                <LabelEdit
                    header={'Slogans'}
                    desc={'Slogans are shown on the homepage of the marketplace for the users who are not logged in.'}
                    fields={sloganFields}
                />
                <ConfigEdit
                    header={'Other details'}
                    desc={'Make it your own.'}
                    fields={otherFields}
                />
            </div>
        );
    }
}
