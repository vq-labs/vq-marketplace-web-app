import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import EditableEntity from '../Components/EditableEntity';
import Loader from "../Components/Loader";
import * as apiConfig from '../api/config';
import * as coreNavigation from '../core/navigation';
import { getParams } from '../core/util.js'
import { getConfigAsync } from '../core/config';

const _ = require('underscore');

const LANG_CODES = {
   de: "Deutsch",
   en: "English",
   pl: "Polski",
   hu: "Magyar"
};

export default class SectionLabels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: getParams(location.search).lang || 'en',
            labels: [],
            labelsObj: {}
        };

        this.getLabels = lang => {
            this.setState({
                isLoading: true
            });

            apiConfig.appLabel
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
                    isLoading: false,
                    labels,
                    labelsObj
                });
            })
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config,
                lang: config.DEFAULT_LANG
            });

            this.getLabels(config.DEFAULT_LANG);
        });
    }
    
    render() {
            return (
             <div className="col-xs-12">
                <div className="row"> 
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
                            { true && <MenuItem value={this.state.lang} primaryText={LANG_CODES[this.state.lang]} /> }
                            { false && <MenuItem value={'de'} primaryText="Deutsch" /> }
                            { false && <MenuItem value={'en'} primaryText="English" /> }
                            { false && <MenuItem value={'de'} primaryText="Deutsch" /> }
                            { false && <MenuItem value={'pl'} primaryText="Polski" /> }
                            { false && <MenuItem value={'hu'} primaryText="Magyar" /> }
                        </DropDownMenu>
                    </div>
                </div>

                { this.state.isLoading && <Loader isLoading={true}/> }

                { !this.state.isLoading && Boolean(this.state.labels.length) &&
                    <EditableEntity
                        enableKeySearch={true}
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
