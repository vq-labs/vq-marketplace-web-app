import React from 'react';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Moment from 'react-moment';
import ReactStars from 'react-stars';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';
import { goTo } from '../core/navigation';

import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import * as DEFAULTS from '../constants/DEFAULTS';


let onOpen;

export const openRequestDialog = requests => {
    onOpen(requests);
};

export const Component = class RequestDialog extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isOpen: false,
            pendingRequests: [],
            acceptedRequests: [],
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({ config });
        });

        onOpen = requests => {
            this.setState({
                pendingRequests: requests.filter(_ => _.status === REQUEST_STATUS.PENDING),
                acceptedRequests: requests.filter(_ => _.status === REQUEST_STATUS.ACCEPTED),
                isOpen: true
            });
        }
    }

    render() {
            return (
                    <div>
                        <div>
                            <Dialog
                                onRequestClose={() => {
                                    this.setState({
                                        isOpen: false
                                    });
                                }} 
                                autoScrollBodyContent={true}
                                modal={false}
                                open={this.state.isOpen}
                            >
                                    { this.state.isOpen &&
                                    <div className="row">
                                        <h1 style={{fontWeight: 'bold'}}>{translate('REQUESTS')}</h1>
                                        
                                        <h4>{translate('PENDING_REQUESTS')}</h4>
                                        <List>
                                        {this.state.pendingRequests
                                        .sort((a, b) => b.fromUser.avgReviewRate - a.fromUser.avgReviewRate )
                                        .map((request, index) =>
                                            <ListItem
                                                key={index}
                                                onTouchTap={() => {
                                                    this.setState({
                                                        pendingRequests: [],
                                                        acceptedRequests: [],
                                                        isOpen: false
                                                    });

                                                    return goTo(`/request/${request.id}`);
                                                }}
                                                primaryText={`${request.fromUser.firstName} ${request.fromUser.lastName}`}
                                                secondaryText={
                                                    <p>
                                                        {this.state.config &&
                                                            <Moment format={`${this.state.config.DATE_FORMAT}, ${this.state.config.TIME_FORMAT}`}>{request.createdAt}</Moment>
                                                        }
                                                    </p>
                                                }
                                                leftAvatar={<Avatar src={request.fromUser.imageUrl || DEFAULTS.PROFILE_IMG_URL} />}
                                                rightIcon={
                                                    <div style={{ width: '60px' }}>
                                                        <ReactStars
                                                            edit={false}
                                                            disable={true}
                                                            count={5}
                                                            size={12}
                                                            half={false}
                                                            value={request.fromUser.avgReviewRate}
                                                            color2={'#ffd700'}
                                                        />
                                                    </div>
                                                }
                                            />
                                        )}
                                        {!this.state.pendingRequests
                                        .length &&
                                        <p className="text-muted">
                                            {translate('NO_REQUESTS')}
                                        </p>
                                        }
                                        </List>

                                        <br />
                                        <Divider />
                                        <br />

                                        <h4>{translate('ACCEPTED_REQUESTS')}</h4>
                                        <List>
                                        {this.state.acceptedRequests
                                        .sort((a, b) => b.fromUser.avgReviewRate - a.fromUser.avgReviewRate )
                                        .map((request, index) =>
                                            <ListItem
                                                key={index}
                                                onTouchTap={() => {
                                                    this.setState({
                                                        pendingRequests: [],
                                                        acceptedRequests: [],
                                                        isOpen: false
                                                    });

                                                    return goTo(`/request/${request.id}`);
                                                }}
                                                primaryText={`${request.fromUser.firstName} ${request.fromUser.lastName}`}
                                                secondaryText={
                                                    <p>
                                                        {this.state.config &&
                                                            <Moment format={`${this.state.config.DATE_FORMAT}, ${this.state.config.TIME_FORMAT}`}>{request.createdAt}</Moment>
                                                        }
                                                    </p>
                                                }
                                                leftAvatar={<Avatar src={request.fromUser.imageUrl || DEFAULTS.PROFILE_IMG_URL} />}
                                                rightIcon={
                                                    <div style={{ width: '60px' }}>
                                                        <ReactStars
                                                            edit={false}
                                                            disable={true}
                                                            count={5}
                                                            size={12}
                                                            half={false}
                                                            value={request.fromUser.avgReviewRate}
                                                            color2={'#ffd700'}
                                                        />
                                                    </div>
                                                }
                                            />
                                        )}
                                        {!this.state.acceptedRequests
                                        .length &&
                                        <p className="text-muted">
                                            {translate('NO_REQUESTS')}
                                        </p>
                                        }
                                        </List>
                                    </div>
                                    }
                                </Dialog>
                     </div>
                </div>
            );
    }
};
