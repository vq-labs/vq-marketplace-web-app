import React from 'react';
import * as apiAdmin from '../api/admin';
import * as coreNavigation from '../core/navigation';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import { translate } from '../core/i18n';
import { displayTaskStatus } from '../core/format';
import displayObject from '../helpers/display-object';
import getProperty from '../helpers/get-user-property';
import Moment from 'react-moment';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import DropDownMenu from 'material-ui/DropDownMenu';
import TASK_STATUS from '../constants/TASK_STATUS';
import RaisedButton from 'material-ui/RaisedButton';

export default class SectionUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            showProperty: false,
            showDetails: false,
            selectedUserId: null,
            isBlockingUser: false,
            tasks: []
        };
    }
    componentDidMount() {
        apiAdmin.task
            .getItems()
            .then(tasks => {
                this.setState({ 
                    tasks
                });
            });
    }
    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                            <h1>Listings</h1>
                    </div>
                    <div className="col-xs-12">
                        <div className="col-xs-3 col-sm-3">
                            <DropDownMenu
                                style={{
                                    width: '100%'
                                }}
                                value={this.state.statusFilter} onChange={(_, _2, statusFilter) => {
                                this.setState({
                                    statusFilter
                                })
                            }}>
                                <MenuItem value={undefined} primaryText="No filter" />
                                {
                                    Object.keys(TASK_STATUS)
                                    .map(status => 
                                        <MenuItem
                                            value={TASK_STATUS[status]}
                                            primaryText={status}
                                        />
                                    )
                                }
                            </DropDownMenu>
                        </div>
                        <div className="col-xs-3 col-sm-2">
                            <RaisedButton style={{
                                marginTop: 12
                            }} onClick={() => {
                                alert("Contact support for exporting data.");
                            }} label="Export" />
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <List>
                            { this.state.tasks
                            .filter(task => {
                                if (!this.state.statusFilter) {
                                    return true;
                                }

                                return this.state.statusFilter === task.status;
                            })
                            .map(task => 
                                <ListItem
                                    primaryText={
                                        <p>
                                            {task.title}<br/>
                                            Status: <strong>{displayTaskStatus(task.status)}</strong>
                                            <br/>
                                        </p>
                                    }
                                    secondaryText={
                                        <p>
                                            Created at: <Moment format="DD.MM.YYYY, HH:MM">{task.createdAt}</Moment>
                                        </p>
                                    }
                                    rightIcon={
                                        <IconMenu
                                            iconButtonElement={
                                                <IconButton>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                            anchorOrigin={{
                                                horizontal: 'left',
                                                vertical: 'top'
                                            }}
                                            targetOrigin={{
                                                horizontal: 'left',
                                                vertical: 'top'
                                            }}
                                            >
                                            <MenuItem
                                                primaryText="Show Owner Email"
                                                onClick={() => {
                                                    apiAdmin.users
                                                        .getUserEmail(task.userId)
                                                        .then(userEmails => {
                                                            this.setState({
                                                                showDetails: true,
                                                                selectedUser: userEmails
                                                            });
                                                        });
                                                }}
                                            />
                                            <MenuItem
                                                primaryText="Show full information"
                                                onClick={() => {
                                                    this.setState({
                                                        showDetails: true,
                                                        selectedUser: task
                                                    })
                                                }}
                                            />
                                            
                                            <MenuItem
                                                primaryText="Go to listing page"
                                                onClick={() => coreNavigation.goTo(`/task/${task.id}`)}
                                            />
                                            { String(task.status) !== '99' &&
                                                <MenuItem
                                                    onClick={() => {
                                                        openConfirmDialog({
                                                            headerLabel: 'Mark the listing as spam',
                                                            confirmationLabel: `Listing "${task.title}" (id: ${task.id}) will be marked as spam, the owner will be notified and the listing will disapear from the "Browse" page. It is only possible to mark unassigned tasks as spam. Beware that once a task are marked as spam, this process cannot be reversed. Are you sure?`
                                                        }, () => {
                                                            apiAdmin.task
                                                            .markAsSpam(task.id)
                                                            .then(_ => {
                                                                const tasks = this.state.tasks;

                                                                const taskRef = tasks
                                                                    .find(_ => _.id === task.id);

                                                                taskRef.status = '99';

                                                                this.setState({
                                                                    tasks
                                                                });

                                                                alert('OK! Task has been marked as spam.');
                                                            }, err => {
                                                                if (err.code === "TASK_IS_NOT_ACTIVE") {
                                                                    return alert('TASK_IS_NOT_ACTIVE: You can only mark active tasks as spam.');
                                                                }
                                                                
                                                                return alert(`Unknown error occured ${err}`);
                                                            })
                                                        })
                                                    }}
                                                    primaryText="Mark as spam"
                                                />
                                            }
                                        </IconMenu>
                                    }
                                >
                                </ListItem>
                            )}
                        </List>
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
                                        const USER_STATUS_BLOCKED = isBlocking ? '20' : '10';

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
                                Block user #{this.state.selectedUserId}
                            </Dialog>

                            <div>
                                <Dialog
                                    autoScrollBodyContent={true}
                                    actions={[
                                        <FlatButton
                                            label={'OK'}
                                            primary={true}
                                            onTouchTap={() => this.setState({
                                                showDetails: false,
                                                selectedUser: null
                                            })}
                                        />
                                    ]}
                                    modal={false}
                                    open={this.state.showDetails}
                                    >
                                        <div className="container">
                                            { displayObject(this.state.selectedUser || {})}
                                        </div>
                                </Dialog>
                            </div>


                            <div>
                                <Dialog
                                    autoScrollBodyContent={true}
                                    actions={[
                                        <FlatButton
                                            label={'OK'}
                                            primary={true}
                                            onTouchTap={() => this.setState({
                                                showProperty: false,
                                                propertyName: null,
                                                selectedUser: null,
                                            })}
                                        />
                                    ]}
                                    modal={false}
                                    open={this.state.showProperty}
                                    >
                                        <div className="container">
                                            <div className="col-xs-12">
                                                    { this.state.showProperty &&
                                                        <img
                                                            alt="presentation"
                                                            width={400}
                                                            height={400}
                                                            src={getProperty(this.state.selectedUser, 'studentIdUrl')}
                                                        />
                                                    }
                                            </div>
                                            <div className="col-xs-12">
                                                { this.state.showProperty &&
                                                    <a href={getProperty(this.state.selectedUser, 'studentIdUrl')} target="_blank">Open in a separate page</a>
                                                }
                                            </div>
                                        </div>
                                </Dialog>
                            </div>
                        </div>
                     </div>
            );
    }
};
