import React, { Component } from 'react';
import apiUser from '../api/user';
import EditableEntity from '../Components/EditableEntity';
import * as coreNavigation from '../core/navigation';
import '../App.css';

export default class ProfileEdit extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            userId: props.params.profileId,
            isLoading: true,
            user: {}
        };
    }
    componentDidMount() {
        let userId = this.props.params.profileId;

        apiUser.getItem(userId).then(user => this.setState({
        user, isLoading: false
        }));
    }
    render() {
            return (
                <div className="container">
                    <div className="col-xs-12">
                        <h1>Profil bearbeiten</h1>

                        <EditableEntity 
                            value={this.state.user && this.state.user.profile} fields={[
                                {
                                    key: 'firstName',
                                    label: 'Vorname'
                                },
                                {
                                    key: 'lastName',
                                    label: 'Nachname'
                                },
                                {
                                    key: 'bio',
                                    label: 'Profilbeschreibung',
                                    hint: 'Erzählen Sie Profilbesuchern in einem kurzen Satz, wer Sie sind.'
                                },
                                {
                                    key: 'website',
                                    label: 'Webseite'
                                }
                            ]}
                            onConfirm={
                                updatedEntity => apiUser
                                    .updateItem(this.state.user._id, { profile: updatedEntity })
                                    .then(task => coreNavigation.goTo(`/profile/${this.state.user._id}`))
                            }
                        />
                    </div>    
                </div>
            );
    }
};