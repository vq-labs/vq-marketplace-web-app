import React from 'react';
import ConfigEdit from '../Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'color',
        key: 'COLOR_PRIMARY',
        label: 'Primary color'
    }, {
        type: 'color',
        key: 'COLOR_SECONDARY',
        label: 'Secondary color'
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
