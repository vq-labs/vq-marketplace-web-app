import React, { Component } from 'react';
import NewListingCategory from '../NewListing/NewListingCategory';
import Bookings from '../Components/Bookings';
import Requests from '../Components/Requests';
import TaskListItem from '../Components/TaskListItem';
import DashboardViewTypeChoice from '../Components/DashboardViewTypeChoice';
import { translate } from '../core/i18n';
import { getUserAsync } from '../core/auth';
import { getConfigAsync } from '../core/config';
import { goTo, setQueryParams } from '../core/navigation';
import { getParams } from '../core/util.js'
import { getMeOutFromHereIfAmNotAuthorized } from '../helpers/user-checks';
import apiTask from '../api/task';
import Loader from "../Components/Loader";

/**
 * Dashboard depends on a user type
 */
export default class Dashboard extends Component {
  constructor(props) {
      super();
  
      const viewType = getParams(location.search).viewType;
    
      this.state = {
        viewType,
        isLoading: false,
        tasks: []
      };
  }
  
  componentDidMount() {
    getConfigAsync(config => {
      getUserAsync(user => {
        if (getMeOutFromHereIfAmNotAuthorized(user)) {
          return;
        }

        const newState =  {
          isLoading: true,
          ready: true,
          config,
          userType: user.userType
        };

        if (!this.state.viewType) {
          newState.viewType =  Number(user.userType) === 1 ?
            'ORDERS_IN_PROGRESS' :
            'SENT_REQUESTS_ACCEPTED';
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
    });
  }

  render() {
    return (
        <div className="container">
          {this.state.ready &&
          <div className="col-xs-12">
            <div className="col-xs-12" style={{ marginBottom: 20 }}>
              <DashboardViewTypeChoice
                userType={Number(this.state.userType)}
                halign="left"
                selected={this.state.viewType}
                onSelect={viewType => {
                  const newState = { viewType };

                  setQueryParams(newState);
                  this.setState(newState);
              }}
              />
            </div>
            {this.state.viewType === 'LISTINGS_POSTED' &&
                <div className="row">
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
                              displayPrice={true}
                              editable={true}
                              onCancel={() => {
                                const tasks = this.state.tasks;

                                tasks.splice(index, 1);

                                this.setState({
                                  tasks
                                });
                              }}
                          />
                        <div className="row"><hr /></div>
                      </div>
                  )}
                </div>
              }
              {this.state.viewType === 'ORDERS_IN_PROGRESS' &&
                <div className="row">
                  <Bookings
                    showTitle={false}
                    view={"in_progress"}
                    onReady={() => {}}
                  />
                </div>
              }

              {this.state.viewType === 'ORDERS_COMPLETED' &&
                <div className="row">
                  <Bookings
                    showTitle={false}
                    view={"completed"}
                    onReady={() => {}}
                  />
                </div>
              }

              {this.state.viewType === 'SENT_REQUESTS_PENDING' &&
                <Requests
                  view={"pending"}
                  showTitle={false}
                />
              }

              {this.state.viewType === 'SENT_REQUESTS_ACCEPTED' &&
                <Requests
                  view={"in_progress"}
                  showTitle={false}
                />
              }

              {this.state.viewType === 'SENT_REQUESTS_SETTLED' &&
                <Requests
                  view={"completed"}
                  showTitle={false}
                />
              }
            </div>
            }
            { false && !this.state.isLoading && Number(this.state.userType) === 1 &&
              <NewListingCategory onSelected={listingCategoryCode => {
                goTo(`/new-listing?category=${listingCategoryCode}`);
              }}/>
            }
        </div>
      );
   }
};
