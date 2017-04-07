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
        apiAdmin.users.getItems().then(users => {
            this.setState({ users });
        });
    }
    render() {
            return (
                <List>
                    { this.state.users.map(user => 
                        <ListItem
                            onClick={ () => coreNavigation.goTo(`/profile/${user._id}`)}
                            leftAvatar={<Avatar src={ user.profile ? user.profile.imageUrl : '' } />} 
                            primaryText={ user.profile && (user.profile.firstName + ' ' + user.profile.lastName) } 
                        />
                    )}
                </List>
            );
    }
};
