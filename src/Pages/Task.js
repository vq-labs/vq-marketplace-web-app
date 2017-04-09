import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import DOMPurify from 'dompurify'
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
import TaskCategories from '../Partials/TaskCategories';
import GoogleAd from 'react-google-ad'
import Avatar from 'material-ui/Avatar';
import Moment from 'react-moment';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Chip from 'material-ui/Chip';
import * as coreAuth from '../core/auth';
import * as pricingModelProvider from '../core/pricing-model-provider';
import apiTask from '../api/task';
import { Tabs, Tab } from 'material-ui/Tabs';
import { translate } from '../core/i18n';

import '../App.css';

class Task extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            tabIndex: 0,
            open: false,
            applicationInProgress: false,
            isLoading: true,
            isMyTask: false,
            task: {
                images: [ ],
                categories: [ ],
                location:  { },        
                meta: {
                    taskOwner: {
                        stats: {},
                        profile: {}
                    }
                }
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
        open: false,
        });
    }
    displayLocation (task) {
        if (task && task.location) {
            return task.location.formattedAddress || 'Virtuelle Aufgabe';
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

      pricingModelProvider.get().then(pricingModels => this.setState({ pricingModels }));

      apiTask.getItem(taskId).then(rTask => this.setState({
        isLoading: false,
        task: rTask,
        isMyTask: rTask.ownerUserId === coreAuth.getUserId()
      }));
    }
    render() {
        return (
            <div >
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
                                            <a href={ '/app/profile/' + this.state.task.ownerUserId }>
                                                <Avatar src={this.state.task.taskOwner.profile.imageUrl || 'https://studentask.de/images/avatar.png' }/>
                                            </a>
                                        </div>
                                        <div className="col-xs-11">     
                                            <strong><a href={ '/app/profile/' + this.state.task.ownerUserId }>{this.state.task.taskOwner.profile.firstName} {this.state.task.taskOwner.profile.lastName}</a></strong>
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
                                                <h2>{(this.state.task.price / 100).toFixed(2) }€</h2>
                                                <p>
                                                    {
                                                        this.state.task.priceType===0 ?
                                                        'pro Auftrag' : 'pro Stunde'
                                                    }
                                                </p>
                                            </CardText>
                                        }
                                        { !this.state.isMyTask && 
                                            <RaisedButton
                                                backgroundColor={"#546e7a"}
                                                labelColor={"white"}
                                                style={{width:  '100%'}}
                                                label={this.state.task.taskType === 1 ?"Anfrage senden" : "Bewerbung senden" } 
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
                                                        <Card style={{width: '100%', marginBottom: '20px'}}>
                                                            <CardText>
                                                                <h3 className="text-left">Über dieses Inserat</h3>
                                                                <p className="text-muted">
                                                                    { this.displayIconElement(this.state.task) }  { this.displayLocation(this.state.task) }
                                                                </p>
                                                            </CardText>
                                                            <CardText>
                                                                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div> 
                                                            </CardText>
                                                        </Card>
                                                    </div>

                                                    <div className="col-xs-12">
                                                        <Card style={{width: '100%', 'marginBottom': '20px'}}>
                                                            <CardText>
                                                                <h3 className="text-left">Über {this.state.task.taskOwner.profile.firstName}</h3>
                                                                <div className="row">
                                                                    <div className="col-xs-1">
                                                                        <a href={ '/app/profile/' + this.state.task.ownerUserId }>
                                                                            <Avatar src={this.state.task.taskOwner.profile.imageUrl || 'https://studentask.de/images/avatar.png' }/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-xs-11">     
                                                                        <strong><a href={ '/app/profile/' + this.state.task.ownerUserId }>{this.state.task.taskOwner.profile.firstName} {this.state.task.taskOwner.profile.lastName}</a></strong>
                                                                        
                                                                        <p className="text-muted">
                                                                            {this.state.task.taskOwner.profile.bio}
                                                                        </p>
                                                                    </div>  

                                                                    <div className="col-xs-12">     
                                                                        <h4>Skills</h4>

                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexWrap: 'wrap',
                                                                        }}>
                                                                        {this.state.task.taskOwner.talents.map( (talent, i) => <Chip style={ { margin: 3} } key={i} >{talent.name}</Chip>)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardText>
                                                        </Card>
                                                    </div>   
                                                </div>
                                                }
                                            </Tab>
                                            <Tab style={{ color: 'black' }} label={translate('LISTING_IMAGES')} value={1} >
                                                <div className="col-xs-12" style={{ marginTop: 10 }}>
                                                    <div className="row">
                                                        { this.state.task.images.map(img =>
                                                            <div className="col-xs-12 col-sm-12 col-md-6" style={{ marginBottom: 10 }}>
                                                                <img className="img-responsive" role="presentation" src={img.imageUrl}/>
                                                            </div>
                                                        )}
                                                        { (!this.state.task.images.length) &&
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
                                    <GoogleAd client="ca-pub-2487354108758644" slot="4660780818" format="auto" />
                                </div>
                            </div>
                        </div>
                  </div>
                  }
                  <ApplicationDialog toUserId={this.state.task.ownerUserId} taskId={this.state.task._id} open={this.state.applicationInProgress} />
            </div>
        );
    }
}

export default Task;