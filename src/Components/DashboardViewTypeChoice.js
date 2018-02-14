import React, { Component } from 'react';
import USER_TYPES from '../constants/USER_TYPES';
import ViewTypeChoice from '../Components/ViewTypeChoice';
import { CONFIG } from '../core/config';
export default class DashboardViewTypeChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dashboardType: props.dashboardType,
            viewType: props.selected
        };

        this.changeViewType = this.changeViewType.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            dashboardType: nextProps.dashboardType
        });
    }

    changeViewType(viewType) {
        this.setState({
            viewType
        });

        this.props.onSelect(viewType);
    }

    render() {
        const VIEW_TYPES = {};

        /**
         * DEMAND SIDE
         * Has two dashboards: listing dashboard and request dashboard
         */
        if (this.props.userType === USER_TYPES.DEMAND) {
            if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
                VIEW_TYPES.SENT_REQUESTS_PENDING = 'SENT_REQUESTS_PENDING';
            }

            if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
                VIEW_TYPES.LISTINGS_POSTED = 'LISTINGS_POSTED';
            }

            VIEW_TYPES.ORDERS_IN_PROGRESS = 'ORDERS_IN_PROGRESS';
            VIEW_TYPES.ORDERS_COMPLETED = 'ORDERS_COMPLETED';
        }

        /**
         * SUPPLY SIDE
         * Has two dashboards: listing dashboard and request dashboard
         * 
         * We have not really figured out the design here when both supply and demand mode is on (@todo)
         */
        if (this.props.userType === USER_TYPES.SUPPLY) {
            if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
                VIEW_TYPES.OFFER_LISTINGS_POSTED = 'OFFER_LISTINGS_POSTED';
            }

            if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
                VIEW_TYPES.SENT_REQUESTS_PENDING = 'SENT_REQUESTS_PENDING';
            }

            VIEW_TYPES.SENT_REQUESTS_ACCEPTED = 'SENT_REQUESTS_ACCEPTED';
            VIEW_TYPES.SENT_REQUESTS_SETTLED= 'SENT_REQUESTS_SETTLED';
        }

        return (
            <div>
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
