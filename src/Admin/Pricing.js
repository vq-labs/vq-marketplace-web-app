import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const defaultConfigsFields = [
    {
        type: 'select',
        key: 'DEFAULT_PRICING_MODE',
        label: 'Default listing pricing',
        selection: [
            { value: "1", label: 'Price per Hour' },
            { value: "2", label: 'Price per Listing' },
            { value: "3", label: "Price per Unit" },
            { value: "4", label: 'Price on Request' }
        ]
    }
];

export default class SectionPricing extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <div className="row">
                <ConfigEdit
                    header={'Pricing'}
                    desc={'Specify how listings can be priced'}
                    fields={defaultConfigsFields}
                />
            </div>);
        }
}
