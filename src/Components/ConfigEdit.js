import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

export default class ConfigEdit extends React.Component {
    constructor() {
        super();
        this.state = { 
            meta: {} 
        };
    }

    componentDidMount() {
        apiConfig.appConfig
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
                    <div className="col-xs-12">
                        <h1>{this.props.header}</h1>
                        <p className="text-muted">{this.props.desc}</p>
                        <hr />
                        { this.state.meta &&
                            <EditableEntity
                                showCancelBtn={false}
                                value={this.state.meta} 
                                fields={this.props.fields}
                                onConfirm={
                                    updatedEntity => {
                                        const updatedData = Object.keys(updatedEntity).map(fieldKey => {
                                            const mappedItem = {};

                                            mappedItem.fieldKey = fieldKey;
                                            mappedItem.fieldValue = updatedEntity[fieldKey];

                                            return mappedItem;
                                        });

                                        apiConfig
                                            .appConfig
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
