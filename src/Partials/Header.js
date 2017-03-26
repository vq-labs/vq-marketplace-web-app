import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { grey600 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';

class Header extends Component {
  constructor(props) {
    super();

    this.state = {
      homeLabel: props.homeLabel,
      logged: Boolean(props.user),
      user: props.user
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.goToOffers = this.goToOffers.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user) {
       this.setState({
        homeLabel: nextProps.homeLabel,
        userId: nextProps.user._id,
        user: nextProps.user,
        logged: Boolean(nextProps.user)
      });
    } else {
      this.setState({ homeLabel: nextProps.homeLabel, logged: false, userId: undefined, user: undefined });
    }
   
  } 

  goToOffers(e) {
    e.preventDefault();
    browserHistory.push('/app/tasks');
  }

  goToProfile(e) {
    e.preventDefault();
    browserHistory.push('/profile/' + this.state.user._id);
  }

  handleLogout(e) {
    e.preventDefault();

    coreAuth.destroy();

    this.setState({ 
      logged: false, 
      user: false
    });
    
    browserHistory.push('/app');
  }

  render() {
      return (
        <div >
          <Toolbar className="st-nav">
            <a href="/" target="_self">
              <img className='imgCenter' src={this.props.logo} role="presentation" style={{ 'marginTop': '6px','marginBottom': '8px', maxHeight: '45px' }}/>
            </a>  
                <ToolbarGroup>
                          { this.state.homeLabel && 
                            <FlatButton label={`${this.state.homeLabel}s`}  onClick={ 
                              () => { browserHistory.push('/app');
                            }
                            } style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }}/>
                          }
                          { !this.state.logged &&
                          <FlatButton label="Registrieren" onClick={ 
                            () => { browserHistory.push('/app/signup'); 
                          }} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                          }
                          { !this.state.logged &&
                          <FlatButton label="Log-in" onClick={ 
                            () => { browserHistory.push('/app/login'); 
                          }} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                          }
                    <ToolbarSeparator />     

                  
                    <a onClick={ () => { browserHistory.push('/app/new-listing' ) }} target="_self">
                      <IconButton iconStyle={{ color: grey600 }}>
                        <ContentAdd />
                      </IconButton>
                    </a> 
                    

                    { this.state.logged && 
                      <IconButton iconStyle={{ color: grey600 }}  onClick={ () => { browserHistory.push('/app/chat' ) }}>
                        <CommunicationChatBubble />
                      </IconButton>
                    }

                    { this.state.logged &&
                      <IconMenu
                            iconButtonElement={ <Avatar src={this.state.user.profile.imageUrl || 'https://studentask.de/images/avatar.png'} size={40} />}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                              targetOrigin={{horizontal: 'left', vertical: 'top'}}  >
                        <MenuItem onClick={ () => { browserHistory.push('/app/profile/' + this.state.user._id ) }} primaryText="Profil" />                 
                        
                        
                        { coreAuth.isAdmin() && 
                        <MenuItem onClick={
                          () => browserHistory.push('/app/admin/overview')
                        } primaryText="Admin dashboard"
                        /> 
                        }

                        
                        <MenuItem onClick={this.handleLogout} primaryText="Logout" />
                      </IconMenu>
                    }
                </ToolbarGroup>
            </Toolbar>
        </div>
      );
   }
}   

export default Header;
