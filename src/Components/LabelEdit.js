import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';
import { getLang } from '../core/i18n';

export default class LabelEdit extends React.Component {
    constructor() {
        super();
        this.state = { 
            labels: {}
        };
    }

    componentDidMount() {
        apiConfig
            .appLabel
            .getItems({
                lang: getLang()
            }, {
                returnRaw: false
            })
            .then(labels => {
                const labelsObj = {};
                const propKeys = this.props.fields.map(_ => _.key);
            
                labels
                .filter(labelItem => {
                    return propKeys.indexOf(labelItem.labelKey) > -1;
                })
                .forEach(labelItem => {
                    labelsObj[labelItem.labelKey] = labelItem.labelValue;
                });

                return this.setState({
                    labels,
                    labelsObj
                });
            });
    }

    render() {
        return (
            <div className="row">
                    <h1>{this.props.header}</h1>
                    <p className="text-muted">{this.props.desc}</p>
                    <hr />
                    <div className="col-xs-12">
                        { this.state.labels &&
                            <EditableEntity
                                saveLabel="Save"
                                showCancelBtn={false}
                                value={this.state.labelsObj}
                                fields={this.props.fields}
                                onConfirm={
                                    updatedEntity => {
                                        const updatedData = Object.keys(updatedEntity)
                                        .map(labelKey => {
                                            const mappedItem = {};

                                            mappedItem.lang = getLang();
                                            mappedItem.labelKey = labelKey;
                                            mappedItem.labelValue = updatedEntity[labelKey];

                                            return mappedItem;
                                        });
                                        
                                        apiConfig
                                            .appLabel
                                            .createItem(updatedData);

                                        this.setState({
                                            labels: updatedEntity
                                        });

                                        this.props.onContinue();
                                    }
                                }
                            />
                        }
                </div>    
            </div>);
        }
}
