import React from 'react';
import ConfigEdit from './Components/ConfigEdit';

const defaultConfigsFields = [
    {
        disabled: true,
        type: 'bool',
        key: 'PRICING_HOURLY',
        label: 'Hourly pricing'
    }, {
        disabled: true,
        type: 'bool',
        key: 'PRICING_CONTRACT',
        label: 'Pricing per listing'
    }, {
        disabled: true,
        type: 'bool',
        key: 'PRICING_REQUEST',
        label: 'Pricing on request'
    }, {
        disabled: true,
        type: 'bool',
        key: 'PRICING_FREE',
        label: 'Free'
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
