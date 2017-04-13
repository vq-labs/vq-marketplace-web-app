import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import HtmlTextField from '../Components/HtmlTextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import apiTask from '../api/task';
import * as apiTaskImage from '../api/task-image';
import * as coreNavigation from '../core/navigation';
import ImageUploader from '../Components/ImageUploader';
import { translate } from '../core/i18n';

import '../App.css';

export default class TaskEdit extends Component {
    constructor (props) {
        super(props);
   
        this.state = {
            isLoading: true,
            task: {},
            updatedTask: {}  
        };

        this.handleFieldChange=this.handleFieldChange.bind(this);
        this.handleUpdate=this.handleUpdate.bind(this);
    }
   
    componentDidMount() {
      let taskId = this.props.params.taskId;

      apiTask.getItem(taskId).then(rTask => {
        this.setState({
            isLoading: false,
            task: rTask,
            updatedTask: {
                images: rTask.images,
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

  handleUpdate () {
    const taskId = this.state.task.id;
    const updatedTask = this.state.updatedTask;

    updatedTask.price *= 100;

    apiTaskImage.createItem(taskId, updatedTask.images);

    apiTask.updateItem(taskId, updatedTask).then(task => coreNavigation.goTo(`/task/${taskId}`));
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
                                    <h4>Titel</h4>
                                    <TextField
                                        
                                        ref="title"
                                        onChange={ this.handleFieldChange('title') }
                                        value={this.state.updatedTask.title}
                                        style={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                    />
                                </div> 
                                <div className="col-xs-12">
                                    <h4>Beschreibung</h4>
                                    <HtmlTextField onChange={this.handleFieldChange('description')} value={this.state.updatedTask.description}/>
                                    <hr />
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
                                                label={translate("PRICING_MODEL_HOURLY")}
                                            />
                                            <RadioButton
                                                value={0}
                                                label={translate("PRICING_MODEL_TOTAL")}
                                            />
                                            <RadioButton
                                                value={2}
                                                label={translate("PRICING_MODEL_REQUEST_QUOTE")}
                                            />
                                    </RadioButtonGroup>
                                </div>
                                { this.state.task.priceType !== 2 &&
                                    <div className="col-xs-12">
                                                <TextField
                                                    onChange={ this.handleFieldChange('price') }
                                                    ref="price"
                                                    type="number"
                                                    value={this.state.updatedTask.price }
                                                    style={{width: '100%'}}
                                                    inputStyle={{width: '100%'}}
                                                    floatingLabelText={translate("PRICE")}
                                                />
                                    </div>
                                }

                                <div className="col-xs-12">
                                    <h4>Photos</h4>
                                    <ImageUploader images={this.state.updatedTask.images} onChange={images => {
                                        const updatedTask = this.state.updatedTask;

                                        updatedTask.images = images;

                                        this.setState({ updatedTask });
                                    }} />
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