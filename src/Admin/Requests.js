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
                                min={1}
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
                    <table className="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">From user</th>
                                    <th scope="col">Listing</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Reviews</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.requests
                                .filter(request => {
                                    if (!request.fromUser) {
                                        return false;
                                    }

                                    if (!this.state.statusFilter && !this.state.listingIdSearchValue) {
                                        return true;
                                    }

                                    if (!this.state.statusFilter && this.state.listingIdSearchValue) {
                                        return String(this.state.listingIdSearchValue) === String(request.taskId);
                                    }

                                    if (this.state.statusFilter && !this.state.listingIdSearchValue) {
                                        return this.state.statusFilter === request.status;
                                    }

                                    return this.state.statusFilter === request.status && String(request.taskId) === String(this.state.listingIdSearchValue);
                                })
                                .map(request =>
                                <tr>
                                   <td>
                                        {request.id}
                                   </td>
                                   <td>
                                        (#{request.fromUser.id}) {request.fromUser.firstName} {request.fromUser.lastName}
                                    </td>
                                    <td>
                                        (#{request.task.id}) {request.task.title}
                                    </td>
                                    
                                    <td>
                                        {REQUEST_STATUS_LABEL[request.status]}
                                    </td>
                                    <td>
                                        Provider: {request.review ? 'Yes' : 'No'}<br />
                                        Client: {request.order && request.order.review ? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        <Moment format={`DD.MM.YYYY, HH:mm`}>{request.createdAt}</Moment>
                                    </td>
                                    <td>
                                        <a
                                        className="vq-row-option"
                                        href="#"
                                        onTouchTap={() => {
                                            apiAdmin.users
                                            .getUserEmail(request.fromUserId)
                                            .then(userEmails => {
                                                this.setState({
                                                    showDetails: true,
                                                    selectedRequest: userEmails
                                                });
                                            });
                                        }}>Email</a>

                                        <a className="vq-row-option" href="#" onTouchTap={() => {
                                            this.setState({
                                                showDetails: true,
                                                selectedRequest: request
                                            })
                                        }}>Details</a>

                                        <a className="vq-row-option" href="#" onTouchTap={() => {
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
                                        }}>Messages</a>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
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
                                                {message.fromUser.firstName} {message.fromUser.lastName} (<Moment format={`DD.MM.DD, HH:mm`}>{message.createdAt}</Moment>): {stripHtml(message.message)}
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
