import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ORDER_STATUS from '../constants/ORDER_STATUS';
import apiOrder from '../api/order';
import * as apiOrderActions from '../api/orderActions';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Moment from 'react-moment';
import ListingHeader from '../Components/ListingHeader';
import { displayPrice, displayLocation, displayListingDesc }  from '../core/format';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import displayTaskTiming from '../helpers/display-task-timing';

export default class Bookings extends Component {
  constructor(props) {
    super();

    this.state = {
        view: props.view,
        ready: false,
        open: false,
        isLoading: true,
        orders: []
    };
  }
  
  settleOrder = order => {
    const orderId = order.id;
    const orders = this.state.orders;
    const orderRef = this.state.orders
        .find(_ => _.id === orderId);
    
    orderRef.status = ORDER_STATUS.SETTLED;

    apiOrderActions
    .settleOrder(orderId)
    .then(_ => _, _ => _);

    this.setState({
        orders,
        open: false
    });
  };

  initSettleOrder = order => {
    this.setState({
        selectedOrderId: order.id,
        open: true
    });
  };

  handleClose = () => {
    this.setState({
        selectedOrderId: null,
        open: false
    });
  };

  componentDidMount() {
    getConfigAsync(config => {
        const queryObj = {};

        if (this.state.view) {
            queryObj.view = this.state.view;
        }

        apiOrder
            .getItems(queryObj)
            .then(orders => {
                this.setState({
                    ready: true,
                    config,
                    orders,
                    isLoading: false
                });

                this.props.onReady && this.props.onReady();
            });
    });
  }

  getUserPhoneFromOrder(order) {
    const user = order.fromUser;
    const userProperty = user.userProperties
        .find(_ => _.propKey === 'phoneNo');

    if (userProperty) {
        return user.userProperties
            .find(_ => _.propKey === 'phoneNo')
            .propValue;
    }

    return '?';
  }

  render() {
    return (
        <div className="container">
            { this.state.ready &&
                <div className="row">
                    <div className="col-xs-12">
                    { this.props.showTitle &&
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                            {translate('YOUR_BOOKINGS')}
                        </h1>
                    }
                    { !this.state.isLoading && !this.state.orders.length &&
                        <div className="col-xs-12">
                            <div className="row">
                                { this.state.view === 'in_progress' &&
                                    <p className="text-muted">
                                        {translate("NO_ORDERS_IN_PROGRESS")}
                                    </p>
                                }
                                { this.state.view === 'completed' &&
                                    <p className="text-muted">
                                        {translate("NO_ORDERS_COMPLETED")}
                                    </p>
                                }
                            </div>
                        </div>
                    }
                    { !this.state.isLoading && this.state.orders.map(order =>
                        <div 
                            className="col-xs-12"
                            style={{ marginTop: 10 }}
                        >
                            <Paper style={{ padding: 10 }}>
                                <ListingHeader
                                    config={this.state.config}
                                    task={order.task}
                                />
                        
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 text-left">
                                        <div style={{ marginTop: 18 }}>
                                            { order.status === ORDER_STATUS.PENDING &&
                                                <p className="text-muted">
                                                    <strong>{translate("ORDER_IN_PROGRESS")}</strong>
                                                </p>
                                            }

                                            { order.status === ORDER_STATUS.SETTLED &&
                                                <p className="text-muted">
                                                    <strong>{translate("ORDER_SETTLED")}</strong>
                                                </p>
                                            }

                                            { order.status === ORDER_STATUS.MARKED_DONE &&
                                                <p className="text-muted">
                                                    <strong>{translate("ORDER_MARKED_DONE")} ({translate("ORDER_AUTOSETTLEMENT_ON")} <Moment format="DD.MM.YYYY, HH:MM">{(new Date(order.autoSettlementStartedAt).addHours(8))}</Moment>)</strong>
                                                    <br />
                                                    <a href="#" onTouchTap={() => {
                                                        openConfirmDialog({
                                                            headerLabel: translate("REVOKE_AUTOSETTLEMENT"),
                                                            confirmationLabel: translate("REVOKE_AUTOSETTLEMENT_DESC")
                                                        }, () => {
                                                            apiOrderActions
                                                            .revokeAutoSettlement(order.id)
                                                            .then(() => {
                                                                return alert(translate("SUCCESS"));
                                                            }, err => {
                                                                return alert(translate("ERROR"));
                                                            });
                                                        });
                                                    }}>
                                                        {translate("REVOKE_AUTOSETTLEMENT")}
                                                    </a>
                                                </p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 text-right">
                                        <div style={{ 
                                                display: 'inline-block',
                                                padding: 5
                                        }}>
                                            <IconButton
                                                style={{ bottom: 5 }}
                                                onClick={() => goTo(`/profile/${order.fromUser.id}`)}
                                                tooltip={
                                                    `${order.fromUser.firstName} ${order.fromUser.lastName}`
                                                }
                                            >
                                                <Avatar src={order.fromUser.imageUrl || '/images/avatar.png'} />
                                            </IconButton>
                                        </div>
                                        { order.status !== ORDER_STATUS.SETTLED && 
                                            <IconButton
                                                style={{ top: 5 }}
                                                tooltip={this.getUserPhoneFromOrder(order)}>
                                                <IconCall />
                                            </IconButton>
                                        }
                                        { order.status !== ORDER_STATUS.SETTLED && 
                                            <div style={{ 
                                                display: 'inline-block',
                                            }}>
                                                <IconButton
                                                    style={{ top: 5 }}
                                                    tooltip={'Chat'}
                                                    onClick={() => goTo(`/chat/${order.request.id}`)}
                                                >
                                                
                                                    <IconChatBubble />
                                                </IconButton>
                                            </div>
                                        }
                                        { order.status !== ORDER_STATUS.SETTLED &&
                                            <RaisedButton
                                                label={translate('SETTLE_ORDER')}
                                                labelStyle={{color: 'white '}}
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                onTouchTap={() => {
                                                    openConfirmDialog({
                                                        headerLabel: translate('SETTLE_ORDER')
                                                    },() => {
                                                        this.settleOrder(order);
                                                    });
                                                }}
                                            />
                                        }
                                        { order.status === ORDER_STATUS.SETTLED &&
                                            !order.review &&
                                            <div style={{
                                                display: 'inline-block',
                                                padding: 10
                                            }}>
                                                <RaisedButton
                                                    labelStyle={{color: 'white '}}
                                                    backgroundColor={this.state.config.COLOR_PRIMARY}
                                                    label={translate('LEAVE_REVIEW')}
                                                    onTouchTap={() => {
                                                        goTo(`/order/${order.id}/review`);
                                                    }}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    )}
                    </div>
                </div>
            }
            <div>
                <Dialog
                actions={[
                    <FlatButton
                        label={translate('CANCEL')}
                        primary={true}
                        onTouchTap={this.handleClose}
                    />,
                    <FlatButton
                        label={translate('CONFIRM')}
                        primary={true}
                        onTouchTap={this.settleOrder}
                    />,
                ]}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                >
                    {translate('SETTLE_ORDER')}
                </Dialog>
            </div>


        </div>
      );
   }
};
