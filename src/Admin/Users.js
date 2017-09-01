import React from 'react';
import Avatar from 'material-ui/Avatar';
import * as apiAdmin from '../api/admin';
import * as coreNavigation from '../core/navigation';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import { translate } from '../core/i18n';
import displayObject from '../helpers/display-object';
import getProperty from '../helpers/get-user-property';
import Moment from 'react-moment';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const USER_STATUS = {
    UNVERIFIED: '0',
    VERIFIED: '10',
    DISABLED: '15',
    BLOCKED: '20'
};

const USER_TYPES = {
    CLIENT: 1, // client
    STUDENT: 2 // student
};

const INVERSE_USER_STATUS = {};
const INVERSE_USER_TYPES = {};
Object
    .keys(USER_STATUS)
    .forEach(statusName => {
        INVERSE_USER_STATUS[USER_STATUS[statusName]] = statusName;
    });

Object
.keys(USER_TYPES)
.forEach(statusName => {
    INVERSE_USER_TYPES[USER_TYPES[statusName]] = statusName;
});

export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            showProperty: false,
            showDetails: false,
            selectedUserId: null,
            isBlockingUser: false,
            users: []
        };
    }
    componentDidMount() {
        apiAdmin.users
        .getItems()
        .then(users => {
            this.setState({ 
                users
            });
        });
    }
    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                            <h1>Users</h1>
                    </div>
                    <div className="col-xs-12">
                        <List>
                            { this.state.users
                            .map(user => 
                                <ListItem
                                    leftAvatar={
                                        <Avatar src={ user ? user.imageUrl : '' } />
                                    } 
                                    primaryText={
                                        user
                                        &&
                                        `${user.firstName} ${user.lastName} (#${user.id}) ${String(user.status) === '20' ? ' (Blocked)' : ''}`
                                    }
                                    secondaryText={
                                        <p>
                                            Created at: <Moment format="DD.MM.YYYY, HH:MM">{user.createdAt}</Moment> * Status: {INVERSE_USER_STATUS[String(user.status)]} * {INVERSE_USER_TYPES[String(user.userType)]}
                                        </p>
                                    }
                                    rightIcon={
                                        <IconMenu
                                            iconButtonElement={
                                                <IconButton>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                            anchorOrigin={{
                                                horizontal: 'left',
                                                vertical: 'top'
                                            }}
                                            targetOrigin={{
                                                horizontal: 'left',
                                                vertical: 'top'
                                            }}
                                            >
                                            <MenuItem
                                                primaryText="Show full information"
                                                onClick={() => {
                                                    this.setState({
                                                        showDetails: true,
                                                        selectedUser: user
                                                    })
                                                }}
                                            />
                                            { String(user.userType) === '2' &&
                                                <MenuItem
                                                    primaryText="Show StudentID"
                                                    onClick={() => {
                                                        this.setState({
                                                            showProperty: true,
                                                            selectedUser: user
                                                        })
                                                    }}
                                                />
                                            }
                                            <MenuItem
                                                primaryText="Go to profile page"
                                                onClick={() => coreNavigation.goTo(`/profile/${user.id}`)}
                                            />
                                            { String(user.status) !== '20' &&
                                                <MenuItem
                                                    onClick={() => this.setState({
                                                        isBlockingUser: true,
                                                        selectedUserId: user.id
                                                    })}
                                                    primaryText="Block"
                                                />
                                            }
                                            { String(user.status) === '20' &&
                                                <MenuItem
                                                    onClick={() => this.setState({
                                                        isUnblockingUser: true,
                                                        selectedUserId: user.id
                                                    })}
                                                    primaryText="Unblock"
                                                />
                                            }
                                        </IconMenu>
                                    }
                                >
                                </ListItem>
                            )}
                        </List>
                    </div>

                    <div>
                        <Dialog
                            actions={[
                                <FlatButton
                                    label={translate('CANCEL')}
                                    primary={true}
                                    onTouchTap={() => this.setState({
                                        isBlockingUser: false,
                                        isUnblockingUser: false,
                                        selectedUserId: null
                                    })
                                    }
                                />,
                                <FlatButton
                                    label={translate('CONFIRM')}
                                    primary={true}
                                    onTouchTap={() => {
                                        const users = this.state.users;
                                        const userId = this.state.selectedUserId;
                                        const isBlocking = this.state.isBlockingUser;
                                        const USER_STATUS_BLOCKED = isBlocking ? '20' : '10';

                                        users
                                            .find(_ => _.id === userId)
                                            .status = USER_STATUS_BLOCKED;

                                        apiAdmin
                                            .users[
                                                isBlocking ? 'blockUser' : 'unblockUser'
                                            ](userId);

                                        this.setState({
                                            users,
                                            isBlockingUser: false,
                                            isUnblockingUser: false,
                                            selectedUserId: null
                                        });
                                    }}
                                />,
                            ]}
                            modal={false}
                            open={this.state.isBlockingUser || this.state.isUnblockingUser}
                            >
                                Delete user #{this.state.selectedUserId}
                            </Dialog>


                            <div>
                                <Dialog
                                    autoScrollBodyContent={true}
                                    actions={[
                                        <FlatButton
                                            label={'OK'}
                                            primary={true}
                                            onTouchTap={() => this.setState({
                                                showDetails: false,
                                                selectedUser: null
                                            })}
                                        />
                                    ]}
                                    modal={false}
                                    open={this.state.showDetails}
                                    >
                                        <div className="container">
                                            { displayObject(this.state.selectedUser || {})}
                                        </div>
                                </Dialog>
                            </div>


                            <div>
                                <Dialog
                                    autoScrollBodyContent={true}
                                    actions={[
                                        <FlatButton
                                            label={'OK'}
                                            primary={true}
                                            onTouchTap={() => this.setState({
                                                showProperty: false,
                                                propertyName: null,
                                                selectedUser: null,
                                            })}
                                        />
                                    ]}
                                    modal={false}
                                    open={this.state.showProperty}
                                    >
                                        <div className="container">
                                            <div className="col-xs-12">
                                                    { this.state.showProperty &&
                                                        <img
                                                            alt="presentation"
                                                            width={400}
                                                            height={400}
                                                            src={getProperty(this.state.selectedUser, 'studentIdUrl')}
                                                        />
                                                    }
                                            </div>
                                            <div className="col-xs-12">
                                                { this.state.showProperty &&
                                                    <a href={getProperty(this.state.selectedUser, 'studentIdUrl')} target="_blank">Open in a separate page</a>
                                                }
                                            </div>
                                        </div>
                                </Dialog>
                            </div>
                        </div>
                     </div>
            );
    }
};
