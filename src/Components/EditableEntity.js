import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import TextField from 'material-ui/TextField';

import apiUser from '../api/user';

import * as coreNavigation from '../core/navigation';

import '../App.css';

export default class EditableEntity extends Component {
    constructor(props) {
        super(props);
        
        const updatedEntity = {};

        props.fields.map(field => updatedEntity[field.key] = '');

        this.state = {
            isLoading: true,
            fields: props.fields,
            updatedEntity: props.value || updatedEntity
        };

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    componentDidMount() {
        
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            isLoading: !nextProps.value,
            updatedEntity: nextProps.value || {},
        });
    } 
    handleFieldChange (field, transform) {
            return (event, value) => {
                const updatedEntity = this.state.updatedEntity;

                updatedEntity[field] = transform ? transform(value) : value;
                
                this.setState({ updatedEntity });
            };
    }
    handleUpdate ()  {
        const updatedEntity = this.state.updatedEntity;

        this.props.onConfirm(this.state.updatedEntity);
    }
    render() {
            return (
                <div>
                { this.state.isLoading && 
                        <div className="text-center" style={{ 'marginTop': '40px' }}>
                            <CircularProgress size={80} thickness={5} />
                        </div>
                }
                { !this.state.isLoading &&    
                            <div className="container">
                                <div className="col-xs-12 col-sm-8">
                                    { this.props.fields.map((field, index) =>
                                        <div className="col-xs-12" key={index}>
                                            <TextField
                                                ref="title"
                                                onChange={ this.handleFieldChange(field.key) }
                                                value={this.state.updatedEntity[field.key]}
                                                style={{width: '100%'}}
                                                inputStyle={{width: '100%'}}
                                                floatingLabelText={field.label}
                                                hintText={field.hint}
                                                floatingLabelFixed={true}
                                            />
                                        </div> 
                                    )}
                                    <div className="row">
                                        <div className="col-xs-12" style={{ marginTop: 30 }}>
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
                            </div>
                    }
                </div>
            );
    }
};