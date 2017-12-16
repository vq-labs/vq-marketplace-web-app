import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Moment from 'react-moment';
import * as apiAdmin from '../api/admin';
import { translate } from '../core/i18n';

export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedUserId: null,
            isBlockingUser: false,
            orders: []
        };
    }
    componentDidMount() {
        apiAdmin
        .order
        .getItems()
        .then(orders => {
            this.setState({ 
                orders
            });
        });
    }
    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                            <h1>Transactions</h1>
                    </div>
                    <div className="col-xs-12">
                        <table className="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Client</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.orders
                            .map(order => 
                               <tr>
                                   <td>
                                        {order.id}
                                   </td>
                                   <td>
                                        {order.amount} {order.currency}
                                   </td>
                                   <td>
                                        {order.task.title}
                                   </td>
                                   <td>
                                        {order.user.firstName} {order.user.lastName} (#{order.user.id})
                                   </td>
                                   <td>
                                        <Moment format={`DD.MM.DD, HH:mm`}>{order.createdAt}</Moment>
                                   </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <Dialog
                            actions={[
                                <FlatButton
                                    label={translate('CANCEL')}
                                    primary={true}
                                    onTouchTap={() => this.setState({
                                        isBlockingUser: false,
                                        isUnblockingUser: false,
                                        selectedUserId: null
                                    })
                                    }
                                />,
                                <FlatButton
                                    label={translate('CONFIRM')}
                                    primary={true}
                                    onTouchTap={() => {
                                        const users = this.state.users;
                                        const userId = this.state.selectedUserId;
                                        const isBlocking = this.state.isBlockingUser;
                                        const USER_STATUS_BLOCKED = isBlocking ? 20 : 10;

                                        users
                                            .find(_ => _.id === userId)
                                            .status = USER_STATUS_BLOCKED;

                                        apiAdmin
                                            .users[
                                                isBlocking ? 'blockUser' : 'unblockUser'
                                            ](userId);

                                        this.setState({
                                            users,
                                            isBlockingUser: false,
                                            isUnblockingUser: false,
                                            selectedUserId: null
                                        });
                                    }}
                                />,
                            ]}
                            modal={false}
                            open={this.state.isBlockingUser || this.state.isUnblockingUser}
                            >
                                Delete user #{this.state.selectedUserId}
                            </Dialog>
                        </div>
                     </div>
            );
    }
};
