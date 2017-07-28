import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import apiOrder from '../api/order';
import { translate } from '../core/i18n';
import * as coreAuth from '../core/auth';
import * as coreFormat from '../core/format';
import { goTo } from '../core/navigation';
import RaisedButton from 'material-ui/RaisedButton';

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
                        <div className="text-center col-xs-12 col-sm-6 col-md-4">
                            <h3>{order.task.title}</h3>
                            <h3>
                                {coreFormat.displayPrice(order.task.price, order.task.currency)}
                            </h3>
                            <RaisedButton
                                label={translate('CONFIRM_BOOKING')}
                                primary={true}
                            />
                        </div>
                    )}
                    </div>
                </div>
            }
        </div>
      );
   }
};
