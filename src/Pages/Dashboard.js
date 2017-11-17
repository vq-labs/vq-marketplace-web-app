import React, { Component } from 'react';
import Bookings from '../Components/Bookings';
import Requests from '../Components/Requests';
import TaskListItem from '../Components/TaskListItem';
import DashboardViewTypeChoice from '../Components/DashboardViewTypeChoice';
import Loader from "../Components/Loader";
import { translate } from '../core/i18n';
import { getUserAsync } from '../core/auth';
import { CONFIG } from '../core/config';
import { setQueryParams } from '../core/navigation';
import { getParams } from '../core/util.js';
import { getMode } from '../core/user-mode.js';
import { getMeOutFromHereIfAmNotAuthorized } from '../helpers/user-checks';
import apiTask from '../api/task';
import { openDialog } from '../helpers/open-message-dialog.js';

const defaultViewTypes = {
  listings: "LISTINGS_POSTED",
  requests: "SENT_REQUESTS_PENDING"
};
export default class Dashboard extends Component {
  constructor(props) {
      super();
  
      const viewType = getParams(location.search).viewType;
      const dashboardType = props.params.type;
    
      this.state = {
        dashboardType,
        viewType,
        isLoading: false,
        tasks: [],
        selectedTask: {
          requests: []
        }
      };

      this.onViewChange = this.onViewChange.bind(this);
  }
  
  componentWillReceiveProps (nextProps) {
    const dashboardType = nextProps.params.type;
    
    this.setState({
      dashboardType,
      // viewType: defaultViewTypes[dashboardType]
    });
  }

  componentDidMount() {
      getUserAsync(user => {
        if (getMeOutFromHereIfAmNotAuthorized(user)) {
          return;
        }

        const userMode = user.userType === 0 ? getMode() : user.userType;
        
        const newState = {
          userMode,
          isLoading: true,
          ready: true,
          userType: user.userType,
        };

        if (!this.state.viewType) {
          if (Number(userMode) === 1 && CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
            newState.viewType = this.state.dashboardType === "listings" ? "LISTINGS_POSTED" : "SENT_REQUESTS_PENDING";
          }

          if (Number(userMode) === 1 && CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
            newState.viewType = this.state.dashboardType === "listings" ? "OFFER_LISTINGS_POSTED" : "SENT_REQUESTS_PENDING";
          }

          if (Number(userMode) === 2 && CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
            newState.viewType = this.state.dashboardType === "listings" ? "OFFER_LISTINGS_POSTED" : "SENT_REQUESTS_PENDING";
          }
        }

        this.setState(newState);

        apiTask
        .getItems({
          status: '0',
          userId: user.id,
        })
        .then(tasks => this.setState({
          tasks,
          isLoading: false
        }));
      }, true);
  }

  onViewChange(viewType) {
      const newState = {
        viewType
      };

      setQueryParams(newState);

      this.setState(newState);
  }

  render() {
    return (
        <div className="container vq-no-padding">
          {this.state.ready &&
          <div className="col-xs-12">
            { this.state.dashboardType === "listings" &&
              <div className="row vq-margin-top-bottom">
                  <div className="col-xs-12 vq-margin-top-bottom">
                    <h2>My Listings</h2>
                  </div>
                  <div className="col-xs-12 vq-margin-top-bottom">
                    <DashboardViewTypeChoice
                      userType={Number(this.state.userMode)}
                      dashboardType={"listings"}
                      halign="left"
                      selected={this.state.viewType}
                      onSelect={this.onViewChange}
                    />
                  </div>
                </div>
            }

            {this.state.dashboardType === "requests" &&
              <div className="row vq-margin-top-bottom">
                  <div className="col-xs-12 vq-margin-top-bottom">
                    <h2>My Requests</h2>
                  </div>
                  <div className="col-xs-12 vq-margin-top-bottom">
                    <DashboardViewTypeChoice
                      userType={Number(this.state.userMode)}
                      dashboardType={"requests"}
                      halign="left"
                      selected={this.state.viewType}
                      onSelect={this.onViewChange}
                    />
                  </div>
                </div>
            }
          
            {(this.state.viewType === 'LISTINGS_POSTED' || this.state.viewType === 'OFFER_LISTINGS_POSTED' ) &&
                <div className="row vq-margin-top-bottom">
                  { this.state.isLoading &&
                    <Loader isLoading={true} />
                  }
                  { !this.state.isLoading && !this.state.tasks.length &&
                    <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-12">
                              <p className="text-muted">
                                  {translate("NO_OPEN_LISTINGS")}
                              </p>
                          </div>
                        </div>
                    </div>
                  }
                  { !this.state.isLoading && this.state.tasks
                  .map((task, index) =>
                      <div 
                          className="col-xs-12"
                          style={{
                            marginBottom: 10
                          }}
                      >
                          <TaskListItem
                              key={task.id}
                              task={task}
                              showRequests={true}
                              displayManagement={true}
                              displayPrice={true}
                              editable={true}
                              onCancel={() => openDialog({
                                  header: translate('CANCEL_LISTING_SUCCESS_HEADER'),
                                  desc: translate('CANCEL_LISTING_SUCCESS_DESC')
                                }, () => {
                                  const tasks = this.state.tasks;

                                  tasks.splice(index, 1);

                                  this.setState({
                                    tasks
                                  });
                                })
                              }
                          />
                        <div className="row"><hr /></div>
                      </div>
                  )}
                </div>
              }

              {this.state.viewType === 'ORDERS_IN_PROGRESS' &&
                <div className="row vq-margin-top-bottom">
                  <Bookings
                    showTitle={false}
                    view={"in_progress"}
                    onReady={() => {}}
                  />
                </div>
              }

              {this.state.viewType === 'ORDERS_COMPLETED' &&
                <div className="row vq-margin-top-bottom">
                  <Bookings
                    showTitle={false}
                    view={"completed"}
                    onReady={() => {}}
                  />
                </div>
              }

              {this.state.viewType === 'SENT_REQUESTS_PENDING' &&
                <div className="row vq-margin-top-bottom">
                  <Requests
                    view={"pending"}
                    showTitle={false}
                  />
                </div>
              }

              {this.state.viewType === 'SENT_REQUESTS_ACCEPTED' &&
                <div className="row vq-margin-top-bottom">
                  <Requests
                    view={"in_progress"}
                    showTitle={false}
                  />
                </div>
              }

              {this.state.viewType === 'SENT_REQUESTS_SETTLED' &&
                <div className="vq-margin-top-bottom">
                  <Requests
                    view={"completed"}
                    showTitle={false}
                  />
                </div>
              }
            </div>
            }
        </div>
      );
   }
};
