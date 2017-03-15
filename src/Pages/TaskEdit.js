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

import TextField from 'material-ui/TextField';

import apiTask from '../api/task';

import * as coreNavigation from '../core/navigation';

import '../App.css';

export default class TaskEdit extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            isLoading: true,
            task: {},
            updatedTask: {}  
        };

         this.handleFieldChange = this.handleFieldChange.bind(this);
         this.handleUpdate = this.handleUpdate.bind(this);
    }
   
    componentDidMount() {
      let taskId = this.props.params.taskId;

      apiTask.getItem(taskId).then(rTask => {
        this.setState({
            isLoading: false,
            task: rTask,
            updatedTask: {
                title: rTask.title,
                description: rTask.description,
                price: rTask.price / 100,
            }
      });
    });
  }

  handleFieldChange (field)  {
        return (event, value) => {
            const updatedTask = this.state.updatedTask;

            updatedTask[field] = value;
            
            this.setState( { updatedTask } );
        }
  } 

  handleUpdate ()  {
    const updatedTask = this.state.updatedTask;

    updatedTask.price *= 100;

    apiTask.updateItem(this.state.task._id, updatedTask).then(task => {
        browserHistory.push(`/app/task/${this.state.task._id}`);
    });
                                     
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
                        <div className="container">
                            <div className="col-xs-12 col-sm-8">
                                <div className="col-xs-12">
                                        <TextField
                                            ref="title"
                                            onChange={ this.handleFieldChange('title') }
                                            value={this.state.updatedTask.title}
                                            style={{width: '100%'}}
                                            inputStyle={{width: '100%'}}
                                            floatingLabelText="Titel"
                                        />
                                </div> 
                                <div className="col-xs-12">
                                            <TextField
                                                rows={4}
                                                ref="description"
                                                onChange={ this.handleFieldChange('description') }
                                                value={this.state.updatedTask.description}
                                                style={{width: '100%'}}
                                                inputStyle={{width: '100%'}}
                                                floatingLabelText="Beschreibung"
                                            />
                                </div>
                                <div className="col-xs-12">
                                            <TextField
                                                onChange={ this.handleFieldChange('price') }
                                                ref="price"
                                                type="number"
                                                value={this.state.updatedTask.price }
                                                style={{width: '100%'}}
                                                inputStyle={{width: '100%'}}
                                                floatingLabelText="Preis (in €)"
                                            />
                                </div>

                                <div className="col-xs-12">
                                    <FlatButton
                                        style={ { float: 'left' } }
                                        label = 'Abbrechen' 
                                        primary = { true }
                                        disabled = { false }
                                        onTouchTap = { () => coreNavigation.goBack() }
                                    />
                                
                                
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label = 'Übernehmen'
                                        primary = { true }
                                        disabled = { false }
                                        onTouchTap = { this.handleUpdate }
                                    />
                                </div>
                             </div>
                        </div>
                  }
            </div>
        );
  }
};