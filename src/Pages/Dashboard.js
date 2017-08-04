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
import { getUserAsync } from '../core/auth';
import { getConfigAsync } from '../core/config';
import { goTo } from '../core/navigation';


/**
 * Dashboard depends on a user type
 */
export default class Dashboard extends Component {
  constructor(props) {
      super();
  
      this.state = {
        isLoading: false
      };

  }
  
  componentDidMount() {
     getUserAsync(user => this.setState({
        userType: user.userType
      }));

      getConfigAsync(config => this.setState({
        config
      }));
  }

  render() {
    return (
        <div className="container">
            { Number(this.state.userType) === 1 &&
              <Bookings onReady={() => {}}/>
            }

            { Number(this.state.userType) === 2 &&
              <Requests />
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
