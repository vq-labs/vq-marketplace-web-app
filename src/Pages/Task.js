import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import DOMPurify from 'dompurify'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import RequestDialog from '../Components/RequestDialog';
import TaskCategories from '../Partials/TaskCategories';
import TaskComments from '../Components/TaskComments';
import Avatar from 'material-ui/Avatar';
import Moment from 'react-moment';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import * as coreAuth from '../core/auth';
import displayTaskTiming from '../helpers/display-task-timing';
import * as pricingModelProvider from '../core/pricing-model-provider';
import apiTask from '../api/task';
import * as apiRequest from '../api/request';
import { translate } from '../core/i18n';
import { goTo, convertToAppPath } from '../core/navigation';
import { getCategoriesAsync } from '../core/categories.js';
import { displayPrice, displayLocation } from '../core/format';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { CONFIG } from '../core/config';
import { getUserAsync } from '../core/auth';
import { openRequestDialog } from '../helpers/open-requests-dialog';
import * as DEFAULTS from '../constants/DEFAULTS';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';

class Task extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            configReady: false,
            tabIndex: 0,
            open: false,
            applicationInProgress: false,
            isLoading: true,
            isMyTask: false,
            taskOwner: {},
            task: {
                images: [],
                categories: [],
                location: {},
                requests: []  
            }  
        };
    }
    handleTouchTap = (event) => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }
    handleRequestClose = () => {
        this.setState({
            open: false
        });
    }
    displayIconElement (task) {
        if (task && task.location) {
            return <MapsPlace viewBox='-20 -7 50 10' />;
        } else {
            return (
                <FileCloud viewBox='-20 -7 50 10'/>);
        }
    }
    componentDidMount() {
        getCategoriesAsync(categories => {
            const categoryLabels = {};
            
            categories.forEach(category => {
                categoryLabels[category.code] = category.label;
            });

            this.setState({
                categoryLabels
            });

            getUserAsync(user => {
                if (!user) {
                    return goTo(`/login?redirectTo=${convertToAppPath(`${location.pathname}`)}`);
                }

                apiRequest.getItems({
                    userId: user.id
                })
                .then(userRequests => {
                    this.setState({
                        userRequests
                    });
                });

                let taskId = this.props.params.taskId;
                
                apiTask
                    .getItem(taskId)
                    .then(task => {
                        const isMyTask = task.userId === user.id;

                        if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED !== "1") {
                            if (user.userType === 1 && !isMyTask) {
                                goTo('/');
    
                                return alert('You cannot access this page.');
                            }
                        }

                        this.setState({
                            configReady: true,
                            user,
                            task
                        });

                        pricingModelProvider.get()
                        .then(pricingModels => this.setState({
                            pricingModels
                        }));

                        
                        let sentRequest;

                        if (user) {
                            sentRequest = task.requests
                                .filter(
                                    _ => _.status !== REQUEST_STATUS.CANCELED
                                )
                                .find(
                                    _ => _.fromUserId === user.id
                                );
                        }
                        
                        this.setState({
                            taskOwner: task.user,
                            sentRequestId: sentRequest ? sentRequest.id : null,
                            isLoading: false,
                            isMyTask: task.userId === coreAuth.getUserId()
                        });
                });
            }, true);
        });
    }

    render() {
        const TaskLocationMap = withGoogleMap(props => (
            <GoogleMap
                ref={() => {}}
                defaultZoom={12}
                defaultCenter={{ lat: props.lat, lng: props.lng }}
                onClick={() => {}}
            >
                <Marker
                    position={{
                        lat: props.lat,
                        lng: props.lng
                    }}
                    key={`Task Location`}
                    defaultAnimation={2}
                />
            </GoogleMap>
        ));

        return (
            <div>
              { this.state.isLoading &&
                <div className="text-center" style={{ 'marginTop': '40px' }}>
                    <CircularProgress size={80} thickness={5} />
                </div>
              }
              { !this.state.isLoading &&
                    <div className="container-fluid" >
                        { this.state.task && this.state.task.status === '103' &&
                            <div className="row">
                                <div className="text-center" style={{ 'marginTop': '40px' }}>
                                    <h1>{translate('CANCELLED')}</h1>
                                </div>
                            </div>
                        }

                        { this.state.task && this.state.task.status === '20' &&
                            <div className="row">
                                <div className="text-center" style={{ 'marginTop': '40px' }}>
                                    <h1>{translate('BOOKED')}</h1>
                                </div>
                            </div>
                        }

                        <div className="row">
                            <div className="col-sm-offset-1 col-xs-12 col-sm-10">
                                <div className="col-xs-12 col-sm-8">
                                    <div className="row">
                                        <h1 style={{color: CONFIG.COLOR_PRIMARY}}>
                                            {this.state.task.title}
                                        </h1>
                                    </div>
                                    <div className="row" style={{'marginBottom': '15px'}}>
                                        <TaskCategories 
                                            categories={this.state.task.categories}
                                        />
                                    </div>
                                    { this.state.taskOwner.id &&
                                        <div className="row">
                                            <div className="col-xs-12">
                                                    <ul className="list-unstyled list-inline">
                                                        <li>
                                                            <a href={ '/app/profile/' + this.state.taskOwner.id }>
                                                                <Avatar src={this.state.taskOwner.imageUrl || DEFAULTS.PROFILE_IMG_URL }/>
                                                            </a>
                                                        </li>
                                                        <li style={{
                                                            marginLeft: 10,
                                                            top: -19,
                                                            position: "absolute"
                                                        }}>
                                                            <div style={{ height: 20 }}></div>
                                                                <strong>
                                                                    <a href={'/app/profile/' + this.state.taskOwner.id}>
                                                                        {this.state.taskOwner.firstName} {this.state.taskOwner.lastName}
                                                                    </a>
                                                                </strong>
                                                                
                                                                <p className="text-muted">
                                                                    <Moment format={`${CONFIG.DATE_FORMAT}`}>{this.state.task.createdAt}</Moment>
                                                                </p>
                                                            
                                                        </li>
                                                   </ul>
                                            </div>
                                        </div>
                                    }   
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <Card style={{ 'marginTop': 60 }}>
                                        <CardText>
                                            <h2 style={{color: CONFIG.COLOR_PRIMARY}}>
                                                {displayPrice(this.state.task.price, this.state.task.currency, this.state.task.priceType)}
                                            </h2>
                                        </CardText>
                                        { !this.state.user &&
                                            <RaisedButton
                                                backgroundColor={CONFIG.COLOR_PRIMARY}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("REGISTER_TO_APPLY")} 
                                                onClick={ () => goTo('/signup') }
                                            /> 
                                       }>
                                        {   
                                            this.state.user &&
                                            (   this.state.user.userType === 2 ||
                                                (this.state.user.userType === 1 && CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1")
                                            ) &&
                                            !this.state.isMyTask &&
                                            !this.state.sentRequestId &&
                                            this.state.task.status === TASK_STATUS.ACTIVE &&
                                            <RaisedButton
                                                primary={true}
                                                style={{width: '100%'}}
                                                label={this.state.task.taskType === 1 ? translate("SUPPLY_LISTING_CALL_TO_ACTION") : translate("DEMAND_LISTING_CALL_TO_ACTION")}
                                                onClick={() => {
                                                    this.setState({
                                                        applicationInProgress: true
                                                    });
                                                }
                                            }/>
                                       }
                                       { !this.state.isMyTask && this.state.sentRequestId &&
                                            <FlatButton
                                                style={{width: '100%'}}
                                                label={translate("REQUEST_ALREADY_SENT")}
                                                onTouchTap={() => {
                                                    goTo(`/chat/${this.state.sentRequestId}`)
                                                }}
                                            /> 
                                       }
                                       { this.state.isMyTask &&
                                         this.state.task.status === TASK_STATUS.ACTIVE &&
                                            <RaisedButton
                                                style={{width: '100%'}}
                                                primary={true}
                                                label={`${this.state.task.requests
                                                    .filter(_ => _.status === REQUEST_STATUS.PENDING)
                                                    .length} ${translate('REQUESTS')}`}
                                                onTouchTap={() => {
                                                    openRequestDialog(this.state.task.requests);
                                                }}
                                            />
                                       }
                                    </Card> 
                                </div> 
                            </div>
                        </div>
                        <hr/>
                        <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                            <div className="row">
                                <div className="col-sm-9">
                                    <div className="row">
                                        <div className="col-xs-12" style={{ marginTop: 10 }}>
                                            <div style={{width: '100%', marginBottom: '20px'}}>
                                                <div>
                                                    <h3 className="text-left">{translate('LISTING_DESCRIPTION')}</h3>
                                                    <p className="text-muted">
                                                        <div style={{ display: 'block-inline' }}>{displayLocation(this.state.task.location)}</div>
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div> 
                                                </div>
                                            </div>
                                        </div>

                                       { this.state.task.location &&
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">{translate('LISTING_LOCATION')}</h3>
                                            <TaskLocationMap
                                                lat={this.state.task.location.lat}
                                                lng={this.state.task.location.lng}
                                                containerElement={
                                                    <div style={{ height: 300 }} />
                                                }
                                                mapElement={
                                                    <div style={{ height: `100%` }} />
                                                }
                                            />
                                        </div>
                                        }
                                        
                                        {this.state.task.timing && !!this.state.task.timing.length &&
                                            <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                                <h3 className="text-left">{translate("LISTING_DATE")}</h3>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        {displayTaskTiming(this.state.task.timing, `${CONFIG.DATE_FORMAT}`)}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        { this.state.task.timing && this.state.task.timing[0] &&
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">{translate("LISTING_DURATION")}</h3>
                                            {this.state.task.timing[0].duration}h
                                        </div>
                                        }
                                        { false &&
                                        <div className="col-xs-12" style={{ marginTop: 10 }}>
                                            <h3 className="text-left">{translate("LISTING_IMAGES")}</h3>
                                            { this.state.task.images && this.state.task.images.map(img =>
                                                <div className="col-xs-12 col-sm-12 col-md-6" style={{ marginBottom: 10 }}>
                                                    <img className="img-responsive" role="presentation" src={img.imageUrl}/>
                                                </div>
                                            )}
                                            { ( !this.state.task.images || !this.state.task.images.length) &&
                                                <div className="col-xs-12 text-left">
                                                    <div className="row">
                                                        <p className="text-muted">
                                                            { translate('NO_LISTING_IMAGES') }
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        }
                                        {this.state.task &&
                                        <div className="row">
                                            <div className="col-xs-12">
                                                    <TaskComments
                                                        taskId={this.state.task.id}
                                                        canSubmit={this.state.task.status === TASK_STATUS.ACTIVE}
                                                        comments={this.state.task.comments}
                                                    />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                </div>
                            </div>
                        </div>
                  </div>
                  }
                  <RequestDialog
                    listing={this.state.task}
                    toUserId={this.state.task.userId}
                    taskId={this.state.task.id}
                    open={this.state.applicationInProgress}
                  />
            </div>
        );
    }
}

export default Task;