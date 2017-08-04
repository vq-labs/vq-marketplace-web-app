import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import apiOrder from '../api/order';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconCall from 'material-ui/svg-icons/communication/call';
import IconChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import * as coreAuth from '../core/auth';
import * as coreFormat from '../core/format';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { getConfigAsync } from '../core/config';

export default class Bookings extends Component {
  constructor() {
      super();

      this.state = {
        open: false,
        isLoading: true,
        orders: []
      };

  }
  
  settleOrder = () => {
    const orderId = this.state.selectedOrderId;
    const orders = this.state.orders;
    const order = this.state.orders
        .find(_ => _.id === orderId);
    
    order.status = 10;

    apiOrder.updateItem(orderId);

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
        apiOrder
            .getItems()
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

  render() {
    return (
        <div className="container">
            { this.state.ready && !this.state.orders.length &&
                <div className="row">
                    <div className="col-xs-12">
                    <h1 style={{color: this.state.config.COLOR_PRIMARY}}>{translate('YOUR_BOOKINGS')}</h1>
                    { !this.state.isLoading && !this.state.orders.length &&
                        <div className="col-xs-12">
                            <div className="row">
                                <p className="text-muted">{translate("NO_BOOKINGS")}</p>
                            </div>
                        </div>
                    }
                    { !this.state.isLoading && this.state.orders.map(order =>
                        <div className="col-xs-12">
                            <h3>{order.task.title}</h3>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 text-left"> 
                                     <h3>
                                        {coreFormat.displayPrice(order.task.price, order.task.currency)}
                                    </h3>
                                    { order.status === 10 &&
                                        <p className="text-muted">
                                            {translate("SETTLED")}
                                        </p>
                                    }
                                </div>
                                <div className="col-xs-12 col-sm-6 text-right">
                                    <IconButton
                                        onClick={() => goTo(`/profile/${order.fromUser.id}`)}
                                        tooltip={
                                            `${order.fromUser.firstName} ${order.fromUser.lastName}`
                                        }
                                    >
                                        <Avatar src={order.fromUser.imageUrl || '/images/avatar.png'} />
                                    </IconButton>
                                    <IconButton tooltip={
                                            order.fromUser.userProperties
                                            .find(_ => _.propKey === 'phoneNo')
                                            .propValue
                                        }>
                                        <IconCall />
                                    </IconButton>
                                    <IconButton 
                                        tooltip={'Chat'}
                                        onClick={() => goTo(`/chat/${order.request.id}`)}
                                    >
                                        <IconChatBubble />
                                    </IconButton>
                                    { order.status !== 10 &&
                                        <RaisedButton
                                            label={translate('CONFIRM_BOOKING')}
                                            primary={true}
                                            onTouchTap={() => this.initSettleOrder(order)}
                                        />
                                    }
                                </div>
                            </div>
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
