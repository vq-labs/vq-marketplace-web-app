import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import TextField from 'material-ui/TextField';

import apiTask from '../api/task';

import * as coreNavigation from '../core/navigation';

import '../App.css';

export default class TaskEdit extends Component {
    constructor(props) {
        super(props);
   
        this.state={
            isLoading: true,
            task: {},
            updatedTask: {}  
        };


         this.handleFieldChange=this.handleFieldChange.bind(this);
         this.handleUpdate=this.handleUpdate.bind(this);
    }
   
    componentDidMount() {
      let taskId=this.props.params.taskId;

      apiTask.getItem(taskId).then(rTask => {
        this.setState({
            isLoading: false,
            task: rTask,
            updatedTask: {
                title: rTask.title,
                description: rTask.description,
                price: rTask.price / 100,
                priceType: rTask.priceType
            }
      });
    });
  }

  handleFieldChange (field, transform)  {
        return (event, value) => {
            const updatedTask = this.state.updatedTask;

            updatedTask[field] = transform ? transform(value) : value;
            
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
                                    <h4>Abbrechungsmodel</h4>
                                    <RadioButtonGroup 
                                        name="priceType" 
                                        onChange={ this.handleFieldChange('priceType', value => Number(value))} 
                                        ref="priceType"
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        defaultSelected={this.state.task.priceType}>
                                            <RadioButton
                                                value={1}
                                                label="pro Stunde"
                                            />
                                            <RadioButton
                                                value={0}
                                                label="pro Auftrag"
                                            />
                                    </RadioButtonGroup>
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
                                        label='Abbrechen' 
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ () => coreNavigation.goBack() }
                                    />
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label='Übernehmen'
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ this.handleUpdate }
                                    />
                                </div>
                             </div>
                        </div>
                  }
            </div>
        );
  }
};