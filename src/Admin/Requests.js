import React from 'react';
import Moment from 'react-moment';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List } from 'material-ui/List';
import DropDownMenu from 'material-ui/DropDownMenu';
import Loader from "../Components/Loader";
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { goTo } from '../core/navigation';
import displayObject from '../helpers/display-object';
import * as apiAdmin from '../api/admin';
import { stripHtml } from '../core/util';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';

const REQUEST_STATUS_LABEL = {};

Object
    .keys(REQUEST_STATUS)
    .forEach(STATUS_CODE => {
        REQUEST_STATUS_LABEL[REQUEST_STATUS[STATUS_CODE]] = STATUS_CODE;
    });


export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            statusFilter: undefined,
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
                        <div className="col-xs-4 col-sm-4">
                            <TextField
                                type="number"
                                
                                onChange={(ev, value) => {
                                    this.setState({
                                        listingIdSearchValue: value
                                    });
                                }}
                                value={this.state.listingIdSearchValue}
                                floatingLabelText="ListingID"
                            />
                        </div>
                        <div className="col-xs-3 col-sm-3">
                            <DropDownMenu
                                style={{
                                    marginTop: 16,
                                    width: '100%'
                                }}
                                value={this.state.statusFilter} onChange={(_, _2, statusFilter) => {
                                this.setState({
                                    statusFilter
                                })
                            }}>
                                <MenuItem value={undefined} primaryText="No filter" />
                                {
                                    Object.keys(REQUEST_STATUS)
                                    .map(status => 
                                        <MenuItem
                                            value={REQUEST_STATUS[status]}
                                            primaryText={status}
                                        />
                                    )
                                }
                            </DropDownMenu>
                        </div>
                        <div className="col-xs-3 col-sm-2">
                            <RaisedButton style={{
                                marginTop: 24
                            }} onClick={() => {
                                alert("Contact support for exporting data.");
                            }} label="Export" />
                        </div>
                    </div>

                

                    <div className="col-xs-12">
                        <List>
                            { this.state.requests
                            .filter(request => {
                                if (!request.fromUser) {
                                    return false;
                                }

                                if (!this.state.statusFilter && !this.state.listingIdSearchValue) {
                                    return true;
                                }

                                if (!this.state.statusFilter && this.state.listingIdSearchValue) {
                                    return this.state.listingIdSearchValue === request.taskId;
                                }

                                if (this.state.statusFilter && !this.state.listingIdSearchValue) {
                                    return this.state.statusFilter === request.status;
                                }

                                return this.state.statusFilter === request.status && request.taskId === this.state.listingIdSearchValue;
                            })
                            .map(request => 
                                <div className="row">
                                    <div class="col-xs-12">
                                    <div className="row">
                                            <div class="col-xs-12">
                                                <strong>ID: {request.id}, Status: {REQUEST_STATUS_LABEL[request.status]}</strong>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div class="col-xs-12">
                                                From user: <a href="#" style={{ padding: 5 }} onTouchTap={() => goTo(`/profile/${request.fromUser.id}`)}>#{request.fromUser.id} {request.fromUser.firstName} {request.fromUser.lastName}</a>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div class="col-xs-12">
                                                ListingId: <a href="#" style={{ padding: 5 }} onTouchTap={() => goTo(`/task/${request.task.id}`)}>(id: {request.task.id}) {request.task.title}</a>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div class="col-xs-12">
                                                Created: <Moment format={`${this.state.config.DATE_FORMAT}, ${this.state.config.TIME_FORMAT}`}>{request.createdAt}</Moment>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    <div class="col-xs-12" style={{'marginBottom': '10px'}}>
                                        <div className="row">
                                            <a  href="#"
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
                                                href="#"
                                                style={{ marginLeft: 10 }}
                                                onTouchTap={() => {
                                                    this.setState({
                                                        isShowingRequestMessages: true
                                                    });

                                                    apiAdmin
                                                    .request
                                                    .getRequestMessages(request.id)
                                                    .then(messages => {
                                                        this.setState({
                                                            requestMessages: messages
                                                        });
                                                    });
                                                }}>
                                                <strong>
                                                    Messages
                                                </strong>
                                            </a>
                                            <a
                                                className="hidden"
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

                    <div>
                        <Dialog
                            onRequestClose={() => {
                              this.setState({
                                isShowingRequestMessages: false,
                                requestMessages: null
                              });
                            }}
                            autoScrollBodyContent={true}
                            modal={false}
                            open={this.state.isShowingRequestMessages}
                        >
                                <div className="row" style={{ minHeight: 300}}>
                                    <div class="col-xs-12">
                                        <h1>Request messages</h1>
                                    </div>
                                    <div className="col-xs-12">
                                        { !this.state.requestMessages &&
                                            <Loader isLoading={true} />
                                        }
                                    </div>
                                    <div className="col-xs-12">
                                        { this.state.requestMessages && this.state.requestMessages
                                        .map(message =>
                                            <p>
                                                {message.fromUser.firstName} {message.fromUser.lastName} (<Moment format={`${this.state.config.DATE_FORMAT}, ${this.state.config.TIME_FORMAT}`}>{message.createdAt}</Moment>): {stripHtml(message.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                        </Dialog>
                    </div>
                </div>
            );
    }
};
