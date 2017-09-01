import React, { Component } from 'react';
import ViewTypeChoice from '../Components/ViewTypeChoice';

export default class DashboardViewTypeChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewType: props.selected
        };

        this.changeViewType = this.changeViewType.bind(this);
    }

    componentDidMount() {
        
    }

    changeViewType(viewType) {
        this.setState({
            viewType
        });

        this.props.onSelect(viewType);
    }

    render() {
        const VIEW_TYPES = {};

        if (this.props.userType === 1) {
            VIEW_TYPES.LISTINGS_POSTED = 'LISTINGS_POSTED';
            VIEW_TYPES.ORDERS_IN_PROGRESS = 'ORDERS_IN_PROGRESS';
            VIEW_TYPES.ORDERS_COMPLETED = 'ORDERS_COMPLETED';
        }

        if (this.props.userType === 2) {
            VIEW_TYPES.SENT_REQUESTS_PENDING = 'SENT_REQUESTS_PENDING';
            VIEW_TYPES.SENT_REQUESTS_ACCEPTED = 'SENT_REQUESTS_ACCEPTED';
            VIEW_TYPES.SENT_REQUESTS_SETTLED= 'SENT_REQUESTS_SETTLED';
        }

        return (
            <div className="row">
                <ViewTypeChoice
                    halign="left"
                    viewTypes={VIEW_TYPES}
                    selected={this.state.viewType}
                    changeViewType={this.changeViewType}
                />
            </div>
        )
    }
}
