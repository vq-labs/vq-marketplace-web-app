import React from 'react';
import * as apiUserProperty from '../api/user-property';
import { goTo } from '../core/navigation';
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import { translate } from '../core/i18n';
import EditableEntity from '../Components/EditableEntity';
import Loader from "../Components/Loader";

const async = require("async");

export default class UserVerifications extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            verifications: {}
        };

        this.VERIFICATIONS = [
            'studentIdUrl',
            'facebookProfileUrl'
        ];
        
        this.defaultVerificationsFields = [
            {
                type: 'single-image',
                key: this.VERIFICATIONS[0],
                label: translate('USER_VERIFICATION_PERSONAL_ID_TITLE')
            }, {
                type: 'string',
                title: translate('USER_VERIFICATION_FACEBOOK_TITLE'),
                key: this.VERIFICATIONS[1],
                label: translate('USER_VERIFICATION_FACEBOOK_LABEL'),
            }
        ];

    }
    
    componentDidMount() {
        getConfigAsync(config => {
            getUserAsync(user => {
                if (!user) {
                    return goTo('/login');
                }

                this.setState({
                    config
                });

                apiUserProperty
                    .getItems(
                        user.id
                    )
                    .then(properties => {
                        const newState = {
                            ready: true,
                            isLoading: false,
                            verifications: {}
                        };

                        this.VERIFICATIONS.forEach(propKey => {
                            const property = properties
                            .find(_ => _.propKey === propKey);

                            newState.verifications[propKey] = property ?
                                property.propValue :
                                null
                        })

                        this.setState(newState);
                    });
            }, true);
        });
    }

    render() {
            return (
            <div className="container">
                { this.state.config &&
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                {translate('USER_VERIFICATION_HEADER')}
                            </h1>
                            <p className="text-muted">
                                {translate('USER_VERIFICATION_DESC')}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                            { this.state.isLoading &&
                                <Loader isLoading={true} />
                            }
                            { !this.state.isLoading &&
                                <EditableEntity
                                    canSave={!this.isSubmitting}
                                    showCancelBtn={false}
                                    value={this.state.verifications}
                                    fields={this.defaultVerificationsFields}
                                    onConfirm={updatedEntity => {
                                        this.setState({
                                            isSubmitting: true
                                        });

                                        getUserAsync(user => {
                                            async
                                            .each(this.VERIFICATIONS, (fieldKey, cb) => {
                                                apiUserProperty
                                                    .createItem(
                                                        user.id,
                                                        fieldKey,
                                                        updatedEntity[fieldKey]
                                                    )
                                                    .then(() => {
                                                        cb();
                                                    }, cb)
                                            }, err => {
                                                if (err) {
                                                    this.setState({
                                                        isSubmitting: true
                                                    });

                                                    return alert(err);
                                                }

                                                return goTo('/');
                                            })
                                        });
                                    }
                                    }
                                />
                            }
                    </div>
            </div>
            }
        </div>
      );
    }
};
