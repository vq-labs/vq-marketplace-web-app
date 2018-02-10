import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import ORDER_STATUS from '../constants/ORDER_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import apiOrder from '../api/order';
import Loader from "../Components/Loader";
import apiTask from '../api/task';
import * as apiOrderActions from '../api/orderActions';
import TaskListItem from './TaskListItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Moment from 'react-moment';
import ListingHeader from '../Components/ListingHeader';
import {goTo} from '../core/navigation';
import {translate} from '../core/i18n';
import {CONFIG} from '../core/config';
import {getUserAsync} from '../core/auth';
import {openConfirmDialog} from '../helpers/confirm-before-action.js';
import {openDialog} from '../helpers/open-message-dialog.js';
import getUserProperty from '../helpers/get-user-property';

export default class Bookings extends Component {
    constructor(props) {
        super();
        this.state = {
            view: props.view,
            ready: false,
            open: false,
            status: props.status,
            isLoading: true,
            tasks: [],
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

            apiTask
                .getItems(queryObj)
                .then(tasks => {
                    console.log('tt', tasks)
                    this.setState({ready: true, tasks, isLoading: false});

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
                    this.state.ready &&
                    <div className="row">
                        <div className="col-xs-12">
                            {
                                !this.state.isLoading &&
                                !this.state.tasks.length &&
                                <div className="col-xs-12">
                                    <div className="row">
                                        <p className="text-muted">{translate("NO_LISTINGS")}</p>
                                    </div>
                                </div>
                            }
                            {
                                !this.state.isLoading &&
                                this
                                .state
                                .tasks
                                .map(
                                    (task, index) =>
                                    <div
                                        key={index}
                                        className="col-xs-12"
                                        style={{marginTop: 10}}>
                                        <TaskListItem
                                            task={task}
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
