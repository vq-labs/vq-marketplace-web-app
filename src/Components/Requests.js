import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Loader from "../Components/Loader";
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import ListingHeader from '../Components/ListingHeader';
import Moment from 'react-moment';
import RequestListItem from './RequestListItem';
import * as apiRequest from '../api/request';
import {goTo} from '../core/navigation';
import {translate} from '../core/i18n';
import {openConfirmDialog} from '../helpers/confirm-before-action.js';
import {openDialog} from '../helpers/open-message-dialog.js';
import {CONFIG} from '../core/config';
import {getUserAsync} from '../core/auth';
import {getUtcUnixTimeNow} from '../core/util';
import getUserProperty from '../helpers/get-user-property';
import {factory as errorFactory} from '../core/error-handler';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';

export default class Requests extends Component {
    constructor(props) {
        super();

        this.state = {
            view: props.view,
            status: props.status,
            isLoading: true,
            requests: [],
            properties: props.properties
        };
    }

    componentDidMount() {
        getUserAsync(user => {
            const queryObj = {};

            if (this.state.status) {
                queryObj.status = this.state.status;
            }
            queryObj.userId = user.id;

            apiRequest
                .getItems(queryObj)
                .then(requests => {
                    this.setState({requests, isLoading: false});

                    this.props.onReady && this
                        .props
                        .onReady();
                });
        });
    }

    render() {
        return (
            <div className="container">
                {
                    this.state.isLoading && <Loader isLoading={true}/>
                }
                {
                    !this.state.isLoading &&
                    <div className="row">
                        <div className="col-xs-12">
                            {
                                !this.state.isLoading &&
                                !this.state.requests.length &&
                                <div className="col-xs-12">
                                    <div className="row">
                                        <p className="text-muted">{translate("NO_REQUESTS")}</p>
                                    </div>
                                </div>
                            }
                            {
                                !this.state.isLoading &&
                                this
                                .state
                                .requests
                                .map(
                                    (request, index) => 
                                    <div
                                        key={index}
                                        className="col-xs-12"
                                        style={{marginTop: 10}}>
                                        <RequestListItem
                                            request={request}
                                            properties={this.state.properties}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
};
