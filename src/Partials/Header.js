import React, { Component } from 'react';
import { Sticky } from 'react-sticky';
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
import ContentAddIcon from 'material-ui/svg-icons/content/add';
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
      user: props.user,
      isMobile: false
    };
    this.checkForMobile = this.checkForMobile.bind(this);
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
    this.checkForMobile();
    window.addEventListener('resize', this.checkForMobile);

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
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkForMobile);
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

  checkForMobile() {
    /* 
    * do not remove the else statement otherwise
    * it keeps checking for window.innerWidth everytime
    * which sets the state each time causing performance problems
    */
    if (window.innerWidth < 769) {
      if (this.state.isMobile === false) {
        this.setState({isMobile: true});
      }
    } else {
      if (this.state.isMobile === true) {
        this.setState({isMobile: false});
      }
    }
  }

  shouldShowButton(buttonType){
    const isLoggedIn = this.state.logged;
    const userType = this.state.user ? Number(this.state.user.userType) : undefined;
    const userMode = Number(this.state.userMode);

    if (buttonType === 'dashboard') {
      if (isLoggedIn) {
        return true;
      }

      return false;
    }
  
    if (buttonType === 'browse') {
      if (
        (
          CONFIG.LISTING_ENABLE_PUBLIC_VIEW === "1" &&
          !isLoggedIn
        ) ||
        (
          isLoggedIn &&
          (
            userType === 0
          ) ||
          (
            userType === 1 &&
            CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1"
          ) ||
          (
            userType === 2 &&
            CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
          )
        )
      ) {
        return true;
      }
      return false;
    }
  
    if (buttonType === 'new-listing') {
      if (
        (
          isLoggedIn &&
          (
            userType === 0
          ) ||
          (
            userType === 1 &&
            CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
          ) ||
          (
            userType === 2 &&
            CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1"
          )
        )
      ) {
        return true;
      }
      return false;
    }

    if (buttonType === 'listings') {
      if (
        isLoggedIn &&
        (
          userType === 0
        ) ||
        (
          userType === 1 &&
          CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
        ) ||
        (
          userType === 2 &&
          CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1"
        )
      ) {
        return true;
      }

      return false;
    }

    if (buttonType === 'requests') {
      if (
        isLoggedIn &&
        (
          userType === 0
        ) ||
        (
          userType === 1 &&
          CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1"
        ) ||
        (
          userType === 2 &&
          CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1"
        )
      ) {
        return true;
      }

      return false;
    }
  }

  render() {
      return (
        <Sticky topOffset={0}>
          {
            ({
              style,
              isSticky,
              wasSticky,
              distanceFromTop,
              distanceFromBottom,
              calculatedHeight
            }) => {
              return (
                <Toolbar style={{...style, zIndex: 2000}} className="st-nav">
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
                      {
                        this.shouldShowButton('dashboard') &&
                        this.shouldShowButton('listings') &&
                        this.shouldShowButton('requests') &&
                          <IconMenu
                            iconButtonElement={
                              this.state.isMobile ?
                                <IconButton
                                  iconStyle={{ color: grey600 }}>
                                  <DashboardIcon />
                                </IconButton> :
                                <FlatButton
                                  label={translate("HEADER_DASHBOARD")}
                                  style={headerBtnStyle}
                                />
                            }
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                          >
                              <MenuItem primaryText={translate("MY_LISTINGS")} onTouchTap={() => {
                                goTo("/dashboard/listings");
                              }}/>
                              <MenuItem primaryText={translate("MY_REQUESTS")} onTouchTap={() => {
                                goTo("/dashboard/requests");
                              }} />
                          </IconMenu>
                      }
                      {
                          this.shouldShowButton('dashboard') &&
                          (
                            (
                              this.shouldShowButton('listings') &&
                              !this.shouldShowButton('requests')
                            ) ||
                            (
                              !this.shouldShowButton('listings') &&
                              this.shouldShowButton('requests')
                            ) 
                          ) &&
                          this.state.isMobile &&
                          <IconButton
                            iconStyle={{ color: grey600 }}
                            onTouchTap={() => {
                              goTo("/dashboard");
                            }}
                          >
                            <DashboardIcon />
                          </IconButton>
                      }
                      {
                        this.shouldShowButton('dashboard') &&
                        (
                          (
                            this.shouldShowButton('listings') &&
                            !this.shouldShowButton('requests')
                          ) ||
                          (
                            !this.shouldShowButton('listings') &&
                            this.shouldShowButton('requests')
                          ) 
                        )  &&
                        !this.state.isMobile &&
                        <FlatButton
                            label={translate("HEADER_DASHBOARD")}
                            style={headerBtnStyle}
                            onTouchTap={() => {
                              goTo("/dashboard");
                            }}
                          />
                      }
                      { this.state.logged && <ToolbarSeparator style={ { marginRight: '24px' } }/> }
                      {
                        this.shouldShowButton('browse') &&
                        this.state.isMobile &&
                        <IconButton
                          iconStyle={{ color: grey600 }}
                          onTouchTap={() => {
                            goTo("/");
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      }
                      {
                        this.shouldShowButton('browse') &&
                        !this.state.isMobile &&
                        <FlatButton
                            label={
                              this.state.userMode ?
                                Number(this.state.userMode) === 1 ?
                                  translate('HEADER_SUPPLY_LISTINGS') :
                                  translate('HEADER_DEMAND_LISTINGS')
                                :
                                Number(CONFIG.LISTING_PUBLIC_VIEW_MODE) === 2 ?
                                  translate('HEADER_SUPPLY_LISTINGS') :
                                  translate('HEADER_DEMAND_LISTINGS')
                            }
                            style={headerBtnStyle}
                            onTouchTap={() => {
                              goTo("/");
                            }}
                          />
                      }

                      {
                        this.shouldShowButton('new-listing') &&
                        this.state.isMobile &&
                        <IconButton
                          iconStyle={{ color: grey600 }}
                          onTouchTap={() => {
                            goTo("/new-listing");
                          }}
                        >
                          <ContentAddIcon />
                        </IconButton>
                      }
                      {
                        this.shouldShowButton('new-listing') &&
                        !this.state.isMobile &&
                        <FlatButton
                            label={translate('HEADER_ADD_LISTING')}
                            style={headerBtnStyle}
                            onTouchTap={() => {
                              goTo("/new-listing");
                            }}
                        />
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
              )
            }
          }
        </Sticky>
      );
   }
}

export default Header;
