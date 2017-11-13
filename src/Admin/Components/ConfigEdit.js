import React from 'react';
import EditableEntity from '../../Components/EditableEntity';
import { appConfig } from '../../api/config';

export default class ConfigEdit extends React.Component {
    constructor() {
        super();
        this.state = { 
            meta: {} 
        };
    }

    componentDidMount() {
        appConfig
            .getItems()
            .then(meta => {
                return this.setState({
                    meta
                });
            });
    }

    render() {
        return (
            <div className="row">
                    {this.props.header && <h1>{this.props.header}</h1> }
                    {this.props.desc && <p className="text-muted">{this.props.desc}</p> }
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
                                        const updatedData = Object.keys(updatedEntity)
                                        .filter(fieldKey => {
                                            return this.props.fields.find(_ => _.key === fieldKey)
                                        })
                                        .map(fieldKey => {
                                            const field = this.props.fields.find(_ => _.key === fieldKey);
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

                                            return mappedItem;
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
