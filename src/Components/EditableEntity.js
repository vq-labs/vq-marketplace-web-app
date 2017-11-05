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
            if (_.type === 'bool') {
                updatedEntity[_.key] = updatedEntity[_.key] === true || updatedEntity[_.key] === '1';

                return;
            }

            updatedEntity[_.key] = '';
        });

        const groupedFields = props.groupBy ?
            _.groupBy(props.fields, props.groupBy) :
            { '': props.fields }

        this.state = {
            canSave: props.canSave,
            showCancelBtn: props.showCancelBtn,
            groupedFields,
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

        this.state.fields
        .forEach(_ => {
            if (_.type === 'bool') {
                updatedEntity[_.key] = updatedEntity[_.key] === true || updatedEntity[_.key] === '1';
            }
        });

        this.setState({
            canSave: nextProps.canSave,
            isLoading: !nextProps.value,
            updatedEntity
        });
    } 
    
    updateField(fieldKey, fieldValue, transform) {
        const updatedEntity = this.state.updatedEntity;
        
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
            dirty: true
        });
    }

    handleFieldChange (fieldKey, transform) {
        return (_, fieldValue) => this.updateField(fieldKey, fieldValue, transform);
    }
    
    handleFieldSelection (fieldKey, transform) {
        return (_, _2, fieldValue) => this.updateField(fieldKey, fieldValue, transform);
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
                                {this.props.enableKeySearch &&
                                    <div className="col-xs-12">
                                        <TextField
                                            onChange={(ev, value) => {
                                                this.setState({
                                                    labelKeySearchValue: value.toUpperCase()
                                                });
                                            }}
                                            value={this.state.labelKeySearchValue}
                                            floatingLabelText="Search"
                                        />
                                    </div>
                                }
                                <div className="col-xs-12 col-sm-8">
                                    { Object.keys(this.state.groupedFields)
                                    .map((groupKey) =>
                                        <div className="row">
                                        <h3>{groupKey}</h3>
                                        {this.state.groupedFields[groupKey]
                                        .filter(_ => {
                                            if (!this.props.enableKeySearch) {
                                                return true;
                                            }

                                            if (!this.state.labelKeySearchValue) {
                                                return true;
                                            }

                                            return _.key.toUpperCase().indexOf(this.state.labelKeySearchValue) > -1;
                                        })
                                        .map((field, index) =>
                                            <div className="col-xs-12" key={index}>
                                                    { field.type === 'color' &&
                                                        <div>
                                                        <TextField
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
                                                        <div className="row">
                                                            { field.title &&
                                                                <div className="col-xs-12">
                                                                    <h3>{field.title}</h3>
                                                                </div>
                                                            }
                                                            <div className="col-xs-12">
                                                                <TextField
                                                                    key={index}
                                                                    type={field.type}
                                                                    disabled={field.deriveValue}
                                                                    onChange={this.handleFieldChange(field.key)}
                                                                    value={this.state.updatedEntity[field.key]}
                                                                    style={{width: '100%'}}
                                                                    inputStyle={{width: '100%'}}
                                                                    floatingLabelText={field.label}
                                                                    hintText={field.hint}
                                                                    floatingLabelFixed={true}
                                                                />
                                                            </div>
                                                            { field.explanation &&
                                                                <div className="col-xs-12">
                                                                    <div dangerouslySetInnerHTML={{
                                                                        __html: DOMPurify.sanitize(field.explanation)
                                                                    }}></div>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                    { field.type === 'select' &&
                                                    <SelectField
                                                        style={{width: '100%'}}
                                                        disabled={field.disabled}
                                                        floatingLabelText={field.label}
                                                        value={this.state.updatedEntity[field.key]}
                                                        onChange={this.handleFieldSelection(field.key)}
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
                                                                    onChange={this.handleFieldChange(field.key)}
                                                                >
                                                                </HtmlTextField>
                                                            </div>
                                                        </div>
                                                    }
                                                    
                                                    { field.type === 'bool' &&
                                                        <div className="col-xs-12">
                                                            <Checkbox
                                                                disabled={field.disabled}
                                                                label={field.label}
                                                                checked={this.state.updatedEntity[field.key]}
                                                                onCheck={this.handleFieldChange(field.key)}
                                                            />
                                                            
                                                            { field.explanation &&
                                                                <div className="col-xs-12">
                                                                    <div dangerouslySetInnerHTML={{
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
                                                                this.handleFieldChange(field.key)(null, images[0] ? images[0].imageUrl : undefined)
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
                                                                    this.handleFieldChange(field.key)(null, images[0] ? images[0].imageUrl : undefined)
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
                                                                    this.handleFieldChange(field.key)(null, files[0] ? files[0].fileUrl : undefined)
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
                                                    backgroundColor={this.state.config.COLOR_PRIMARY}
                                                    disabled={!this.props.enableSkip ? !this.state.dirty : false}
                                                    labelStyle={{color: 'white '}}
                                                    style={{float: 'right'}}
                                                    label={this.props.saveLabel || translate("SAVE")}
                                                    onTouchTap={ this.handleUpdate }
                                                />
                                            }
                                        </div>
                                    </div>  
                                </div>
                            </div>
                    }
                </div>
            );
    }
};