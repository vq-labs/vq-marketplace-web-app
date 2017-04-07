import React, { Component } from 'react';
import apiUser from '../api/user';
import EditableEntity from '../Components/EditableEntity';
import * as coreNavigation from '../core/navigation';
import '../App.css';
import { translate } from '../core/i18n';

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
                        <h1>{ translate('EDIT_PROFILE') }</h1>

                        <EditableEntity
                            cancelLabel={translate('CANCEL')}
                            saveLabel={translate('SAVE')}
                            showCancelBtn={true}
                            value={this.state.user && this.state.user.profile} 
                            fields={[
                                {
                                    key: 'firstName',
                                    label: translate('FIRST_NAME')
                                },
                                {
                                    key: 'lastName',
                                    label: translate('LAST_NAME') 
                                },
                                {
                                    key: 'bio',
                                    label: translate('PROFILE_BIO'),
                                    hint: translate('PROFILE_BIO_DESC'),
                                },
                                {
                                    key: 'website',
                                    label: translate('WEBSITE')
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