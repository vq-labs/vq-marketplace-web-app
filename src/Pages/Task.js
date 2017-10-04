import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import DOMPurify from 'dompurify'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
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
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import { openRequestDialog } from '../helpers/open-requests-dialog';
import * as DEFAULTS from '../constants/DEFAULTS';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import { sortDates } from '../core/util';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import '../App.css';

const async = require("async");

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

            getConfigAsync(config => {
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

                            if (String(user.userType) === '1' && !isMyTask) {
                                goTo('/');

                                return alert('You cannot access this page.');
                            }

                            this.setState({
                                configReady: true,
                                config,
                                user
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
                                task,
                                isMyTask: task.userId === coreAuth.getUserId()
                            });
                    });
                }, true);
            });
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
                            <div className="col-sm-offset-2 col-xs-12 col-sm-8">
                                <div className="col-xs-12 col-sm-8">
                                    <div className="row">
                                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                            {this.state.task.title}
                                        </h1>
                                    </div>
                                    <div className="row" style={{'marginBottom': '15px'}}>
                                        <TaskCategories 
                                            categories={this.state.task.categories}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-xs-2 col-sm-1">
                                            { this.state.taskOwner.id &&
                                                <a href={ '/app/profile/' + this.state.taskOwner.id }>
                                                    <Avatar src={this.state.taskOwner.imageUrl || DEFAULTS.PROFILE_IMG_URL }/>
                                                </a>
                                            }
                                        </div>
                                        <div className="col-xs-10 col-sm-9">
                                            {this.state.taskOwner.id &&     
                                                <strong>
                                                    <a href={'/app/profile/' + this.state.taskOwner.id}>
                                                        {this.state.taskOwner.firstName} {this.state.taskOwner.lastName}
                                                    </a>
                                                </strong>
                                            }
                                            <p className="text-muted">
                                                am <Moment format="DD.MM.YYYY">{this.state.task.createdAt}</Moment>
                                            </p>
                                        </div>  
                                    </div>     
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <Card style={{'marginTop': 60}}>
                                        <CardText>
                                            <h2 style={{color: this.state.config.COLOR_PRIMARY}}>
                                                {displayPrice(this.state.task.price, this.state.task.currency, this.state.task.priceType)}
                                            </h2>
                                        </CardText>
                                        { !this.state.user &&
                                            <RaisedButton
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("REGISTER_TO_APPLY")} 
                                                onClick={ () => goTo('/signup') }
                                            /> 
                                       }>
                                        { 
                                            this.state.user &&
                                            String(this.state.user.userType) === '2' &&
                                            !this.state.isMyTask &&
                                            !this.state.sentRequestId &&
                                            this.state.task.status === TASK_STATUS.ACTIVE &&
                                            <RaisedButton
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("SEND_REQUEST")} 
                                                onClick={() => {
                                                    const userRequests = this.state.userRequests;
                                                    const taskStartDate = (new Date(this.state.task.timing[0].date)).getTime() / 1000;
                                                    const taskEndDate = (new Date(this.state.task.timing[0].endDate)).getTime() / 1000;
                                                    let alreadyAppliedSomewhere = false;

                                                    if (false) {
                                                        userRequests
                                                        .forEach(userRequest => {
                                                            const requestStartDate = (new Date(userRequest.task.taskTimings[0].date)).getTime() / 1000;
                                                            
                                                            if (requestStartDate >= taskStartDate && requestStartDate <= taskEndDate) {
                                                                alreadyAppliedSomewhere = true;
                                                            }
                                                        });
                                                    }

                                                    if (false && alreadyAppliedSomewhere) {
                                                        return openConfirmDialog({
                                                            headerLabel: translate("ALREADY_APPLIED_REQUEST_ACTION_HEADER"),
                                                            confirmationLabel: translate("ALREADY_APPLIED_REQUEST_ACTION_DESC")
                                                        }, () => {
                                                            async
                                                            .eachSeries(userRequests, (userRequest, cb) => {
                                                                apiRequest
                                                                .updateItem(userRequest.id, {
                                                                    status: REQUEST_STATUS.CANCELED
                                                                })
                                                                .then(_ => {
                                                                    cb();
                                                                }, cb);
                                                            }, err => {
                                                                if (err) {
                                                                    return alert(err);
                                                                }

                                                                return this.setState({
                                                                    shouldCancelOtherRequests: true,
                                                                    applicationInProgress: true
                                                                });
                                                            });
                                                        })
                                                    } 

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
                                                labelStyle={{color: 'white '}}
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                label={`${this.state.task.requests
                                                    .filter(_ => _.status === REQUEST_STATUS.PENDING)
                                                    .length} ${translate('REQUESTS')}`}
                                                onTouchTap={() => {
                                                    openRequestDialog(this.state.task.requests);
                                                }}
                                            />
                                       }

                                       { false && this.state.isMyTask &&
                                         this.state.task.status === TASK_STATUS.BOOKED &&
                                            <RaisedButton
                                                style={{width: '100%'}}
                                                labelStyle={{color: 'white '}}
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
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
                                        
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">{translate("LISTING_DATE")}</h3>
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    {displayTaskTiming(this.state.task.timing)}
                                                </div>
                                            </div>
                                        </div>

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
                                                        canSubmit={this.state.task.status == TASK_STATUS.ACTIVE}
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
                  <ApplicationDialog
                    toUserId={this.state.task.userId}
                    taskId={this.state.task.id}
                    open={this.state.applicationInProgress}
                  />
            </div>
        );
    }
}

export default Task;