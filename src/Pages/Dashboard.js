import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CircularProgress from 'material-ui/CircularProgress';
import NewListingCategory from '../NewListing/NewListingCategory';
import Bookings from '../Components/Bookings';
import Requests from '../Components/Requests';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import { goTo } from '../core/navigation';

/**
 * Dashboard depends on a user type
 */
export default class Dashboard extends Component {
  constructor(props) {
      super();
     
      const userType = Number(props.location.query.userType) || 0;

      this.state = {
        userType,
        isLoading: false
      };

  }
  
  componentDidMount() {

  }

  render() {
    return (
        <div className="container">
            <div className="col-xs-12">
              <h1>How to Get Started</h1>
              <p>We’re excited to help! Here’s how it works:</p>

              <h2>1. Pick a Task</h2>
              <p>Choose from a list of popular chores and errands</p>

              <h2>2. Get Matched</h2>
              <p>We'll connect you with a skilled Tasker within minutes of your request</p>

              <h2>3. Get it Done</h2>
              <p>Your Tasker arrives, completes the job and bills directly in the app</p>
            </div>
            
            <Bookings onReady={() => {}}/>
            <Requests />
            
            { !this.state.isLoading && this.state.userType !== 2 &&
              <NewListingCategory onSelected={listingCategoryCode => {
                goTo(`/new-listing?category=${listingCategoryCode}`);
              }}/>
            }
        </div>
      );
   }
};
