import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import EditableEntity from '../Components/EditableEntity';
import * as apiConfig from '../api/config';
import * as coreNavigation from '../core/navigation';
import * as coreUtil from '../core/util.js'

const _ = require('underscore');

export default class SectionLabels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: coreUtil.getParams(location.search).lang || 'en',
            labels: [],
            labelsObj: {}
        };

        this.getLabels = lang => apiConfig.appLabel
            .getItems({
                lang: lang || this.state.lang
            }, {
                returnRaw: false
            })
            .then(rLabels => {
                const labelsObj = {};
                const labels = rLabels
                    .map(labelItem => { 
                        return {
                            type: 'string',
                            key: labelItem.labelKey,
                            label: labelItem.labelKey,
                            group: labelItem.labelGroup
                        };
                    });

                rLabels
                .forEach(labelItem => {
                    labelsObj[labelItem.labelKey] = labelItem.labelValue;
                })

                this.setState({
                    labels,
                    labelsObj
                });
            });
    }

    componentDidMount() {
        this.getLabels(this.state.lang);
    }
    
    render() {
            return (
             <div className="col-xs-12">
                <div>
                    <DropDownMenu value={this.state.lang} onChange={(event, index, value) => {
                        this.setState({
                            labels: [],
                            labelsObj: {},
                            lang: value
                        });

                        coreNavigation.setQueryParams({
                            lang: value
                        });
                        
                        this.getLabels(value);
                    }}>
                        <MenuItem value={'en'} primaryText="English" />
                        <MenuItem value={'de'} primaryText="Deutsch" />
                        <MenuItem value={'pl'} primaryText="Polski" />
                        <MenuItem value={'hu'} primaryText="Magyar" />
                    </DropDownMenu>
                </div>
                 { Boolean(this.state.labels.length) &&
                    <EditableEntity
                        groupBy="group"
                        showCancelBtn={false}
                        value={this.state.labelsObj}
                        fields={this.state.labels}
                        onConfirm={
                            updatedEntity => {
                                const updatedData = Object.keys(updatedEntity)
                                    .map(labelKey => {
                                        const mappedItem = {};

                                        mappedItem.lang = this.state.lang;
                                        mappedItem.labelKey = labelKey;
                                        mappedItem.labelValue = updatedEntity[labelKey];
                            
                                        return mappedItem;
                                    });

                                apiConfig.appLabel.createItem(updatedData);

                                this.setState({
                                    labelsObj: updatedEntity
                                });
                            }
                        }
                    />
                }
            </div>
      );
    }
};
