import React, { Component } from 'react';
import { TwitterPicker } from 'react-color';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HtmlTextField from './HtmlTextField';
import ImageUploader from './ImageUploader';
import FileUploader from './FileUploader';
import DOMPurify from 'dompurify'
import * as coreNavigation from '../core/navigation';
import { getConfigAsync } from '../core/config';
import { translate } from '../core/i18n';
import '../App.css';

const _ = require('underscore');

export default class EditableEntity extends Component {
    constructor(props) {
        super(props);

        const updatedEntity = _.clone(props.value) || {};

        props.fields.forEach(field => {
            if (field.type === 'bool') {
                updatedEntity[field.key] = updatedEntity[field.key] === true || updatedEntity[field.key] === '1';

                return;
            }

            if (field.type === 'select' && field.multiple) {
                updatedEntity[field.key] = updatedEntity[field.key] ?
                    updatedEntity[field.key].split(",") : [];

                return;
            }

            updatedEntity[field.key] = updatedEntity[field.key] || '';
        });
        
        this.state = {
            valid: true,
            validationErrors: {},
            canSave: props.canSave,
            showCancelBtn: props.showCancelBtn,
            isLoading: false,
            fields: props.fields,
            updatedEntity,
            dirty: false
        };
 
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    
    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config
            });
        });
    }

    componentWillReceiveProps (nextProps) {
        const updatedEntity = _.clone(nextProps.value) || {};

        this.props.fields
        .forEach(field => {
            if (field.type === 'bool') {
                updatedEntity[field.key] = updatedEntity[field.key] === true || updatedEntity[field.key] === '1';

                return;
            }

            if (field.type === 'select' && field.multiple) {
                if (typeof updatedEntity[field.key] === 'string') {
                    return updatedEntity[field.key].split(',');
                }

                updatedEntity[field.key] = updatedEntity[field.key] || [];

                return;
            }
        });

        this.setState({
            fields: nextProps.fields,
            canSave: nextProps.canSave,
            isLoading: !nextProps.value,
            updatedEntity
        });
    } 
  
    updateField(field, fieldKey, fieldValue, transform, isArray) {
        const updatedEntity = this.state.updatedEntity;
        const validationErrors = this.state.validationErrors;

        if (field.regex) {
            validationErrors[fieldKey] = !fieldValue.match(field.regex);
        }
        
        const valid = !(Object.keys(validationErrors)
            .filter(fieldKey => validationErrors[fieldKey])
            .length)

        updatedEntity[fieldKey] = transform ? transform(fieldValue) : fieldValue;
        
        this.state.fields
        .filter(_ => _.deriveValue)
        .forEach(_ => {
            if (_.key !== fieldKey) {
                updatedEntity[_.key] = _.deriveValue(updatedEntity);
            }
        });
        
        this.setState({
            updatedEntity,
            valid,
            dirty: true
        });
    }

    handleFieldChange (field, transform) {
        return (_, fieldValue) => this.updateField(field, field.key, fieldValue, transform);
    }
    
    handleFieldSelections (field, transform) {
        return (_, _2, values) => this.updateField(field, field.key, values.filter(_ => _.length === 2), transform);
    }

    handleFieldSelection (field, transform) {
        return (_, _2, fieldValue) => this.updateField(field, field.key, fieldValue, transform);
    }

    handleUpdate () {
        this.setState({
            dirty: false
        });

        this.props.onConfirm(this.state.updatedEntity);
    }
    
    render() {
            return (
                <div className="col-xs-12">
                { this.state.isLoading &&
                    <div className="text-center" style={{ 'marginTop': '40px' }}>
                        <CircularProgress size={80} thickness={5} />
                    </div>
                }
                { !this.state.isLoading &&
                            <div className="col-xs-12">
                                
                                <div className="col-xs-12 col-sm-8">
                                    {   this.state.fields
                                        .map((field, index) =>
                                            <div className="col-xs-12" key={field.key}>
                                                    { field.type === 'color' &&
                                                        <div style={{ marginBottom: 20 }}>
                                                            <TextField
                                                                floatingLabelFixed={true}
                                                                floatingLabelText={field.label}
                                                                disabled={true}
                                                                value={this.state.updatedEntity[field.key]}
                                                            />
                                                            <TwitterPicker
                                                                color={this.state.updatedEntity[field.key]}
                                                                onChange={color => {
                                                                    this.handleFieldChange(field.key)(undefined, color.hex);
                                                                }}
                                                            />
                                                        </div>
                                                    }
                                                    { (field.type === 'string' || field.type === 'number') &&
                                                        <div style={{ marginBottom: 20 }}>
                                                            { field.title &&
                                                                <div>
                                                                    <h3>{field.title}</h3>
                                                                </div>
                                                            }
                                                            <div>
                                                                { field.type === 'string' &&
                                                                    <TextField
                                                                        key={index}
                                                                        type={field.type}
                                                                        disabled={field.deriveValue}
                                                                        onChange={this.handleFieldChange(field)}
                                                                        value={this.state.updatedEntity[field.key]}
                                                                        style={{width: '100%'}}
                                                                        inputStyle={{width: '100%'}}
                                                                        floatingLabelText={field.label}
                                                                        hintText={field.hint}
                                                                        floatingLabelFixed={true}
                                                                    />
                                                                }
                                                                { field.type === 'number' &&
                                                                    <TextField
                                                                        min={field.min}
                                                                        max={field.max}
                                                                        key={index}
                                                                        type={field.type}
                                                                        disabled={field.deriveValue}
                                                                        onChange={this.handleFieldChange(field)}
                                                                        errorText={this.state.validationErrors[field.key] && 'Invalid value'}
                                                                        value={this.state.updatedEntity[field.key]}
                                                                        style={{width: '100%'}}
                                                                        inputStyle={{width: '100%'}}
                                                                        floatingLabelText={field.label}
                                                                        hintText={field.hint}
                                                                        floatingLabelFixed={true}
                                                                    />
                                                                }
                                                                { field.explanation &&
                                                                    <div>
                                                                        <div className="text-muted" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(field.explanation)}}>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    { field.type === 'select' && field.multiple &&
                                                    <SelectField
                                                        style={{width: '100%'}}
                                                        disabled={field.disabled}
                                                        multiple={field.multiple}
                                                        floatingLabelText={field.label}
                                                        value={this.state.updatedEntity[field.key]}
                                                        onChange={this.handleFieldSelections(field)}
                                                    >
                                                        {field.selection.map((selectionItem, index) =>
                                                            <MenuItem
                                                                key={index}
                                                                insetChildren={true}
                                                                value={selectionItem.value}
                                                                checked={
                                                                    this.state.updatedEntity[field.key] &&
                                                                    this.state.updatedEntity[field.key].indexOf(selectionItem.value) > -1}
                                                                primaryText={selectionItem.label}
                                                            />
                                                        )}
                                                    </SelectField>
                                                    }

                                                    { field.type === 'select' && !field.multiple &&
                                                    <SelectField
                                                        style={{width: '100%'}}
                                                        disabled={field.disabled}
                                                        multiple={field.multiple}
                                                        floatingLabelText={field.label}
                                                        value={this.state.updatedEntity[field.key]}
                                                        onChange={this.handleFieldSelection(field)}
                                                    >
                                                        {field.selection.map((selectionItem, index) => 
                                                            <MenuItem key={index} value={selectionItem.value} primaryText={selectionItem.label} />
                                                        )}
                                                    </SelectField>
                                                    }

                                                    { (field.type === 'html') &&
                                                        <div className="row">
                                                            { field.label &&
                                                                <div className="col-xs-12">
                                                                    <h3>{field.label}</h3>
                                                                </div>
                                                            }
                                                            <div className="col-xs-12">
                                                                <HtmlTextField
                                                                    value={this.state.updatedEntity[field.key]}
                                                                    onChange={this.handleFieldChange(field)}
                                                                >
                                                                </HtmlTextField>
                                                            </div>
                                                        </div>
                                                    }
                                                    
                                                    { field.type === 'bool' &&
                                                        <div style={{ marginTop: 15 }}>
                                                            <Checkbox
                                                                disabled={field.disabled}
                                                                label={field.label}
                                                                checked={
                                                                    this.state.updatedEntity[field.key] === "1" || this.state.updatedEntity[field.key] === true
                                                                }
                                                                onCheck={this.handleFieldChange(field)}
                                                            />
                                                            
                                                            { field.explanation &&
                                                                <div>
                                                                    <div className="text-muted" dangerouslySetInnerHTML={{
                                                                        __html: DOMPurify.sanitize(field.explanation)
                                                                    }}></div>
                                                                </div>
                                                            }
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
                                                                this.handleFieldChange(field)(null, images[0] ? images[0].imageUrl : undefined)
                                                            }}
                                                        />
                                                    }
                                                    { field.type === 'single-image' &&
                                                        <div style={{ marginTop: 15 }}>
                                                            <strong>{field.label}</strong>
                                                            {field.hint && <p>{field.hint}</p>}
                                                            <ImageUploader
                                                                imageResolution={field.imageResolution}
                                                                singleImageMode={true}
                                                                images={
                                                                    this.state.updatedEntity[field.key] ?
                                                                    [{ imageUrl: this.state.updatedEntity[field.key] }] :
                                                                    []
                                                                } 
                                                                onChange={images => {
                                                                    this.handleFieldChange(field)(null, images[0] ? images[0].imageUrl : undefined)
                                                                }}
                                                            />
                                                        </div>
                                                    }

                                                    { field.type === 'single-file' &&
                                                        <div style={{ marginTop: 15 }}>
                                                            <strong>{field.label}</strong>
                                                            {field.hint && <p>{field.hint}</p>}
                                                            <FileUploader
                                                                files={
                                                                    this.state.updatedEntity[field.key] ?
                                                                    [{ fileUrl: this.state.updatedEntity[field.key] }] :
                                                                    []
                                                                } 
                                                                onChange={files => {
                                                                    this.handleFieldChange(field)(null, files[0] ? files[0].fileUrl : undefined)
                                                                }}
                                                            />
                                                        </div>
                                                    }
                                            </div>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12" style={{ marginTop: 30 }}>
                                            { this.state.config &&
                                                this.state.showCancelBtn &&  
                                                <FlatButton
                                                    style={{ float: 'left' }}
                                                    label={this.props.cancelLabel || 'Cancel'}
                                                    primary={true}
                                                    disabled={false}
                                                    onTouchTap={ () => this.props.onCancel ? this.props.onCancel() : coreNavigation.goBack() }
                                                />
                                            }
                                            { this.state.config &&
                                                <RaisedButton
                                                    primary={true}
                                                    disabled={!this.state.valid || (!this.props.enableSkip ? !this.state.dirty : false)}
                                                    style={{float: this.props.saveLeft ? 'left' : 'right'}}
                                                    label={this.props.saveLabel || translate("SAVE")}
                                                    onTouchTap={this.handleUpdate}
                                                />
                                            }
                                        </div>
                                    </div>  
                            </div>
                    }
                </div>
            );
    }
};