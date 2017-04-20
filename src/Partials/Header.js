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
import { ListItem } from 'material-ui/List';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import { goTo } from '../core/navigation';

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

      apiTask.getItems({
          ownerUserId: nextProps.user._id,
          taskType: 1,
          status: 10,
      })
      .then(tasks => {
        this.setState({ tasks });
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
              <img className='imgCenter hidden-xs' src={this.props.logo} role="presentation" style={{ 'marginTop': '6px','marginBottom': '8px', maxHeight: '45px' }}/>
            </a>  
                <ToolbarGroup>
                          { this.state.homeLabel && 
                            <FlatButton label={`${this.state.homeLabel}s`}  onClick={ 
                              () => { goTo('/');
                            }
                            } style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }}/>
                          }
                          { !this.state.logged &&
                          <FlatButton label={translate("SIGNUP")} onClick={ 
                            () => { goTo('/signup'); 
                          }} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                          }
                          { !this.state.logged &&
                          <FlatButton label={translate("LOGIN")} onClick={ 
                            () => { goTo('/login'); 
                          }} style={{ 'marginRight': '0px', 'marginLeft': '0px' ,'fontSize': '1', 'borderRadius': '25px' }} />
                          }
                    <ToolbarSeparator />     

                   { !Boolean(this.state.tasks.length) &&
                    <a onClick={ () => { goTo('/new-listing') }} target="_self">
                      <IconButton iconStyle={{ color: grey600 }}>
                        <ContentAdd />
                      </IconButton>
                    </a> 
                   }
                   { Boolean(this.state.tasks.length) &&
                      <IconMenu
                            iconButtonElement={
                              <IconButton iconStyle={{ color: grey600 }}>
                                <ContentAdd />
                              </IconButton>
                            }
                            listStyle={{ width: 280 }}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}  >
                        { this.state.tasks.map(task =>
                          <ListItem
                            onClick={ () => { goTo(`/new-listing/${task.id}` ) }} 
                            target="_self"
                            primaryText={task.categories[0] ? translate(task.categories[0].code) : '?'}
                            secondaryText={task.title}
                            rightIcon={
                              <span style={{ marginRight: '45px' }}>{translate('Continue')}</span>
                            }
                          />
                        )}
                        <ListItem onClick={ () => { goTo('/new-listing') }} target="_self" primaryText={translate("CREATE_NEW_LISTING")} />
                    </IconMenu>
                   }
                  { this.state.logged && 
                    <IconButton iconStyle={{ color: grey600 }}  onClick={ () => { goTo('/chat' ) }}>
                      <CommunicationChatBubble />
                    </IconButton>
                  }

                    { this.state.logged &&
                      <IconMenu
                            iconButtonElement={ <Avatar src={this.state.user.profile.imageUrl || 'https://studentask.de/images/avatar.png'} size={40} />}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                              targetOrigin={{horizontal: 'left', vertical: 'top'}}  >
                        <MenuItem onClick={ () => { goTo('/profile/' + this.state.user._id ) }} primaryText={translate("PROFILE")} />                 
                        
                        
                        { coreAuth.isAdmin() && 
                          <MenuItem onClick={
                            () => goTo('/admin/overview')
                          } primaryText="Admin dashboard" /> 
                        }

                        { false && 'Satya, for now it is disabled until the page works, you need to access it directly with url' && <MenuItem onClick={ () => goTo('/my-listings') } primaryText={translate("MY_LISTING")} /> }
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
