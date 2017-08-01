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

export default class Bookings extends Component {
  constructor() {
      super();

      this.state = {
        isLoading: true,
        orders: []
      };

  }
  
  componentDidMount() {
    apiOrder
      .getItems()
      .then(orders => this.setState({
        orders,
        isLoading: false
      }))
  }

  render() {
    return (
        <div className="container">
            { !this.state.orders.lenght &&
                <div className="row">
                    <div className="col-xs-12">
                    <h1>{translate('YOUR_BOOKINGS')}</h1>
                    { !this.state.isLoading && this.state.orders.map(order =>
                        <div className="col-xs-12">
                            <h3>{order.task.title}</h3>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 text-left"> 
                                     <h3>
                                        {coreFormat.displayPrice(order.task.price, order.task.currency)}
                                    </h3>

                                    
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
                                    <RaisedButton
                                        label={translate('CONFIRM_BOOKING')}
                                        primary={true}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            }
        </div>
      );
   }
};
