import React, { Component } from 'react';
import VIEW_TYPES from '../constants/VIEW_TYPES';
import ViewTypeChoice from '../Components/ViewTypeChoice';
import { getConfigAsync } from '../core/config';

export default class OfferViewTypeChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewType: props.selected
        };

        this.changeViewType = this.changeViewType.bind(this);
    }

    componentDidMount() {
        getConfigAsync(config => {
            const viewTypes = {};

            Object.keys(VIEW_TYPES)
            .forEach(viewType => {
                if (viewType === 'GRID' && config.LISTINGS_VIEW_GRID === '1') {
                    viewTypes[viewType] = VIEW_TYPES[viewType];

                    return;
                }
    
                if (viewType === 'LIST' && config.LISTINGS_VIEW_LIST === '1') {
                    viewTypes[viewType] = VIEW_TYPES[viewType];

                    return;
                }
    
                if (viewType === 'MAP' && config.LISTINGS_VIEW_MAP === '1') {
                    viewTypes[viewType] = VIEW_TYPES[viewType];

                    return;
                }
            });

            this.setState({
                viewTypes
            });
        });
    }

    changeViewType(viewType) {
        this.setState({
            viewType
        });

        this.props.onSelect(viewType);
    }

    render() {
        return (
            <div className="row pull-right">
                {this.state.viewTypes &&
                    <ViewTypeChoice 
                        viewTypes={this.state.viewTypes}
                        selected={this.state.viewType}
                        changeViewType={this.changeViewType}
                    />
                }
            </div>
        )
    }
}
