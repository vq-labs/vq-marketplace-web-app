import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import EditableEntity from '../Components/EditableEntity';
import * as apiConfig from '../api/config';
import * as coreNavigation from '../core/navigation';
import * as coreUtil from '../core/util.js'

const _ = require('underscore');

const defaultLabels = [ "CREATE_NEW_LISTING", "SALES","CATEGORY","CONFIRM_BEFORE_POSTING","ACTIVATE","DEACTIVATE","EDIT","REMOVE","ADD_PICTURE_HEADER","ADD_PICTURE_DESC","ADD_PICTURE_ACTION_HEADER","ADD_PICTURE_ACTION_DESC","NO_LISTING_IMAGES","LISTING_INFO","LISTING_IMAGES","MESSAGE","LOGIN","SIGNUP","PROFILE","OPTIONAL","BACK","PRICING","IS_REQUIRED","LOCATION","DESCRIPTION","TITLE","DESCRIBE_YOUR_LISTING","QUICK_CHOICE","DETERMINE_PRICING_MODEL","PRICE","CONTINUE","CONFIRM_AND_POST","YOUR_LISTING_HAS_BEEN_SUBMITTED","CHOOSE_CATEGORY_LISTING","STEP","IN_THIS_CHAT","REQUESTS","NO_REQUESTS","CANCEL","SAVE","FIRST_NAME","LAST_NAME","PROFILE_BIO","PROFILE_BIO_DESC","WEBSITE","TALENTS","NO_TALENTS","ACTIVE_LISTINGS_DESC","ACTIVE_LISTINGS","NO_ACTIVE_LISTINGS","POST_NEW_LISTING","EDIT_PROFILE","CHANGE_PROFILE_PICTURE","PRICING_MODEL_HOURLY","PRICING_MODEL_TOTAL","PRICING_MODEL_REQUEST_QUOTE","VIDEO_FILM","MARKETING","DESIGN","WEB_DEVELOPMENT","CONTENT_WRITING","MY_TASKS","NEW_TASK","BROWSE_TASKS","ALL_CATEGORIES","CHAT","MORE"];

export default class SectionLabels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: coreUtil.getParams(location.search).lang || 'en',
            labels: [],
            labelsObj: {}
        };

        this.getLabels = lang => apiConfig.appLabel.getItems({ lang: lang || this.state.lang }).then(labelsObj => {
            const labels = defaultLabels.map(labelKey => { 
                return { key: labelKey, label: labelKey }
            })

            this.setState({ labels, labelsObj})
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

                        coreNavigation.setQueryParams({ lang: value });
                        
                        this.getLabels(value);
                    }}>
                        <MenuItem value={'en'} primaryText="English" />
                        <MenuItem value={'de'} primaryText="Deutsch" />
                        <MenuItem value={'pl'} primaryText="Polski" />
                    </DropDownMenu>
                </div>

                 { Boolean(this.state.labels.length) &&
                    <EditableEntity
                        showCancelBtn={false}
                        value={this.state.labelsObj}
                        fields={this.state.labels}
                        onConfirm={
                            updatedEntity => {
                                const updatedData = Object.keys(updatedEntity).map(labelKey => {
                                    const mappedItem = {};

                                    mappedItem.lang = this.state.lang;
                                    mappedItem.labelKey = labelKey;
                                    mappedItem.labelValue = updatedEntity[labelKey];

                                    return mappedItem;
                                });

                                apiConfig.appLabel.createItem(updatedData);

                                this.setState({ labelsObj: updatedEntity });
                            }
                        }
                    />
                }
            </div>
      );
    }
};
