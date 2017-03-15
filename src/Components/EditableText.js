import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';

export default class EditableText extends Component {
    constructor(props) {
        super();
        
        this.state = {
            displayValue: props.displayValue,
            editMode: props.autoEditMode,
            hover: false,
            fields: props.fields || { value: 'string' },
            values: props.values || {},
            trueValues: props.values || {},
            placeholder: props.placeholder,
        };

        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            displayValue: nextProps.displayValue,
            placeholder: nextProps.placeholder,
            values: nextProps.values,
            trueValues: nextProps.values
        });
    } 

    getEditableSkill () {
        return <div className="row">
                    <div className="col-xs-12">
                        { 
                            Object.keys(this.state.fields).map(fieldKey => 
                                <TextField
                                    key={fieldKey}
                                    onChange={ event => {
                                        const values = this.state.values;

                                        values[fieldKey] = event.target.value;

                                        this.setState({
                                            values
                                        });
                                    }}
                                    placeholder={this.state.fields[fieldKey].placeholder || ''}
                                    style={{width: '100%'}}
                                    value={this.state.values[fieldKey]}
                                    type="text"
                                />
                            )
                        }
                    </div>

                    <div className="col-xs-12">
                         <FlatButton
                            primary={true}
                            onClick={ () => {
                                this.setState( { editMode: false, trueValues: this.state.values });
                                this.props.onChange(this.state.values);
                            }}
                            label="Bestätigen" style={ { float: 'right' } }
                        />
                        <FlatButton 
                         secondary={true}
                         onClick={ () => {
                             this.props.onCancel && this.props.onCancel();
                             this.setState( { editMode: false, values: this.state.trueValues });
                          } } label="Abbrechen" style={ { float: 'right' } }/>
                    </div>    
                </div>;
    }
    mouseOver() {
        this.setState({ hover: true });
    }

    mouseOut() {
        this.setState({ hover: false });
    }
    render() {
        return (
            <div className="col-xs-12" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                { 
                   this.state.editMode && this.getEditableSkill(this.state.skill)
                }
                { 
                   !this.state.editMode &&
                   <div className="row" onClick={() => this.setState({ editMode: true })} >
                        <div className="col-xs-12 col-sm-11">
                            <p className="text-muted">{this.state.displayValue || this.state.placeholder}</p>
                        </div>
                        { (this.state.hover || this.props.alwaysShowEditIcon) && <div className="col-sm-1"><ModeEditIcon /></div> }
                   </div> 
                }
           </div>
        );
    } 
};
