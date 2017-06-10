import React from 'react';
import Avatar from 'material-ui/Avatar';

import * as apiAdmin from '../api/admin';
import * as coreNavigation from '../core/navigation';

import { List, ListItem } from 'material-ui/List';

export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = { users: [] };
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
                            { this.state.users.map(user => 
                                <ListItem
                                    onClick={() => coreNavigation.goTo(`/profile/${user.id}`)}
                                    leftAvatar={<Avatar src={ user ? user.imageUrl : '' } />} 
                                    primaryText={ user && `${user.firstName} ${user.lastName}`} 
                                />
                            )}
                        </List>
                    </div>
                </div>
            );
    }
};
