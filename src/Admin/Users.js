import React from 'react';
import Avatar from 'material-ui/Avatar';

import * as apiAdmin from '../api/admin';
import * as coreNavigation from '../core/navigation';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import { translate } from '../core/i18n';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = {
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
                                        `${user.firstName} ${user.lastName} (#${user.id}) ${user.status == 20 ? ' (Blocked)' : ''}`
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
                                                primaryText="Go to profile page"
                                                onClick={() => coreNavigation.goTo(`/profile/${user.id}`)}
                                            />
                                            { user.status != 20 &&
                                                <MenuItem
                                                    onClick={() => this.setState({
                                                        isBlockingUser: true,
                                                        selectedUserId: user.id
                                                    })}
                                                    primaryText="Block"
                                                />
                                            }
                                            { user.status == 20 &&
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
                                        const USER_STATUS_BLOCKED = isBlocking ? 20 : 10;

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
                        </div>
                     </div>
            );
    }
};
