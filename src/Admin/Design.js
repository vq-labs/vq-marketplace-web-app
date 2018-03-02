import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'color',
        key: 'COLOR_PRIMARY',
        label: 'Primary color',
        explanation: 'You can change the main color of the user interface by entering a hex color value. ColorPicker.com can help you choose the color and give you the hex color code. You can then copy the code here.'
    },
    {
        type: 'bool',
        key: 'APP_FOOTER_VISIBLE',
        label: 'App footer',
        explanation: 'Should display footer? (It will only affect the marketplace, not the landing page)'
    },
    /** @TODO {
        type: 'color',
        key: 'COLOR_SECONDARY',
        label: 'Secondary color'
    }
    */
];

const coverPhotoFields = [
    {
        type: 'single-image',
        key: 'SEO_FAVICON_URL',
        label: 'Favicon (32px x 32px)',
        explanation: 'Favicons are the little piece of graphic that represents your brand on browser tabs, bookmark lists, search history, search ads and even search results.',
        imageResolution: [ 32, 32 ]
    },
    {
        type: 'single-image',
        key: 'LOGO_URL',
        label: 'Marketplace logo (recommended size: 284px x 100px)',
        // any logo size is supported now as every marketplace owner has different logo and they all open ticket requests
        // imageResolution: [ 100 * 2.84, 100 ]
    },
    {
        type: 'single-image',
        key: 'PROMO_URL',
        label: 'Marketplace promo for demand side (1280px x 850px)',
        imageResolution: [ 1280, 850 ]
    },
    {
        type: 'single-image',
        key: 'PROMO_URL_SELLERS',
        label: 'Marketplace promo for supply side (1280x850px)',
        imageResolution: [ 1280, 850 ]
    }, {
        type: 'single-image',
        key: 'PROMO_URL_MARKETPLACE_BROWSE',
        label: 'Cover image for the marketplace browsing page (1280x140px)',
        imageResolution: [ 1280, 140 ]
    }
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <div>
                <ConfigEdit
                    header={'Marketplace Colors'}
                    desc={'Change the color of the action buttons, headers etc.'}
                    fields={defaultConfigsFields}
                />
                <ConfigEdit
                    header={'Cover photos'}
                    desc={'The cover photos are shown in the homepage for non-logged-in users. Image size should be <b>1280px x 850px</b> pixels. Read more about <a target="_blank" href="https://vqlabs.freshdesk.com/solution/articles/33000212959-configure-the-cover-photos-and-logo">Cover photos</a>.'}
                    fields={coverPhotoFields}
                />
            </div>
        )    
    }
}
