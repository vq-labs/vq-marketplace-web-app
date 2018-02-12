import React from 'react';
import DOMPurify from 'dompurify';
import EditableEntity from '../../Components/EditableEntity';
import { appConfig } from '../../api/config';
import Loader from "../../Components/Loader";
import _ from 'underscore';

function getField(fieldKey, fields) {
    let result = null;

    fields.map(field => {
      if (field.key === fieldKey) {
        result = field;
        return
      }
      if (!result && field.subFields && field.subFields.length > 0) {
        result = getField(fieldKey, field.subFields);
        return;
      }
    });

    if (result) {
      return result;
    }
}

export default class ConfigEdit extends React.Component {
    constructor() {
        super();
        this.state = { 
            isLoading: true,
            meta: {},
            shouldRender: true
        };
    }

    shouldRender(fields, config) {
        let shouldRender = [];
    
        fields.forEach(field => {
            if (field.condition) {
                if (Array.isArray(field.condition) === true) {
                    const conditions = [];
                    for (var i = 0; i < field.condition.length; i++) {
                        if (
                            config &&
                            config[field.condition[i].key] &&
                            config[field.condition[i].key] === field.condition[i].value
                        ) {
                            conditions.push(true);
                        } else {
                            conditions.push(false);
                        }
                    }

                    shouldRender.push(_.some(conditions));
                } else if (
                    Array.isArray(field.condition) === false &&
                    config &&
                    config[field.condition.key] &&
                    config[field.condition.key] === field.condition.value
                ) {
                    shouldRender.push(true);
                } else {
                    shouldRender.push(false);
                }
            } else {
                shouldRender.push(true);
            }
        })
          return _.some(shouldRender);
    }

    componentDidMount() {
        appConfig
            .getItems()
            .then(meta => {
                const shouldRender = this.shouldRender(this.props.fields, meta);

                this.setState({
                    isLoading: false,
                    meta,
                    shouldRender
                });
            });
    }

    render() {
        if (this.state.shouldRender) {
            return (
                <div className="row">
                        { this.state.isLoading &&
                            <Loader isLoading={true} />
                        }
    
                        {this.props.header && <h1>{this.props.header}</h1> }
                        {this.props.desc &&
                            <p className="text-muted">
                                <div className="text-muted" dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(this.props.desc)
                                }}></div>
                            </p>
                        }
                        {(this.props.header || this.props.desc) && <hr /> }
    
                        <div className="col-xs-12">
                            { this.state.meta &&
                                <EditableEntity
                                    saveLeft={true}
                                    showCancelBtn={false}
                                    value={this.state.meta} 
                                    fields={this.props.fields}
                                    onConfirm={
                                        updatedEntity => {
    
                                            const updatedData = [];
    
                                            Object.keys(updatedEntity)
                                            .forEach(fieldKey => {
    
                                                const field = getField(fieldKey, this.props.fields);
    
                                                if (field) {
                                                  const mappedItem = {};
    
                                                  mappedItem.fieldKey = fieldKey;
                                                  mappedItem.fieldValue = field.transformOnSave ? field.transformOnSave(updatedEntity[fieldKey]) : updatedEntity[fieldKey];
    
                                                  if (field.type === 'select') {
                                                      mappedItem.fieldValue = typeof updatedEntity[fieldKey] === 'string' ?
                                                          updatedEntity[fieldKey] :
                                                          updatedEntity[fieldKey].join(',');
                                                  }
    
                                                  if (field.type === 'bool') {
                                                      mappedItem.fieldValue =
                                                      (updatedEntity[fieldKey] === "1" || updatedEntity[fieldKey] === true)
                                                  }
    
                                                  updatedData.push(mappedItem);
                                                }
    
    
                                            });
    
                                            appConfig
                                            .createItem(updatedData)
                                            .then(res => {
                                                window.location.reload();
                                            });
    /* 
                                            this.setState({
                                                meta: updatedEntity
                                            }) */
                                        }
                                    }
                                />
                            }
                    </div>    
                </div>
            );
        }
        return null;
    }

}
