import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';
import { goTo } from '../core/navigation';
import { resendVerificationEmail, me } from '../api/auth';

export default class EmailNotVerified extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            sentAgain: false,
            ready: false,
        };
    }
   
    componentDidMount() {
        getConfigAsync(config => {
            me().then(user => {
                if (!user) {
                    return goTo('/login');
                }

                if (user.status === "10" && user.userType === 1) {
                    return goTo('/new-listing');
                }

                if (user.status === '10') {
                    return goTo('/');
                }

                this.setState({
                    user,
                    ready: true,
                    config
                })
            }, err => {
                if (err) {
                    return goTo('/login');
                }
            });
        });
    }
    
    render() {
        return (
            <div className="container">
                 { this.state.ready &&
                    <div className="row">
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                        {translate("EMAIL_NOT_VERIFIED_HEADER")}
                                    </h1>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>
                                        {translate("EMAIL_NOT_VERIFIED_DESC")}
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    { !this.state.sentAgain &&
                                        <RaisedButton
                                            onClick={() => {
                                                this.setState({
                                                    sentAgain: true
                                                });
                                                
                                                resendVerificationEmail({
                                                    userId: this.state.user.id
                                                });
                                            }}
                                            label={translate("RESEND_VERIFICATION_EMAIL")}
                                        />
                                    }

                                    { this.state.sentAgain && 
                                        <p>{translate("VERIFICATION_EMAIL_SENT")}</p>
                                    }
                                    { translate("RELOAD") !== 'RELOAD' &&
                                        <RaisedButton
                                            style={{ marginLeft: 10 }}
                                            onClick={() => {
                                                location.reload();
                                            }}
                                            label={translate("RELOAD")}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
