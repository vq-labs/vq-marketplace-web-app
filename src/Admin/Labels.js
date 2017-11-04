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
import LABELS from '../constants/LABELS.js';

const _ = require('underscore');

const labels = Object.keys(LABELS)
    .map(labelKey => { 
        return {
            type: 'string',
            key: labelKey,
            label: labelKey,
            group: LABELS[labelKey]
        };
    });

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
                
                rLabels
                .forEach(labelItem => {
                    labelsObj[labelItem.labelKey] = labelItem.labelValue;
                })

                this.setState({
                    isLoading: false,
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
                                isLoading: true,
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

                { !this.state.isLoading &&
                    <EditableEntity
                        enableKeySearch={true}
                        groupBy="group"
                        showCancelBtn={false}
                        value={JSON.parse(JSON.stringify(this.state.labelsObj))}
                        fields={labels}
                        onConfirm={
                            updatedEntity => {
                                const labelsObj = this.state.labelsObj;
                                const updatedData = Object.keys(updatedEntity)
                                    .filter(labelKey => {
                                        return labelsObj[labelKey] !== updatedEntity[labelKey];
                                    })
                                    .map(labelKey => {
                                        const mappedItem = {};

                                        mappedItem.lang = this.state.lang;
                                        mappedItem.labelKey = labelKey;
                                        mappedItem.labelValue = updatedEntity[labelKey];
                            
                                        labelsObj[labelKey] = updatedEntity[labelKey];

                                        return mappedItem;
                                    });

                                apiConfig
                                .appLabel
                                .createItem(updatedData);

                                this.setState({
                                    labelsObj
                                });
                            }
                        }
                    />
                }
            </div>
      );
    }
};
