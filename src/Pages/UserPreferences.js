import React from 'react';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import RaisedButton from 'material-ui/RaisedButton';
import * as apiConfig from '../api/config';
import * as apiUserPreference from '../api/user-preference';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { goTo } from '../core/navigation';
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import { translate } from '../core/i18n';

export default class SectionCategories extends React.Component {
    constructor() {
        super();

        this.state = {
            categories: [],
            selected: []
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            getUserAsync(user => {
                apiConfig
                    .categories
                    .getItems()
                    .then(categories => {
                        apiUserPreference
                        .getItems(user.id, 'category')
                        .then(preferences => {
                            this.setState({
                                user,
                                config,
                                categories,
                                selected: preferences
                            })
                        });
                });
            });
        });
    }

    isSelected(categoryCode) {
        const selected = this.state.selected;
        const selectedItem = selected
            .find(_ => _.value === categoryCode);
            
        const selectedIndex =  selected
            .indexOf(selectedItem);

        return selectedIndex > -1;
    }

    render() {
            return (
            <div className="container">
                { this.state.config &&
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                {translate('USER_PREFERENCE_HEADER')}
                            </h1>
                            <p className="text-muted">
                                {translate('USER_PREFERENCE_DESC')}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        { this.state.categories && this.state.categories
                            .map((category, index) =>
                            <div className="col-xs-12 col-sm-4 col-md-3" style={{ marginBottom: 10 }}>
                            <Card onTouchTap={
                                () => {
                                    const userId = this.state.user.id;
                                    const selected = this.state.selected;
                                    const categoryCode = category.code;
                                    const selectedPreference = selected
                                        .find(_ => _.value === categoryCode);
                                    const selectedIndex = selected
                                        .indexOf(selectedPreference);
                        
                                    if (selectedIndex === -1) {
                                        apiUserPreference
                                            .createItem(userId, {
                                                type: 'category',
                                                value: categoryCode
                                            })
                                            .then(_ => {
                                                selected.push(_);
                                                
                                                this.setState({
                                                    selected
                                                });

                                                getUserAsync(user => {
                                                    user
                                                    .userPreferences
                                                    .push(_);
                                                });
                                        });
                                    } else {
                                        apiUserPreference
                                            .deleteItem(userId, selectedPreference.id)
                                            .then(_ => {
                                                selected
                                                    .splice(selectedIndex, 1);

                                                this.setState({
                                                    selected
                                                });

                                                getUserAsync(user => {
                                                    const preference = user
                                                    .userPreferences
                                                    .find(_ => _.id === selectedPreference.id);

                                                    const indexToDelete = user
                                                    .userPreferences.indexOf(preference);

                                                    user.userPreferences
                                                    .splice(indexToDelete, 1);
                                                });
                                            }, _ => _);
                                    }
                                }
                            }>
                                <CardMedia>
                                    <div style={{
                                            position: 'absolute',
                                            bottom: 5,
                                            left: 10,
                                        }}
                                    >
                                        { this.isSelected(category.code) &&
                                            <CheckCircle
                                                color={'green'}
                                            />
                                        }
                                    </div>
                                    <img src={category.imageUrl || '/images/category-default-img.jpeg'} alt={category.label}/>
                                </CardMedia>
                        
                                <CardTitle
                                    children={
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <h4>
                                                    {category.label}
                                                </h4>
                                                <p className="text-muted">{category.desc}</p>
                                            </div>
                                        </div>
                                    }
                                />
                            </Card>
                        </div>
                        )}
                    </div>
                    <div className="row" style={{
                        marginTop: 15
                    }}>
                        <div className="col-xs-12">
                            <RaisedButton
                                style={{
                                    float: 'right'
                                }}
                                labelStyle={{color: 'white '}}
                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                label={translate("CONTINUE")}
                                disabled={false}
                                onTouchTap={() => {
                                    getUserAsync(user => {
                                        if (!user.userPreferences.length) {
                                            return alert("Select at least one preference");
                                        }

                                        return goTo('/');
                                    });
                                   
                                }}
                            />
                        </div>
                    </div>
            </div>
            }
        </div>
      );
    }
};
