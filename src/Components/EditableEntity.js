import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import ImageUploader from '../Components/ImageUploader';
import * as coreNavigation from '../core/navigation';
import '../App.css';

const _ = require('underscore');

export default class EditableEntity extends Component {
    constructor(props) {
        super(props);

        const updatedEntity = {};

        props.fields.map(field => updatedEntity[field.key] = '');

        const groupedFields = props.groupBy ?
            _.groupBy(props.fields, props.groupBy) :
            { '': props.fields }
        debugger;

        this.state = {
            showCancelBtn: props.showCancelBtn,
            groupedFields,
            isLoading: false,
            fields: props.fields,
            updatedEntity: _.clone(props.value) || updatedEntity,
            dirty: false
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
                
                this.setState({ updatedEntity, dirty: true });
            };
    }
    
    handleUpdate () {
        this.setState({ dirty: false });

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
                                    { Object.keys(this.state.groupedFields).map((groupKey) =>
                                        <div className="row">
                                        <h3>{groupKey}</h3>
                                        {this.state.groupedFields[groupKey].map((field, index) =>
                                            <div className="col-xs-12" key={index}>
                                                    { (field.type === 'string' || field.type === 'number') &&
                                                        <TextField
                                                            key={index}
                                                            type={field.type}
                                                            onChange={this.handleFieldChange(field.key)}
                                                            value={this.state.updatedEntity[field.key]}
                                                            style={{width: '100%'}}
                                                            inputStyle={{width: '100%'}}
                                                            floatingLabelText={field.label}
                                                            hintText={field.hint}
                                                            floatingLabelFixed={true}
                                                        />
                                                    }
                                                    { field.type === 'bool' &&
                                                        <div className="col-xs-12">
                                                            <div className="push-left">
                                                                {field.label}: {Number(this.state.updatedEntity[field.key]) ? 'enabled' : 'disabled' }
                                                            </div>
                                                        </div>
                                                    }
                                                    { field.type === 'image' &&
                                                        <ImageUploader
                                                            singleImageMode={false}
                                                            images={
                                                                this.state.updatedEntity[field.key] ?
                                                                [{ imageUrl: this.state.updatedEntity[field.key] }] :
                                                                []
                                                            } 
                                                            onChange={images => {
                                                                this.handleFieldChange(field.key)(null, images[0] ? images[0].imageUrl : undefined)
                                                            }}
                                                        />
                                                    }
                                                    { field.type === 'single-image' &&
                                                        <div>
                                                            <h3>{field.label}</h3>
                                                            <p>{field.hint}</p>
                                                            <ImageUploader
                                                                singleImageMode={true}
                                                                images={
                                                                    this.state.updatedEntity[field.key] ?
                                                                    [{ imageUrl: this.state.updatedEntity[field.key] }] :
                                                                    []
                                                                } 
                                                                onChange={images => {
                                                                    this.handleFieldChange(field.key)(null, images[0] ? images[0].imageUrl : undefined)
                                                                }}
                                                            />
                                                        </div>
                                                    }
                                            </div>
                                        )}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-xs-12" style={{ marginTop: 30 }}>
                                            { this.state.showCancelBtn &&  
                                                <FlatButton
                                                    style={ { float: 'left' } }
                                                    label={this.props.cancelLabel || 'Cancel'}
                                                    primary={true}
                                                    disabled={false}
                                                    onTouchTap={ () => this.props.onCancel ? this.props.onCancel() : coreNavigation.goBack() }
                                                />
                                            }
                                            <RaisedButton
                                                disabled={!this.state.dirty}
                                                style={ { float: 'right' } }
                                                label={this.props.saveLabel || 'Save'}
                                                primary={ true }
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