import React, { Component } from 'react';
import { grey600 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Logo from './Logo';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import { goTo, goStartPage } from '../core/navigation';
import * as DEFAULTS from '../constants/DEFAULTS';
import { browserHistory } from 'react-router';
import { CONFIG } from '../core/config';
import { switchMode, getMode } from '../core/user-mode.js';

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
      userMode: getMode(),
      shouldDisplay: location.pathname.indexOf("admin") === -1,
      logged: Boolean(props.user),
      user: props.user
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user) {
      return this.setState({
        userId: nextProps.user.id,
        user: nextProps.user,
        logged: Boolean(nextProps.user)
      });
    }

    this.setState({
      logged: false,
      userId: undefined,
      user: undefined
    });
  }

  componentDidMount() {
    setInterval(() => {
      const userMode = getMode();
      if (this.state.userMode !== userMode) {
        this.setState({
          userMode
        });
      }
    }, 300);

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

    location.reload();
  }

  render() {
      return (
        <div >
          <Toolbar className="st-nav">
              <Logo
                appName={CONFIG.NAME}
                logo={CONFIG.LOGO_URL}
              />

              { !this.state.shouldDisplay &&
                <ToolbarGroup>
                  <MenuItem onTouchTap={() => goStartPage()} primaryText="Homepage" />
                  <MenuItem onTouchTap={() => goTo("/", true)} primaryText="Marketplace" />
                  <MenuItem onClick={this.handleLogout} primaryText="Logout" />
                </ToolbarGroup>
              }
              { this.state.shouldDisplay &&
                <ToolbarGroup>
                          { (
                            this.state.logged &&
                            CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1" && CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
                            ) &&
                            <div>
                              <IconButton
                                className="visible-xs"
                                iconStyle={{ color: grey600 }}>
                                <DashboardIcon />
                              </IconButton>

                                <IconMenu
                                  iconButtonElement={
                                    <FlatButton
                                      className="hidden-xs"
                                      label={translate("HEADER_DASHBOARD")}

                                      style={headerBtnStyle}
                                    />
                                  }
                                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                  <MenuItem primaryText={translate("MY_LISTINGS")} onTouchTap={() => {
                                    goTo("/dashboard/listings");

                                    location.reload();
                                  }}/>
                                  <MenuItem primaryText={translate("MY_REQUESTS")} onTouchTap={() => {
                                    goTo("/dashboard/requests");

                                    location.reload();
                                  }} />
                                </IconMenu>
                            </div>
                          }
                          { this.state.logged &&
                            ((
                              CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1" &&
                              CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED !== "1"
                            ) || (
                              CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED !== "1" &&
                              CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
                            )) &&
                            <div onTouchTap={() => {
                              if (
                                CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1" &&
                                CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED !== "1"
                              ) {
                                return goTo(this.state.userMode === "1" ? "/dashboard/requests" : "/dashboard/listings");
                              }

                              if (
                                CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED !== "1" &&
                                CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
                              ) {
                                return goTo(this.state.userMode === "1" ? "/dashboard/listings" : "/dashboard/requests");
                              }

                            }}>
                              <IconButton
                                className="visible-xs"
                                iconStyle={{ color: grey600 }}>
                                <DashboardIcon />
                              </IconButton>

                              <FlatButton
                                className="hidden-xs"
                                label={translate("HEADER_DASHBOARD")}

                                style={headerBtnStyle}
                              />
                            </div>
                          }
                    { this.state.logged && <ToolbarSeparator style={ { marginRight: '24px' } }/> }
                    {   (CONFIG.LISTING_ENABLE_PUBLIC_VIEW === "1" ||
                        (this.state.logged &&
                              (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1" && Number(this.state.userMode) === 2)
                        ))
                    &&
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
                          label={
                            this.state.userMode ?
                              Number(this.state.userMode) === 1 ?
                                translate('HEADER_SUPPLY_LISTINGS') :
                                translate('HEADER_DEMAND_LISTINGS')
                              :
                              Number(CONFIG.LISTING_PUBLIC_VIEW_MODE) === 1 ?
                                translate('HEADER_SUPPLY_LISTINGS') :
                                translate('HEADER_DEMAND_LISTINGS')
                          }
                          style={headerBtnStyle}
                        />
                      </div>
                    }

                    { this.state.logged
                      &&
                      Number(this.state.userMode) === 1
                      &&
                      CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
                      &&
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
                    { this.state.logged
                      &&
                      Number(this.state.userMode) === 2
                      &&
                      CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1"
                      &&
                      <a onClick={() => goTo('/new-listing')} target="_self">
                        {
                          translate('HEADER_ADD_OFFER_LISTING') === 'HEADER_ADD_OFFER_LISTING' ?
                          <IconButton iconStyle={{ color: grey600 }}>
                            <ContentAdd />
                          </IconButton> :
                          <FlatButton
                              label={translate('HEADER_ADD_OFFER_LISTING')}
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
                            style={{ cursor: 'pointer', marginLeft: '24px' }}
                            iconButtonElement={
                              <IconButton style={{padding: '0px'}}>
                                <Avatar
                                  src={this.state.user.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || DEFAULTS.PROFILE_IMG_URL}
                                  size={40}
                                />
                              </IconButton>
                            }
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      >
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

                        { this.state.user && this.state.user.userType === 0 &&
                            <MenuItem
                              primaryText={this.state.userMode === "1" ?
                                translate("SWITCH_USER_MODE_TO_SUPPLY_SIDE") :
                                translate("SWITCH_USER_MODE_TO_DEMAND_SIDE")
                              }
                              onTouchTap={() => {
                                const newUserMode = getMode() === "1" ? "2" : "1";

                                switchMode(newUserMode);

                                location.reload();
                              }}
                            />
                        }

                        { coreAuth.isAdmin() &&
                          <MenuItem onClick={
                            () => goTo('/admin/overview', true)
                          } primaryText="Admin dashboard" />
                        }
                        <MenuItem onClick={this.handleLogout} primaryText="Logout" />
                      </IconMenu>
                  }
                   { !this.state.logged &&
                    <FlatButton label={translate("LOGIN")} onClick={
                      () => { goTo('/login');
                    }} style={headerBtnStyle} />
                  }
                  { !this.state.logged &&
                  <FlatButton label={translate("SIGNUP")} onClick={
                    () => goTo('/signup')}
                    style={headerBtnStyle} />
                  }

                </ToolbarGroup>
              }
            </Toolbar>
        </div>
      );
   }
}

export default Header;
