import React from 'react';
import * as apiConfig from '../../api/config';
import EditableEntity from '../../Components/EditableEntity';
import { getLang } from '../../core/i18n';

const async = require("async");

export default class LabelEdit extends React.Component {
    constructor(props) {
        super();

        this.state = { 
            lang: props.lang || getLang(),
            labels: props.labels || null,
            fields: props.fields
        };
    }

    updateLabelsObjFromLabels(labels) {
        const propKeys = this.props.fields.map(_ => _.key);
        const labelsObj = {};

        labels
        .filter(labelItem => {
            return propKeys.indexOf(labelItem.labelKey) > -1;
        })
        .forEach(labelItem => {
            labelsObj[labelItem.labelKey] = labelItem.labelValue;
        });

        return this.setState({
            ready: true,
            labelsObj
        });
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            lang: nextProps.lang || getLang(),
            fields: nextProps.fields
        })
    }

    componentDidMount() {
        async.waterfall([
            cb => {
                const labels = this.props.labels;

                if (labels) {
                    return cb(null, labels);
                }

                apiConfig
                .appLabel
                .getItems({
                    lang: getLang()
                }, {
                    returnRaw: false
                })
                .then(labels => {
                    cb(null, labels);
                }, cb);
            },
            (labels, cb) => this.updateLabelsObjFromLabels(labels)
        ])
    }

    render() {
        return (
            <div className="row">
                    <h1>{this.props.header}</h1>
                    <p className="text-muted">{this.props.desc}</p>
                    <hr />
                    <div className="col-xs-12">
                        <EditableEntity
                            saveLeft={true}
                            saveLabel="Save"
                            showCancelBtn={false}
                            value={this.state.labelsObj}
                            fields={this.state.fields}
                            onConfirm={
                                updatedEntity => {
                                    const updatedData = Object
                                    .keys(updatedEntity)
                                    .map(labelKey => {
                                        const mappedItem = {};

                                        mappedItem.lang = this.state.lang;
                                        mappedItem.labelKey = labelKey;

                                        mappedItem.labelValue = updatedEntity[labelKey];

                                        return mappedItem;
                                    });
                                    
                                    apiConfig
                                        .appLabel
                                        .createItem(updatedData);

                                    this.props.onContinue && this.props.onContinue();
                                }
                            }
                        />
                </div>    
            </div>);
        }
}
