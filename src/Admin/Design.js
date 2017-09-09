import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'color',
        key: 'COLOR_PRIMARY',
        label: 'Primary color'
    }, 
    /** @TODO {
        type: 'color',
        key: 'COLOR_SECONDARY',
        label: 'Secondary color'
    }
    */
];

export default class SectionBasics extends React.Component {
    render() {
        return (
            <ConfigEdit
                header={'Marketplace CI'}
                desc={'Corporate identity of your marketplace.'}
                fields={defaultConfigsFields}
            />
        );
    }
}
