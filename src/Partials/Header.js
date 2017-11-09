import React, { Component } from 'react';
import { grey600 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Logo from './Logo';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import { goTo, goStartPage } from '../core/navigation';
import * as DEFAULTS from '../constants/DEFAULTS';
import { browserHistory } from 'react-router';

const headerBtnStyle = {
  'marginRight': '0px',
  'marginLeft': '0px',
  'fontSize': '1',
  'borderRadius': '25px'
};

class Header extends Component {
  constructor(props) {
    super();

    this.state = {
      shouldDisplay: location.pathname.indexOf("admin") === -1,
      homeLabel: props.homeLabel,
      logged: Boolean(props.user),
      user: props.user
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user) {
      return this.setState({
        homeLabel: nextProps.homeLabel,
        userId: nextProps.user.id,
        user: nextProps.user,
        logged: Boolean(nextProps.user)
      });
    }

    this.setState({
      homeLabel: nextProps.homeLabel,
      logged: false,
      userId: undefined,
      user: undefined
    });
  } 

  componentDidMount() {
    browserHistory.listen(location =>  {
      this.setState({
        shouldDisplay: location.pathname.indexOf("admin") === -1
      })
    });
  }

  handleLogout(e) {
    e.preventDefault();

    coreAuth.destroy();

    this.setState({ 
      logged: false, 
      user: false
    });
    
    setTimeout(() => {
      goStartPage();
    }, 500);
  }

  render() {
      return (
        <div >
          <Toolbar className="st-nav">
              <Logo
                appName={this.props.appName}
                logo={this.props.logo}
              />
              { !this.state.shouldDisplay &&
                <ToolbarGroup>
                  <RaisedButton
                    primary={true}
                    onTouchTap={() => goTo("/", true)}
                    label={'Go to marketplace'}
                  />
                </ToolbarGroup>
              }
              { this.state.shouldDisplay &&
                <ToolbarGroup>
                          { this.state.logged &&
                          <div onClick={ 
                                () => { goTo('/dashboard'); 
                          }}>
                            <IconButton
                              className="visible-xs"
                              iconStyle={{ color: grey600 }}>
                              <DashboardIcon />
                            </IconButton>

                            <FlatButton
                              className="hidden-xs"
                              label={translate("DASHBOARD")}
                              
                              style={headerBtnStyle}
                            />
                          </div>
                          }
                          { !this.state.logged &&
                          <FlatButton label={translate("SIGNUP")} onClick={ 
                            () => goTo('/signup')}
                            style={headerBtnStyle} />
                          }
                          { !this.state.logged &&
                          <FlatButton label={translate("LOGIN")} onClick={ 
                            () => { goTo('/login'); 
                          }} style={headerBtnStyle} />
                          }
                    { this.state.logged && <ToolbarSeparator /> }

                    { this.state.logged && Number(this.state.user.userType) !== 1 &&
                      <div onTouchTap={ 
                          () => goTo('/')
                      }>
                        <IconButton
                          className="visible-xs"
                          iconStyle={{ color: grey600 }}>
                          <SearchIcon />
                        </IconButton>

                        <FlatButton
                          className="hidden-xs"
                          label={translate('HEADER_LISTINGS')} 
                          style={headerBtnStyle}
                        />
                      </div>
                    }

                    { this.state.logged && Number(this.state.user.userType) !== 2 &&
                      <a onClick={() => goTo('/new-listing')} target="_self">
                        {
                          translate('HEADER_ADD_LISTING') === 'HEADER_ADD_LISTING' ?
                          <IconButton iconStyle={{ color: grey600 }}>
                            <ContentAdd />
                          </IconButton> :
                          <FlatButton 
                              label={translate('HEADER_ADD_LISTING')}
                              style={headerBtnStyle}
                          />
                        }
                      </a>
                    }
                
                  { false && this.state.logged && 
                    <IconButton iconStyle={{ color: grey600 }}  onClick={ () => { goTo('/chat' ) }}>
                      <CommunicationChatBubble />
                    </IconButton>
                  }

                  { this.state.logged &&
                      <IconMenu
                            style={{ cursor: 'pointer' }}
                            iconButtonElement={
                              <div>
                                <Avatar src={this.state.user.imageUrl || DEFAULTS.PROFILE_IMG_URL} size={40} />
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
                        
                      
                        <MenuItem 
                            onClick={() => goTo(`/account`)}
                            primaryText={translate("ACCOUNT_SETTINGS")}
                        />     
                    
                        { coreAuth.isAdmin() &&
                          <MenuItem onClick={
                            () => goTo('/admin/overview', true)
                          } primaryText="Admin dashboard" /> 
                        }
                        <MenuItem onClick={this.handleLogout} primaryText="Logout" />
                      </IconMenu>
                    }
                </ToolbarGroup>
              }
            </Toolbar>
        </div>
      );
   }
}   

export default Header;
