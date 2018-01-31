import React from 'react';
import DOMPurify from 'dompurify';
import EditableEntity from '../../Components/EditableEntity';
import { appConfig } from '../../api/config';
import Loader from "../../Components/Loader";

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

function hasField(fieldKey, fields) {
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
      return true;
    }
}

export default class ConfigEdit extends React.Component {
    constructor() {
        super();
        this.state = { 
            isLoading: true,
            meta: {} 
        };
    }

    componentDidMount() {
        appConfig
            .getItems()
            .then(meta => {
                return this.setState({
                    isLoading: false,
                    meta
                });
            });
    }

    render() {
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
                                              mappedItem.fieldValue = updatedEntity[fieldKey];

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
                                        .createItem(updatedData);

                                        this.setState({
                                            meta: updatedEntity
                                        })
                                    }
                                }
                            />
                        }
                </div>    
            </div>);
        }
}
