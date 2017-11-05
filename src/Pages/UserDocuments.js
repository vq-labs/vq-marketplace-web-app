import React from 'react';
import * as apiUserProperty from '../api/user-property';
import EditableEntity from '../Components/EditableEntity';
import Loader from "../Components/Loader";
import { goTo } from '../core/navigation';
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import { translate } from '../core/i18n';

import { getParams } from '../core/util.js';

const async = require("async");

export default class UserDocuments extends React.Component {
    constructor() {
        super();

        const redirectTo = getParams(location.search).redirectTo;

        this.state = {
            redirectTo,
            isLoading: true,
            documents: {}
        };

        this.DOCUMENTS = [
            'referenceUrl',
        ];
        
        this.defaultDocumentsFields = [
            {
                type: 'single-file',
                key: this.DOCUMENTS[0]            }
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
                            documents: {}
                        };
                      
                        this.DOCUMENTS
                            .forEach(propKey => {
                                const property = properties
                                .find(_ => _.propKey === propKey);

                                newState.documents[propKey] = property ?
                                    property.propValue :
                                    null
                            });

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
                                {translate('USER_DOCUMENTS_HEADER')}
                            </h1>
                            <p className="text-muted">
                                {translate('USER_DOCUMENTS_DESC')}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                            { this.state.isLoading &&
                                <Loader isLoading={true} />
                            }
                            { !this.state.isLoading &&
                                <EditableEntity
                                    enableSkip={true}
                                    saveLabel={translate(this.state.redirectTo ?  "SAVE" : "CONTINUE")}
                                    canSave={!this.isSubmitting}
                                    showCancelBtn={false}
                                    value={this.state.documents}
                                    fields={this.defaultDocumentsFields}
                                    onConfirm={updatedEntity => {
                                        this.setState({
                                            isSubmitting: true
                                        });

                                        getUserAsync(user => {
                                            async
                                            .eachSeries(this.DOCUMENTS, (propKey, cb) => {
                                                const propValue = updatedEntity[propKey];
                                                
                                                apiUserProperty
                                                    .createItem(
                                                        user.id,
                                                        propKey,
                                                        propValue
                                                    )
                                                    .then(() => {
                                                        getUserAsync(user => {
                                                            const property = user
                                                                .userProperties
                                                                .find(_ => _.propKey === propKey);

                                                            if (!property) {
                                                                user.userProperties
                                                                .push({
                                                                    propKey,
                                                                    propValue
                                                                });
                                                            } else {
                                                                property.propValue = propValue;
                                                            }

                                                            return cb();
                                                        });
                                                    }, cb)
                                            }, err => {
                                                if (err) {
                                                    this.setState({
                                                        isSubmitting: true
                                                    });

                                                    return alert(err);
                                                }

                                                return goTo(this.state.redirectTo ? this.state.redirectTo : '/dashboard');
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
