import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import ORDER_STATUS from '../constants/ORDER_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import apiOrder from '../api/order';
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

    settleOrder = order => {
        const orderId = order.id;
        const orders = this.state.orders;
        const orderRef = this
            .state
            .orders
            .find(_ => _.id === orderId);

        orderRef.status = ORDER_STATUS.SETTLED;

        apiOrderActions
            .settleOrder(orderId)
            .then(_ => {
                this.setState({orders, open: false});

                return openDialog({header: translate("ORDER_SETTLED_SUCCESS")});
            }, _ => _);
    };

    initSettleOrder = order => {
        this.setState({selectedOrderId: order.id, open: true});
    };

    handleClose = () => {
        this.setState({selectedOrderId: null, open: false});
    };

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
                {this.state.ready && <div className="row">
                    <div className="col-xs-12">
                        {!this.state.isLoading && !this.state.tasks.length && <div className="col-xs-12">
                            <div className="row">
                                <p className="text-muted">{translate("NO_LISTINGS")}</p>
                            </div>
                        </div>
}
                        {!this.state.isLoading && this
                            .state
                            .tasks
                            .map((task, index) => <div
                                key={index}
                                className="col-xs-12"
                                style={{
                                marginTop: 10
                            }}>
                                <TaskListItem
                                    task={task}
                                    properties={this.state.properties}
                                    onCancel={() => openDialog({
                                    header: translate('CANCEL_LISTING_SUCCESS_HEADER'),
                                    desc: translate('CANCEL_LISTING_SUCCESS_DESC')
                                }, () => {
                                    const tasks = this.state.tasks;
                                    tasks.splice(index, 1);
                                    this.setState({tasks});
                                })}/>
                            </div>)}
                    </div>
                </div>
}
                <div>
                    <Dialog
                        actions={[ < FlatButton label = {
                            translate('CANCEL')
                        }
                        primary = {
                            true
                        }
                        onTouchTap = {
                            this.handleClose
                        } />, < FlatButton label = {
                            translate('CONFIRM')
                        }
                        primary = {
                            true
                        }
                        onTouchTap = {
                            this.settleOrder
                        } />
                    ]}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}>
                        {translate('SETTLE_ORDER')}
                    </Dialog>
                </div>

            </div>
        );
    }
};
