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
import ImageGallery from 'react-image-gallery';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import * as coreAuth from '../core/auth';
import displayTaskTiming from '../helpers/display-task-timing';
import * as pricingModelProvider from '../core/pricing-model-provider';
import apiTask from '../api/task';
import * as apiPayment from '../api/payment';
import * as apiRequest from '../api/request';
import { translate } from '../core/i18n';
import { goTo, convertToAppPath } from '../core/navigation';
import { getCategoriesAsync } from '../core/categories.js';
import { displayPrice, displayLocation } from '../core/format';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { CONFIG } from '../core/config';
import { getUserAsync } from '../core/auth';
import { getMeOutFromHereIfAmNotAuthorized } from '../helpers/user-checks';
import { openRequestDialog } from '../helpers/open-requests-dialog';
import * as DEFAULTS from '../constants/DEFAULTS';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import { displayErrorFactory } from '../core/error-handler';

import "react-image-gallery/styles/css/image-gallery.css";

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
                comments: [],
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
              if (CONFIG.LISTING_ENABLE_PUBLIC_VIEW !== "1" && getMeOutFromHereIfAmNotAuthorized(user)){
                  return;
              }

              let taskId = this.props.params.taskId;

              if (user) {

                apiPayment
                .getUserAccount("stripe")
                    .then(rAccount => {
                        this.setState({
                            paymentAccount: rAccount
                        });
                    }, displayErrorFactory({
                        self: this,
                        ignoreCodes: [ "STRIPE_NOT_CONNECTED" ]
                    }));

                  apiRequest
                  .getItems({
                      userId: user.id
                  })
                  .then(userRequests => {
                      this.setState({
                          userRequests
                      });
                  });
                }


                
                apiTask
                    .getItem(taskId)
                    .then(task => {
                        const isMyTask = user ? task.userId === user.id : false;

                        if (CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED !== "1") {
                            if (user && user.userType === 1 && !isMyTask) {
                                goTo('/');
    
                                return alert('You cannot access this page.');
                            }
                        }

                        if (user) {
                          this.setState({
                              configReady: true,
                              user,
                              task
                          });
                        } else {
                          this.setState({
                              configReady: true,
                              task
                          });
                        }

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
                defaultCenter={{ lat: parseFloat(props.lat), lng: parseFloat(props.lng) }}
                onClick={() => {}}
            >
                <Marker
                    position={{
                        lat: parseFloat(props.lat),
                        lng: parseFloat(props.lng)
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

                        { CONFIG.LISTING_IMAGES_MODE === "1" && this.state.task.images.length > 0 &&
                            <div className="row listing-gallery-section" >
                                <ImageGallery
                                    style={{ height: 300, maxHeight: "100%" }}
                                    showPlayButton={false}
                                    useBrowserFullscreen={false}
                                    showFullscreenButton={true}
                                    items={this.state.task.images.map(_ => ({ original: _.imageUrl, thumbnail: _.imageUrl }))}
                                />
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
                                                                <Avatar src={this.state.taskOwner.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || DEFAULTS.PROFILE_IMG_URL || DEFAULTS.PROFILE_IMG_URL }/>
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
                                    { CONFIG.LISTING_CUSTOM_CALL_TO_ACTION_MODE !== "1" &&
                                    <Card style={{ 'marginTop': 50 }}>
                                        <CardText>
                                            { CONFIG.LISTING_PRICING_MODE === "1" && this.state.task.price &&
                                                <h2 style={{color: CONFIG.COLOR_PRIMARY}}>
                                                    {this.state.task.price && displayPrice(
                                                        this.state.task.price,
                                                        this.state.task.currency,
                                                        this.state.task.priceType
                                                    )}
                                                </h2>
                                            }

                                            { CONFIG.LISTING_QUANTITY_MODE === "1" && (this.state.task.quantity || this.state.task.unitOfMeasure) &&
                                                <h2 style={{color: CONFIG.COLOR_PRIMARY}}>
                                                    {this.state.task.quantity} {this.state.task.unitOfMeasure}
                                                </h2>
                                            }
                                        </CardText>
                                        { !this.state.user && this.state.configReady &&
                                            <RaisedButton
                                                backgroundColor={CONFIG.COLOR_PRIMARY}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("REGISTER_TO_APPLY")} 
                                                onClick={ () => goTo('/signup') }
                                            /> 
                                       }
                                        {   
                                            this.state.user &&
                                            this.state.configReady &&
                                            (   this.state.user.userType === 2 ||
                                                (this.state.user.userType === 1 && CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED === "1") ||
                                                this.state.user.userType === 0
                                            ) &&
                                            !this.state.isMyTask &&
                                            (
                                                !this.state.sentRequestId || CONFIG.MULTIPLE_REQUESTS_ENABLED === "1"
                                            ) &&
                                            this.state.task.status === TASK_STATUS.ACTIVE &&
                                            <RaisedButton
                                                primary={true}
                                                style={{width: '100%'}}
                                                label={
                                                    this.state.task.taskType === 1 ?
                                                    translate("DEMAND_LISTING_CALL_TO_ACTION") :
                                                    translate("SUPPLY_LISTING_CALL_TO_ACTION")
                                                }
                                                onClick={() => {
                                                    if (
                                                        CONFIG.PAYMENTS_ENABLED !== "1" ||
                                                        (
                                                            this.state.task.taskType === 1 &&
                                                            this.state.paymentAccount &&
                                                            this.state.paymentAccount.accountId
                                                        )
                                                    ) {
                                                        this.setState({
                                                            applicationInProgress: true
                                                        });

                                                        return;
                                                    }
                                                    
                                                    goTo("/account/payments");
                                                }
                                            }/>
                                       }

                                       { CONFIG.MULTIPLE_REQUESTS_ENABLED !== "1" &&
                                         !this.state.isMyTask &&
                                         this.state.sentRequestId &&
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
                                    }

                                    {
                                           CONFIG.LISTING_CUSTOM_CALL_TO_ACTION_MODE === "1" && this.state.task.callToActionUrl &&
                                           <a href={this.state.task.callToActionUrl}>
                                                <RaisedButton
                                                    style={{width: '100%'}}
                                                    primary={true}
                                                    label={`${this.state.task.callToActionLabel || this.state.task.callToActionUrl}`}
                                                />
                                            </a>
                                       }
                                </div> 
                            </div>
                        </div>
                        <hr/>
                        <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                            <div className="row">
                                <div className="col-sm-9">
                                    <div className="row">
                                        { CONFIG.USER_ENABLE_SUPPLY_DEMAND_ACCOUNTS === "1" &&
                                                <div className="col-xs-12" style={{ marginTop: 10 }}>
                                                    <div style={{width: '100%', marginBottom: '20px'}}>
                                                        <div>
                                                            <h3 className="text-left">{translate('LISTING_TYPE')}</h3>
                                                        </div>
                                                        <div>
                                                            { this.state.task.taskType === 2 ? translate("SUPPLY_LISTING") : translate("DEMAND_LISTING")}
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                       { CONFIG.LISTING_DESC_MODE === "1" && this.state.task.description && this.state.task.description.length > 0  &&
                                        <div className="col-xs-12" style={{ marginTop: 10 }}>
                                            <div style={{width: '100%', marginBottom: '20px'}}>
                                                <div>
                                                    <h3 className="text-left">{translate('LISTING_DESCRIPTION')}</h3>
                                                </div>
                                                <div>
                                                    <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div>
                                                </div>
                                            </div>
                                        </div>
                                       }
                                       { CONFIG.LISTING_GEOLOCATION_MODE === "1" && this.state.task.location && Object.keys(this.state.task.location).length > 0 &&
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">{translate('LISTING_LOCATION')}</h3>
                                            <div style={{ display: 'block-inline' }}>
                                                <p className="text-muted">{displayLocation(this.state.task.location)}</p>
                                            </div>

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
                                        
                                        { CONFIG.LISTING_DISCUSSION_MODE === "1" && this.state.task.comments &&
                                            <div className="row">
                                                    <TaskComments
                                                        task={this.state.task}
                                                        canSubmit={this.state.task.status === TASK_STATUS.ACTIVE}
                                                    />
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