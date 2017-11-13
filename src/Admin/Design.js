import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'color',
        key: 'COLOR_PRIMARY',
        label: 'Primary color',
        explanation: 'You can change the main color of the user interface by entering a hex color value. ColorPicker.com can help you choose the color and give you the hex color code. You can then copy the code here.'
    }, {
        type: 'bool',
        key: 'APP_FOOTER_VISIBLE',
        label: 'App footer',
        explanation: 'Should display footer? (It will only affect the marketplace, not the landing page)'
    }
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
        label: 'Marketplace logo (284px x 100px)',
        imageResolution: [ 100 * 2.84, 100 ]
    },
    {
        type: 'single-image',
        key: 'PROMO_URL',
        label: 'Marketplace promo for clients/buyers (1280px x 850px are supported)',
        imageResolution: [ 1280, 850 ]
    },
    {
        type: 'single-image',
        key: 'PROMO_URL_SELLERS',
        label: 'Marketplace promo for providers/sellers (1280x850px are supported)',
        imageResolution: [ 1280, 850 ]
    }
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <div>
                <ConfigEdit
                    header={'Marketplace Colors'}
                    desc={'Corporate identity of your marketplace.'}
                    fields={defaultConfigsFields}
                />

                <ConfigEdit
                    header={'Cover photos'}
                    desc={'Corporate identity of your marketplace.'}
                    fields={coverPhotoFields}
                />
            </div>
        )    
    }
}
