import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
import TaskCategories from '../Partials/TaskCategories';
import Paper from 'material-ui/Paper';
import GoogleAd from 'react-google-ad'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';
import Moment from 'react-moment';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import AppBar from 'material-ui/AppBar';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';

import DropDownMenu from 'material-ui/DropDownMenu';

import * as coreAuth from '../core/auth';
import apiTask from '../api/task';

import '../App.css';

class Task extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            open: false,
            applicationInProgress: false,
            isLoading: true,
            isMyTask: false,
            task: {
                categories: [ ],
                location:  {  },        
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
    };

    componentDidMount() {
      let taskId = this.props.params.taskId;
      
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
                                <div className="col-xs-12 col-sm-4" style={{'marginTop': '15px'}}>
                                    <Card>                                                    
                                        <CardText>
                                            <h2>{(this.state.task.price / 100).toFixed(2) }€</h2>
                                            <p>
                                                {
                                                    this.state.task.priceType == 0 ?
                                                    'pro Auftrag' : 'pro Stunde'
                                                }
                                            </p>
                                        </CardText>
                                        
                                        { !this.state.isMyTask && <RaisedButton
                                                backgroundColor={"#546e7a"}
                                                labelColor={"white"}
                                                style={{width:  '100%'}}
                                                label={this.state.task.taskType === 1 ? "Anfrage senden" : "Bewerbung senden" } 
                                                onClick={ () => {
                                                    this.setState({ applicationInProgress: true });
                                        } }/> 
                                       } 

                                </Card> 
                                      <div style={{'marginTop': '15px'}}>
                                         <RaisedButton
                                            style={{ width: '100%' }}
                                            onTouchTap={this.handleTouchTap}
                                            label="Mehr"
                                            labelColor={"#546e7a"}
                                            />
                                            
                                            <Popover
                                                    open={this.state.open}
                                                    anchorEl={this.state.anchorEl}
                                                    onRequestClose={this.handleRequestClose}
                                                    >
                                                    <Menu>
           
                                                        <MenuItem onTouchTap={ () => location.href="http://studentask.de/aufgabe-vergeben?title=" + this.state.task.title}  primaryText="Ähnliches Inserat erfassen" />
        
                                                    </Menu>
                                            </Popover>
                                    </div> 
                                </div> 
                            </div>
                        </div>
                        <hr/>
                        <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                            <div className="row">
                                <div className="col-sm-9">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <Card style={{width: '100%', 'marginBottom': '20px'}}>
                                                <CardText>
                                                    <h3 className="text-left">Über dieses Inserat</h3>
                                                    <p className="text-muted">
                                                        { this.displayIconElement(this.state.task) }  { this.displayLocation(this.state.task) }
                                                    </p>
                                                </CardText>
                                                <CardText>
                                                    {this.state.task.description}
                                                </CardText>
                                            </Card>
                                         </div>                                                                 
                                      </div>
                                      <div className="row">
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
                                                            {this.state.task.taskOwner.talents.map( talent => <Chip style={ { margin: 3} }>{talent.name}</Chip>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardText>
                                            </Card>
                                          </div>                                                               
                                      </div>
                                      <div className="row">  
                                            <h4 className="text-left">
                                                {this.state.task.applyingUsers.length + " Anfragen"}
                                            </h4>
                                      </div>
                                </div>
                                <div className="col-sm-3">
                                    <GoogleAd client="ca-pub-2487354108758644" slot="4660780818" format="auto" />
                                </div>
                            </div>
                        </div>
                  </div>
                  }
                  <ApplicationDialog taskId = {this.state.task._id} open={this.state.applicationInProgress} />
            </div>
        );
  }
}

export default Task;