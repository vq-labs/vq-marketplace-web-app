import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import EditableEntity from '../Components/EditableEntity';
import Loader from "../Components/Loader";
import * as apiConfig from '../api/config';
import * as coreNavigation from '../core/navigation';
import { getParams } from '../core/util.js'
import { getConfigAsync } from '../core/config';
import { getLang } from '../core/i18n';
import LANG_CODES from '../constants/LANG_CODES.js';

const _ = require('underscore');

export default class SectionLabels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: getParams(location.search).lang,
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
                            <MenuItem value={'en'} primaryText={LANG_CODES['en']} />
                            <MenuItem value={'hu'} primaryText={LANG_CODES['hu']} />
                            { false && <MenuItem value={'de'} primaryText="Deutsch" /> }
                            { false && <MenuItem value={'en'} primaryText="English" /> }
                            { false && <MenuItem value={'de'} primaryText="Deutsch" /> }
                            { false && <MenuItem value={'pl'} primaryText="Polski" /> }
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
