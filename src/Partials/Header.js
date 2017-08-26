import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { grey600 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Logo from './Logo';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { ListItem } from 'material-ui/List';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import { goTo, goStartPage } from '../core/navigation';

class Header extends Component {
  constructor(props) {
    super();

    this.state = {
      tasks: [],
      homeLabel: props.homeLabel,
      logged: Boolean(props.user),
      user: props.user
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user) {
      this.setState({
        homeLabel: nextProps.homeLabel,
        userId: nextProps.user.id,
        user: nextProps.user,
        logged: Boolean(nextProps.user)
      });

      apiTask.getItems({
          userId: nextProps.user.id,
          taskType: 1,
          status: 10,
      }).then(tasks => {
        this.setState({
          tasks
        });
      });

    } else {
      this.setState({
        homeLabel: nextProps.homeLabel,
        logged: false,
        userId: undefined,
        user: undefined
      });
    }
  } 

  handleLogout(e) {
    e.preventDefault();

    coreAuth.destroy();

    this.setState({ 
      logged: false, 
      user: false
    });
    
    goStartPage();
  }

  render() {
      return (
        <div >
          <Toolbar className="st-nav">
              <Logo
                appName={this.props.appName}
                logo={this.props.logo}
              />
              <ToolbarGroup>
                        { this.state.logged &&
                          <FlatButton label={translate("DASHBOARD")} onClick={ 
                            () => { goTo('/dashboard'); 
                          }} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                        }
                        { !this.state.logged &&
                        <FlatButton label={translate("SIGNUP")} onClick={ 
                          () => goTo('/signup')} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                        }
                        { !this.state.logged &&
                        <FlatButton label={translate("LOGIN")} onClick={ 
                          () => { goTo('/login'); 
                        }} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                        }
                  { this.state.logged && <ToolbarSeparator /> }

                  { this.state.logged && Number(this.state.user.userType) === 2 &&
                    <FlatButton label={translate('HEADER_LISTINGS')}  onClick={ 
                      () => goTo('/')
                    } style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }}/>
                  }
                 
                  

                  { this.state.logged && Number(this.state.user.userType) === 1 &&
                    <a onClick={() => goTo('/new-listing')} target="_self">
                      <IconButton iconStyle={{ color: grey600 }}>
                        <ContentAdd />
                      </IconButton>
                    </a>
                  }
              
                { this.state.logged && 
                  <IconButton iconStyle={{ color: grey600 }}  onClick={ () => { goTo('/chat' ) }}>
                    <CommunicationChatBubble />
                  </IconButton>
                }

                  { this.state.logged &&
                    <IconMenu
                          iconButtonElement={
                            <div>
                              <Avatar src={this.state.user.imageUrl || '/images/avatar.png'} size={40} />
                            </div>
                          }
                          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}  >
                      <MenuItem 
                        onClick={
                          () => goTo(`/profile/${this.state.user.id}`, (newPath, oldPath) => {
                            if (oldPath.indexOf('profile') > -1) {
                              return true;
                            }

                            return false;
                          })
                        }
                        primaryText={translate("PROFILE")}
                      />                 
                      
                      { Number(this.state.user.userType) === 2 &&
                        <MenuItem 
                            onClick={() => goTo(`/user-verifications`)}
                            primaryText={translate("USER_VERIFICATIONS")}
                          />     
                      }

                      { Number(this.state.user.userType) === 2 &&
                        <MenuItem 
                            onClick={() => goTo(`/user-preferences`)}
                            primaryText={translate("USER_PREFERENCES")}
                          />
                      }

                      <MenuItem onClick={ () => goTo('/change-password' )} primaryText={translate("CHANGE_PASSWORD")} />                 
                      
                      { coreAuth.isAdmin() &&
                        <MenuItem onClick={
                          () => goTo('/admin/overview')
                        } primaryText="Admin dashboard" /> 
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
