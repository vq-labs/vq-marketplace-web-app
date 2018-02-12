import React, {Component} from 'react';
import Bookings from '../Components/Bookings';
import Requests from '../Components/Requests';
import DashboardViewTypeChoice from '../Components/DashboardViewTypeChoice';
import Loader from "../Components/Loader";
import {translate} from '../core/i18n';
import {getUserAsync} from '../core/auth';
import {CONFIG} from '../core/config';
import {setQueryParams} from '../core/navigation';
import TASK_STATUS from '../constants/TASK_STATUS';
import {getParams} from '../core/util.js';
import {getMode} from '../core/user-mode.js';
import {getMeOutFromHereIfAmNotAuthorized} from '../helpers/user-checks';
import apiTask from '../api/task';
import {openDialog} from '../helpers/open-message-dialog.js';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';

const defaultViewTypes = {
  listings: "LISTINGS_PENDING",
  requests: "REQUESTS_PENDING"
};
export default class Dashboard extends Component {
  constructor(props) {
    super();

    const dashboardType = props.params.type;
    const viewType = getParams(location.search).viewType
    
    this.state = {
      dashboardType,
      viewType,
      isLoading: false,
      tasks: [],
      selectedTask: {
        requests: []
      }
    };

    this.onViewChange = this
      .onViewChange
      .bind(this);
  }

  componentDidMount() {
    getUserAsync(user => {
      if (getMeOutFromHereIfAmNotAuthorized(user)) {
        return;
      }

      const userMode = user.userType === 0
        ? getMode()
        : user.userType;
      let dashboardType = this.state.dashboardType;
      let viewType = this.state.viewType;
      let viewTypes = this.state.viewTypes;

      if (!dashboardType) {
        dashboardType = this.setDashboardType(userMode);
      }

      if (!viewTypes) {
        viewTypes = this.setViewTypes(dashboardType);
      }

      const newState = {
        userMode,
        isLoading: false,
        ready: true,
        userType: user.userType,
        dashboardType,
        viewType: this.state.viewType || defaultViewTypes[dashboardType],
        viewTypes
      };

      setQueryParams(newState, ['viewType']);
      this.setState(newState);

    }, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.type && nextProps.params.type !== this.state.dashboardType) {
      const newState = {
        dashboardType: nextProps.params.type,
        viewType: defaultViewTypes[nextProps.params.type],
        viewTypes: this.setViewTypes(nextProps.params.type)
      };
      this.setState(newState);
      setQueryParams(newState, ['viewType']);   
    }
  }

  onViewChange(viewType) {
    const newState = {
      viewType
    };

    setQueryParams(newState, ['viewType']);
    this.setState(newState);
  }

  setDashboardType(userMode) {
    switch (Number(userMode)) {
      case 1: // demand user
        if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
          return 'requests';
          break;
        }

        if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
          return 'listings';
          break;
        }

        break;
      case 2: //supply user
        if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
          return 'listings';
          break;
        }

        if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
          return 'requests';
          break;
        }

        break;
      default:
        return 'listings';
    }
  }

  setViewTypes(dashboardType) {
    switch (dashboardType) {
      case "listings":
        return {LISTINGS_PENDING: 'LISTINGS_PENDING', LISTINGS_IN_PROGRESS: 'LISTINGS_IN_PROGRESS', LISTINGS_COMPLETED: 'LISTINGS_COMPLETED', LISTINGS_CANCELED: 'LISTINGS_CANCELED'}

        break;
      case "requests":
        if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
          return {
            REQUESTS_PENDING: 'REQUESTS_PENDING',
            REQUESTS_ACCEPTED: 'REQUESTS_ACCEPTED',
            REQUESTS_IN_PROGRESS: 'REQUESTS_IN_PROGRESS',
            REQUESTS_COMPLETED: 'REQUESTS_COMPLETED',
            REQUESTS_CANCELED: 'REQUESTS_CANCELED',
            REQUESTS_DECLINED: 'REQUESTS_DECLINED'
          }
          break;
        }

        if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
          return {REQUESTS_PENDING: 'REQUESTS_PENDING', REQUESTS_IN_PROGRESS: 'REQUESTS_IN_PROGRESS', REQUESTS_SETTLED: 'REQUESTS_SETTLED', REQUESTS_CANCELED: 'REQUESTS_CANCELED', REQUESTS_DECLINED: 'REQUESTS_DECLINED'}
          break;
        }

        break;
      default:
        return {LISTINGS_PENDING: 'LISTINGS_PENDING', LISTINGS_IN_PROGRESS: 'LISTINGS_IN_PROGRESS', LISTINGS_COMPLETED: 'LISTINGS_COMPLETED', LISTINGS_CANCELED: 'LISTINGS_CANCELED'}
    }
  }

  render() {
    return (
      <div className="container vq-no-padding">
        {this.state.ready && <div className="col-xs-12">
          <div className="row vq-margin-top-bottom">
            <div className="col-xs-12 vq-margin-top-bottom">
              <DashboardViewTypeChoice
                halign="left"
                viewType={this.state.viewType}
                changeViewType={this.onViewChange}
                viewTypes={this.state.viewTypes}/>
            </div>
          </div>

          {this.state.viewType === 'LISTINGS_PENDING' && <div className="row vq-margin-top-bottom">
            <Bookings
              status={TASK_STATUS.ACTIVE}
              properties={{
              statusText: false,
              editButton: true,
              cancelButton: true,
              requestsButton: true,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'LISTINGS_IN_PROGRESS' && <div className="row vq-margin-top-bottom">
            <Bookings
              status={TASK_STATUS.BOOKED}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              requestsButton: false,
              bookingDetails: true,
              markAsDoneButton: true,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'LISTINGS_COMPLETED' && <div className="row vq-margin-top-bottom">
            <Bookings
              status={TASK_STATUS.COMPLETED}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              requestsButton: false,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: true
            }}/>
          </div>
}

          {this.state.viewType === 'LISTINGS_CANCELED' && <div className="row vq-margin-top-bottom">
            <Bookings
              status={[TASK_STATUS.INACTIVE, TASK_STATUS.SPAM]}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              requestsButton: false,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'REQUESTS_PENDING' && <div className="row vq-margin-top-bottom">
            <Requests
              status={REQUEST_STATUS.PENDING}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: true,
              requestsButton: false,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'REQUESTS_ACCEPTED' && <div className="row vq-margin-top-bottom">
            <Requests
              status={REQUEST_STATUS.ACCEPTED}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: true,
              bookButton: true,
              requestsButton: false,
              bookingDetails: true,
              markAsDoneButton: false,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'REQUESTS_IN_PROGRESS' && <div className="row vq-margin-top-bottom">
            <Requests
              status={[REQUEST_STATUS.BOOKED, REQUEST_STATUS.MARKED_DONE]}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              bookButton: false,
              requestsButton: false,
              bookingDetails: true,
              markAsDoneButton: true,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'REQUESTS_COMPLETED' && <div className="vq-margin-top-bottom">
            <Requests
              status={[REQUEST_STATUS.CLOSED, REQUEST_STATUS.SETTLED]}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              bookButton: false,
              requestsButton: false,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: true
            }}/>
          </div>
}

          {this.state.viewType === 'REQUESTS_CANCELED' && <div className="vq-margin-top-bottom">
            <Requests
              status={REQUEST_STATUS.CANCELED}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              bookButton: false,
              requestsButton: false,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: false
            }}/>
          </div>
}

          {this.state.viewType === 'REQUESTS_DECLINED' && <div className="vq-margin-top-bottom">
            <Requests
              status={REQUEST_STATUS.DECLINED}
              properties={{
              statusText: true,
              editButton: false,
              cancelButton: false,
              bookButton: false,
              requestsButton: false,
              bookingDetails: false,
              markAsDoneButton: false,
              leaveReviewButton: false
            }}/>
          </div>
}
        </div>
}
      </div>
    );
  }
};
