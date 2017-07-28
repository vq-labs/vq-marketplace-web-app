import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import DOMPurify from 'dompurify'
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
import TaskCategories from '../Partials/TaskCategories';
import TaskComments from '../Components/TaskComments';
import Avatar from 'material-ui/Avatar';
import Moment from 'react-moment';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Chip from 'material-ui/Chip';
import * as coreAuth from '../core/auth';
import * as pricingModelProvider from '../core/pricing-model-provider';
import apiTask from '../api/task';
import { appConfig } from '../api/config';
import apiUser from '../api/user';
import { Tabs, Tab } from 'material-ui/Tabs';
import { translate } from '../core/i18n';
import * as coreFormat from '../core/format';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

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
                location: {}      
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
    displayLocation (task) { 
        if (task && task.location) {
            return `${task.location.street}, ${task.location.city}` ;
        } else {
            return 'Online';
        }
    }
    displayIconElement (task) {
        if (task && task.location && task.location.formattedAddress) {
            return <MapsPlace viewBox='-20 -7 50 10' />;
        } else {
            return (
                <FileCloud viewBox='-20 -7 50 10'/>);
        }
    }


    componentDidMount() {
      let taskId = this.props.params.taskId;

      pricingModelProvider.get()
      .then(pricingModels => this.setState({ pricingModels }));

      appConfig
        .getItems({}, {
            cache: true
        })
        .then(config => this.setState({
            configReady: true,
            config
        }));

      apiTask.getItem(taskId)
      .then(task => {
          this.setState({
            isLoading: false,
            task,
            isMyTask: task.userId === coreAuth.getUserId()
          });

          apiUser.getItem(task.userId)
            .then(taskOwner => this.setState({ 
                taskOwner 
            }));
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
                        <div className="row">
                            <div className="col-sm-offset-2 col-xs-12 col-sm-8">
                                <div className="col-xs-12 col-sm-8">
                                    <div className="row">
                                        <h1>{this.state.task.title}</h1>
                                    </div>
                                    <div className="row" style={{'marginBottom': '15px'}}>
                                        <TaskCategories categories={this.state.task.categories}/>
                                    </div>

                                    <div className="row">
                                        <div className="col-xs-1">
                                            { this.state.taskOwner.id &&
                                                <a href={ '/app/profile/' + this.state.taskOwner.id }>
                                                    <Avatar src={this.state.taskOwner.imageUrl || 'https://studentask.de/images/avatar.png' }/>
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
                                                <h2>{coreFormat.displayPrice(this.state.task.price, this.state.task.currency)}</h2>
                                                <p>
                                                    {
                                                        this.state.task.priceType===0 ?
                                                        translate("PRICING_MODEL_TOTAL") :
                                                        translate("PRICING_MODEL_HOURLY")
                                                    }
                                                </p>
                                            </CardText>
                                        }
                                        { !this.state.isMyTask && 
                                            <RaisedButton
                                                backgroundColor={"#546e7a"}
                                                labelColor={"white"}
                                                style={{width: '100%'}}
                                                label={translate("SEND_REQUEST")} 
                                                onClick={ () => this.setState({ applicationInProgress: true }) 
                                            }/> 
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
                                        <Tabs
                                            tabItemContainerStyle={{ backgroundColor: 'transparent', color: 'black' }}
                                            onChange={ tabIndex => this.setState({ tabIndex }) }
                                            value={this.state.tabIndex}
                                            >
                                            <Tab style={{ color: 'black' }} label={translate('LISTING_INFO')} value={0}>
                                                { this.state.tabIndex === 0 &&
                                                <div className="row">
                                                    <div className="col-xs-12" style={{ marginTop: 10 }}>
                                                        <div style={{width: '100%', marginBottom: '20px'}}>
                                                            <div>
                                                                <h3 className="text-left">About the offer</h3>
                                                                <p className="text-muted">
                                                                    { this.displayIconElement(this.state.task) }  { this.displayLocation(this.state.task) }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div> 
                                                            </div>
                                                        </div>
                                                    </div>
                                       
                                                    <div className="col-xs-12" style={{ marginBottom: 20 }}>
                                                        <h3 className="text-left">Task Location</h3>
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
                                                    
                                                    <div className="col-xs-12">
                                                        {this.state.taskOwner.id &&
                                                            <div style={{width: '100%', 'marginBottom': '20px'}}>
                                                                <div>
                                                                    <h3 className="text-left">Posted by</h3>
                                                                    <div className="row">
                                                                        <div className="col-xs-1">
                                                                            <a href={ '/app/profile/' + this.state.task.userId }>
                                                                                <Avatar src={this.state.taskOwnerimageUrl || 'https://talentwand.de/images/avatar.png' }/>
                                                                            </a>
                                                                        </div>
                                                                        <div className="col-xs-11">     
                                                                            <strong><a href={`/app/profile/${this.state.taskOwner.id}`}>{this.state.taskOwner.firstName} {this.state.taskOwner.lastName}</a></strong>
                                                                            
                                                                            <p className="text-muted">
                                                                                {this.state.taskOwner.bio}
                                                                            </p>
                                                                        </div>  

                                                                        <div className="col-xs-12">     
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                flexWrap: 'wrap',
                                                                            }}>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="row">
                                                        <TaskComments taskId={this.state.taskId} />
                                                    </div>
                                                </div>
                                                }
                                            </Tab>
                                            <Tab style={{ color: 'black' }} label={translate('LISTING_IMAGES')} value={1} >
                                                <div className="col-xs-12" style={{ marginTop: 10 }}>
                                                    <div className="row">
                                                        { this.state.task.images && this.state.task.images.map(img =>
                                                            <div className="col-xs-12 col-sm-12 col-md-6" style={{ marginBottom: 10 }}>
                                                                <img className="img-responsive" role="presentation" src={img.imageUrl}/>
                                                            </div>
                                                        )}
                                                        { ( !this.state.task.images || !this.state.task.images.length) &&
                                                            <div className="col-xs-12 text-center">
                                                                <h4>{ translate('NO_LISTING_IMAGES') }</h4>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
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