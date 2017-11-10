import React from 'react';
import apiUser from '../api/user';
import displayObject from '../helpers/display-object';
import { Tabs, Tab } from 'material-ui/Tabs';
import { goTo } from '../core/navigation';
import { getUserAsync } from '../core/auth';

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        const userId = this.props.params.userId;

        this.state = {
            userId,
            user: null
        };
    }

    componentDidMount() {
        getUserAsync(user => {
            if (!user) {
                return goTo('/');
            }

            if (!user.isAdmin) {
                return goTo('/');
            }
  
            apiUser
            .getItem(this.state.userId, null, {
                adminView: true
            })
            .then(user => {
                this.setState({
                    user
                });
            });

        }, true);
    }

    render() { 
        return (
            <div className="container">
          
                {this.state.user &&
                    <div className="col-xs-12">
                        <div className="row">
                            <h2>{this.state.user.firstName} {this.state.user.lastName}</h2>
                        </div>
        
                        <div className="row">
                        <Tabs>
                                <Tab label="Basics" >
                                    <div>
                                        <h2>Basics</h2>
                                        <h3>{this.state.user.firstName} {this.state.user.lastName}</h3>
                                        <img
                                            alt={`${this.state.user.firstName} ${this.state.user.lastName}`}
                                            src={this.state.user.imageUrl}
                                        />
                                    </div>
                                </Tab>
                                <Tab label="Preferences" >
                                    <div>
                                        <h2>Preferences</h2>
                                        {displayObject(this.state.user.userPreferences, {
                                            doNotTrim: true
                                        })}
                                    </div>
                                </Tab>
                                <Tab
                                label="Documents"
                                >
                                    <div>
                                        <h2>Documents</h2>
                                        {displayObject(this.state.user.userProperties.filter(_ => _.propKey === 'referenceUrl'), {
                                            doNotTrim: true
                                        })}
                                    </div>
                                </Tab>
                                <Tab
                                label="Email prefs"
                                >
                                    <div>
                                        <h2>Documents</h2>
                                        {displayObject(this.state.user.userProperties.filter(_ => _.propKey.indexOf('EMAIL') > -1), {
                                            doNotTrim: true
                                        })}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                }
            </div>
        );
  }
}