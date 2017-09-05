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
import displayTaskLocation from '../helpers/display-task-location';
import * as pricingModelProvider from '../core/pricing-model-provider';
import apiTask from '../api/task';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import * as coreFormat from '../core/format';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';

import '../App.css';

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
        getConfigAsync(config => {
            getUserAsync(user => {
                this.setState({
                    configReady: true,
                    config,
                    user
                });

                let taskId = this.props.params.taskId;

                pricingModelProvider.get()
                .then(pricingModels => this.setState({
                    pricingModels
                }));

                apiTask.getItem(taskId)
                .then(task => {
                    let sentRequest;

                    if (user) {
                        sentRequest = task.requests
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
                                        <TaskCategories categories={this.state.task.categories}/>
                                    </div>

                                    <div className="row">
                                        <div className="col-xs-1">
                                            { this.state.taskOwner.id &&
                                                <a href={ '/app/profile/' + this.state.taskOwner.id }>
                                                    <Avatar src={this.state.taskOwner.imageUrl || '/images/avatar.png' }/>
                                                </a>
                                            }
                                        </div>
                                        <div className="col-xs-11">
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
                                        { this.state.task.priceType !== this.state.pricingModels.REQUEST_QUOTE &&
                                            <CardText>
                                                <h2 style={{color: this.state.config.COLOR_PRIMARY}}>
                                                    {coreFormat.displayPrice(this.state.task.price, this.state.task.currency)}
                                                </h2>
                                                <p>
                                                    {
                                                        this.state.task.priceType===0 ?
                                                        translate("PRICING_MODEL_TOTAL") :
                                                        translate("PRICING_MODEL_HOURLY")
                                                    }
                                                </p>
                                            </CardText>
                                        }
                                        { !this.state.user &&
                                            <RaisedButton
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("REGISTER_TO_APPLY")} 
                                                onClick={ () => goTo('/signup') }
                                            /> 
                                       }>
                                        { this.state.user && String(this.state.user.userType) === '2' && !this.state.isMyTask && !this.state.sentRequestId && 
                                            <RaisedButton
                                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("SEND_REQUEST")} 
                                                onClick={ () => this.setState({
                                                    applicationInProgress: true
                                                }) 
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
                                                    <h3 className="text-left">About the job</h3>
                                                    <p className="text-muted">
                                                        <div style={{ display: 'block-inline' }}>{displayTaskLocation([ this.state.task.location ])}</div>
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div> 
                                                </div>
                                            </div>
                                        </div>
                            
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">Job Location</h3>
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
                                        
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">Job Date</h3>
                                            {this.state.task.timing.map(timing =>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <Moment format="DD.MM.YYYY">{timing.date}</Moment>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        { this.state.task.timing && this.state.task.timing[0] &&
                                        <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                            <h3 className="text-left">Estimated duration</h3>
                                            {this.state.task.timing[0].duration}h
                                        </div>
                                        }
                                        { false &&
                                        <div className="col-xs-12" style={{ marginTop: 10 }}>
                                            <h3 className="text-left">Task Images</h3>
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
                                        <div className="row">
                                            <div className="col-xs-12">
                                                    <TaskComments
                                                        taskId={this.state.task.id}
                                                        comments={this.state.task.comments}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                </div>
                            </div>
                        </div>
                  </div>
                  }
                  <ApplicationDialog toUserId={this.state.task.userId} taskId={this.state.task.id} open={this.state.applicationInProgress} />
            </div>
        );
    }
}

export default Task;