import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Loader from "../Components/Loader";
import * as apiConfig from '../api/config';
import * as coreNavigation from '../core/navigation';
import { getParams } from '../core/util.js'
import { getConfigAsync } from '../core/config';
import LANG_CODES from '../constants/LANG_CODES.js';
import LABELS from '../constants/LABELS.js';
import LabelEdit from './Components/LabelEdit';

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

const labelGroups = _.groupBy(labels, 'group');

export default class SectionLabels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: getParams(location.search).lang,
            labels: [],
            languages: [],
            labelsObj: {}
        };

        this.getLabels = lang => {
            this.setState({
                isLoading: true
            });

            apiConfig
            .appLabel
            .getItems({
                lang: lang || this.state.lang
            }, {
                returnRaw: false
            })
            .then(labels => this.setState({
                isLoading: false,
                labels
            }))
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config,
                defaultLang: config.DEFAULT_LANG,
                lang: config.DEFAULT_LANG,
                languages: config.LANGUAGES ? config.LANGUAGES.split(',') : []
            });

            this.getLabels(config.DEFAULT_LANG || 'en');
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
                            <MenuItem value={this.state.defaultLang} primaryText={LANG_CODES[this.state.defaultLang]} />
                            { this.state.languages.map(language => 
                                <MenuItem value={language} primaryText={LANG_CODES[language]} />
                            )}
                        </DropDownMenu>
                    </div>
                    <div className="col-xs-12">
                            <TextField
                                onChange={(ev, value) => {
                                    this.setState({
                                        labelKeySearch: value.toUpperCase()
                                    });
                                }}
                                value={this.state.labelKeySearch}
                                floatingLabelText="Search key"
                            />
                            <TextField
                                style={{ marginLeft: 30 }}
                                onChange={(ev, value) => {
                                    this.setState({
                                        labelValueSearch: value.toUpperCase()
                                    });
                                }}
                                value={this.state.labelValueSearch}
                                floatingLabelText="Search value"
                            />
                    </div>
                </div>

                { this.state.isLoading && <Loader isLoading={true}/> }

                { !this.state.isLoading && Object.keys(labelGroups)
                .map(labelGroupKey => {
                    const labelGroup = labelGroups[labelGroupKey];
                    
                    const allowedLabelKeys = this.state.labels
                        .filter(_ => {
                            if (!_.labelValue) {
                                return false;
                            }

                            return _.labelValue.toUpperCase().indexOf(this.state.labelValueSearch) > -1;
                        })
                        .map(_ => _.labelKey);
                

                    let filteredLabelGroup = !this.state.labelKeySearch ?
                        labelGroup :
                        labelGroup.filter(_ => {
                            return _.key.indexOf(this.state.labelKeySearch) > -1;
                        });

                    filteredLabelGroup = !this.state.labelValueSearch ?
                        filteredLabelGroup :
                        filteredLabelGroup.filter(_ => {
                            return allowedLabelKeys.indexOf(_.key) > -1
                        });
                    
                    return !!filteredLabelGroup.length && <LabelEdit
                        lang={this.state.lang}
                        header={labelGroupKey}
                        fields={filteredLabelGroup}
                        labels={this.state.labels}
                        onContinue={() => {}}
                    />
                })}
            </div>
      );
    }
};
