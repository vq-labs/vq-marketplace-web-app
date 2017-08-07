import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CircularProgress from 'material-ui/CircularProgress';
import NewListingCategory from '../NewListing/NewListingCategory';
import Bookings from '../Components/Bookings';
import Requests from '../Components/Requests';
import TaskListItem from '../Components/TaskListItem';
import DashboardViewTypeChoice from '../Components/DashboardViewTypeChoice';
import { translate } from '../core/i18n';
import { getUserAsync } from '../core/auth';
import { getConfigAsync } from '../core/config';
import { goTo } from '../core/navigation';
import apiTask from '../api/task';

/**
 * Dashboard depends on a user type
 */
export default class Dashboard extends Component {
  constructor(props) {
      super();
  
      this.state = {
        viewType: 'ORDERS_IN_PROGRESS',
        isLoading: false,
        tasks: []
      };

  }
  
  componentDidMount() {
    getConfigAsync(config => {
      getUserAsync(user => {

        apiTask
        .getItems({
          status: 0,
          userId: user.id,
        })
        .then(tasks => this.setState({
          tasks,
          isLoading: false
        }));


        if (user.userType) {

        }

        this.setState({
          ready: true,
          config,
          userType: user.userType,
          viewType: Number(user.userType) === 1 ? 'ORDERS_IN_PROGRESS' : 'SENT_REQUESTS_ACCEPTED'
        });
      });
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
                onSelect={viewType => this.setState({
                  viewType
                })}
              />
            </div>
            {this.state.viewType === 'LISTINGS_POSTED' &&
                <div className="row">
                  {!this.state.tasks.length &&
                    <div className="col-xs-12">
                        <div className="row">
                                <p className="text-muted">
                                    {translate("NO_OPEN_LISTINGS")}
                                </p>
                        </div>
                    </div>
                  }
                  {this.state.tasks
                  .map(task =>
                      <div 
                          className="col-xs-12"
                          style={{ marginBottom: 10} }
                      >
                          <TaskListItem
                              key={task.id}
                              task={task}
                              displayPrice={true}
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
            { !this.state.isLoading && this.state.userType == 1 &&
              <NewListingCategory onSelected={listingCategoryCode => {
                goTo(`/new-listing?category=${listingCategoryCode}`);
              }}/>
            }
        </div>
      );
   }
};
