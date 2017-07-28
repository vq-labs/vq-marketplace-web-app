import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
import TaskCategories from '../Partials/TaskCategories';
import Paper from 'material-ui/Paper';
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

export default class CategoryEdit extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            obj: {}  
        };

         this.handleFieldChange = this.handleFieldChange.bind(this);
         this.handleUpdate = this.handleUpdate.bind(this);
    }
   
    componentDidMount() {


    }

    handleFieldChange (field)  {
            return (event, value) => {
                const obj = this.state.obj;

                obj[field] = value;
                
                this.setState( { obj } );
            }
    } 

    handleUpdate ()  {
                                    
    } 

  render() {
        return (
                        <div className="container">
                            <div className="col-xs-12 col-sm-8">
                                <div className="col-xs-12">
                                    <TextField
                                        ref="code"
                                        onChange={ this.handleFieldChange('code') }
                                        value={this.state.obj.code}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        floatingLabelText="Kategorietitel"
                                    />
                                </div>
                                <div className="col-xs-12">
                                    <TextField
                                        rows={4}
                                        ref="label"
                                        onChange={ this.handleFieldChange('label') }
                                        value={this.state.obj.label}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        floatingLabelText="Label"
                                    />
                                </div>
                                
                                <div className="col-xs-12">
                                    <TextField
                                        ref="minPriceHour"
                                        onChange={ this.handleFieldChange('minPriceHour') }
                                        value={this.state.obj.minPriceHour}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        floatingLabelText="Minimum price per hour (optional)"
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
        );
  }
};