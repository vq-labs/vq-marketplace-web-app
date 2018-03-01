import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from "../../Components/Loader";
import { translate } from '../../core/i18n';
import { getUserAsync } from '../../core/auth';
import { CONFIG } from '../../core/config';
import { goTo, convertToAppPath } from '../../core/navigation';
import * as apiUserProperty from '../../api/user-property';

export default class UserPropsEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            dirty: false,
            data: {} 
        };
    }

    componentDidMount() {
        getUserAsync(user => {
            if (!user) {
                return goTo(`/login?redirectTo=${convertToAppPath(location.pathname)}`);
            }

            const data = this.state.data;

            /**
             * This needs to be adjusted in the future for new emailing system
             */

            const SUPPLY_SIDE_EMAILS = [
                "review-left",
                "request-marked-as-done",
                "request-completed",
                "message-received",
                "review-left"
            ];

            const DEMAND_SIDE_EMAILS = [
                "new-order",
                "message-received",
                "review-left",
                "order-marked-as-done",
                "order-completed",
                "order-closed"
            ];

            if (CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED === "1") {
                DEMAND_SIDE_EMAILS.push("new-request-received");
                DEMAND_SIDE_EMAILS.push("task-request-cancelled");
                DEMAND_SIDE_EMAILS.push("listing-cancelled");

                SUPPLY_SIDE_EMAILS.push("new-task");
                SUPPLY_SIDE_EMAILS.push("request-accepted");
                SUPPLY_SIDE_EMAILS.push("request-cancelled");
                SUPPLY_SIDE_EMAILS.push("request-closed");
                SUPPLY_SIDE_EMAILS.push("request-declined");
                SUPPLY_SIDE_EMAILS.push("new-request-sent");
            }

            if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") {
                SUPPLY_SIDE_EMAILS.push("new-order-for-supply")
            }
            
            
            const EMAILS = user.userType === 1 ? DEMAND_SIDE_EMAILS : SUPPLY_SIDE_EMAILS;
            const emailCodes = EMAILS.map(code => `EMAIL_${code}`);
            
            this.setState({
                emails: emailCodes
            });
               
            const propertyCodes = JSON.parse(JSON.stringify(emailCodes));

            propertyCodes
            .forEach(userPropertyKey => {
                let property = user.userProperties
                    .find(_ => _.propKey === userPropertyKey);

                if (!property) {
                    property = {
                        propKey: userPropertyKey,
                        propValue: null
                    };

                    user
                    .userProperties
                    .push(userPropertyKey);

                    data[userPropertyKey] = false;
                } else {
                    switch (property.propValue) {
                        case '1':
                            data[userPropertyKey] = true;
                            break;
                        case '0':
                            data[userPropertyKey] = false;
                            break;
                        default:
                            data[userPropertyKey] = property.propValue;
                    }
                }
            });

            // we introduce some timeout because it feels a little bit smoother
            setTimeout(() => {
                this.setState({
                    data,
                    isLoading: false
                });
            }, 450);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                {
                    this.state.isLoading &&
                    <Loader isLoading={true} />
                }
                {
                    !this.state.isLoading &&
                    this.state.emails &&
                    this.state.emails
                    .map(emailCode => {
                        const propKey = emailCode;

                        return <div className="col-xs-12" key={emailCode}>
                            <Checkbox
                                checked={!this.state.data[propKey]}
                                label={translate(propKey)}
                                onCheck={() => {
                                    const data = this.state.data;

                                    data[propKey] = !data[propKey];

                                    this.setState({
                                        data,
                                        dirty: true
                                    });
                                }}
                            />
                        </div>
                    })
                }
                { !this.state.isLoading &&
                    <RaisedButton
                        style={{ marginTop: 10 }}
                        disabled={!this.state.dirty}
                        primary={true}
                        onTouchTap={() => {
                            const data = this.state.data;

                            this.setState({
                                dirty: false
                            });

                            getUserAsync(user => Object
                                .keys(data)
                                .forEach(propKey => {
                                    let property = user.userProperties
                                        .find(_ => _.propKey === propKey);

                                    // here we update the user object so when he goes back and forth to the page he sees the current checks.
                                    if (!property) {
                                        property = {
                                            propKey: propKey,
                                            propValue: false
                                        };
                    
                                        user
                                        .userProperties
                                        .push(property);
                                    } else {
                                        property.propValue = data[propKey];
                                    }
                                    
                                    apiUserProperty
                                    .createItem(
                                        user.id,
                                        propKey,
                                        data[propKey]
                                    )
                                    .then(_ => _, _ => _);
                                })
                            );
                        }}
                        label={translate('UPDATE')}
                    />
                }
            </div>
        </div>
    )}
}
