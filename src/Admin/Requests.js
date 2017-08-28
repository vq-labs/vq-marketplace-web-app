import React from 'react';
import Moment from 'react-moment';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List } from 'material-ui/List';
import { goTo } from '../core/navigation';
import displayObject from '../helpers/display-object';
import * as apiAdmin from '../api/admin';

export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            requests: []
        };
    }

    componentDidMount() {
        apiAdmin.request
        .getItems()
        .then(requests => {
            this.setState({ 
                requests
            });
        });
    }

    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Requests</h1>
                    </div>
                    <div className="col-xs-12">
                        <List>
                            { this.state.requests
                            .map(request => 
                                <div className="row">
                                    <div class="col-xs-12">
                                    <div className="row">
                                            <div class="col-xs-12">
                                                <strong>Request #{request.id}</strong>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div class="col-xs-12">
                                                From user: <a style={{ padding: 5 }} onTouchTap={() => goTo(`/profile/${request.fromUser.id}`)}>#{request.fromUser.id} {request.fromUser.firstName} {request.fromUser.lastName}</a>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div class="col-xs-12">
                                                Listing: <a style={{ padding: 5 }} onTouchTap={() => goTo(`/task/${request.task.id}`)}>#{request.task.id} {request.task.title}</a>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div class="col-xs-12">
                                                Created: <Moment format="DD.MM.YYYY, HH:MM">{request.createdAt}</Moment>
                                            </div>
                                        </div>

                                        
                                    </div>

                                    <div class="col-xs-12" style={{'marginBottom': '10px'}}>
                                        <div className="row">
                                            <a
                                                onTouchTap={() => {
                                                    this.setState({
                                                        showDetails: true,
                                                        selectedRequest: request
                                                    })
                                                }}>
                                                <strong>
                                                    Show full information
                                                </strong>
                                            </a>
                                            <a 
                                                style={{ marginLeft: 10 }}
                                                onTouchTap={() => goTo(`/request/${request.id}`)}>
                                                <strong>
                                                    Messages
                                                </strong>
                                            </a>
                                            <a
                                                style={{ marginLeft: 10 }} 
                                                onTouchTap={() => alert('@TODO')}>
                                                <strong>
                                                    Mark as spam
                                                </strong>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <hr />
                                    </div>
                                </div>
                            )}
                        </List>
                    </div>

                    <div>
                        <Dialog
                            autoScrollBodyContent={true}
                            actions={[
                                <FlatButton
                                    label={'OK'}
                                    primary={true}
                                    onTouchTap={() => this.setState({
                                        showDetails: false,
                                        selectedRequest: null
                                    })}
                                />
                            ]}
                            modal={false}
                            open={this.state.showDetails}
                            >
                                <div className="container">
                                    { displayObject(this.state.selectedRequest || {})}
                                </div>
                        </Dialog>
                    </div>
                </div>
            );
    }
};
