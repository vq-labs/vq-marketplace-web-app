import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import * as apiCategory from '../api/category';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import { getConfigAsync } from '../core/config';


class StartPage extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    componentDidMount() {
        getConfigAsync(config => {
            apiCategory
                .getItems()
                .then(categories => {
                    this.setState({
                        config,
                        categories
                    });
                });
        });
    }
    render() {
        return (
        <div className="vq-homepage custom-xs-style">
            { this.state.config &&
                <div className="vq-intro text-center" style={{ 
                    background: `url(${this.state.config.PROMO_URL}) no-repeat center center fixed`,
                    backgroundSize: 'cover' 
                }}>
                        <div className="col-xs-12" style={{ marginTop: 120 }}>
                            <div style={{padding: 10, maxWidth: '850px', margin: '0 auto' }}>
                                <h1 style={{
                                    color: "white",
                                    fontSize: 35
                                }}>
                                    {translate('LISTINGS_PROMO_HEADER')}
                                </h1>
                                <h2 style={{ 
                                    color: "white",
                                    fontSize: 18
                                }}>
                                    {translate('LISTINGS_PROMO_DESC')}
                                </h2>
                            </div>

                            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                                <AutoComplete
                                    fullWidth={true}
                                    floatingLabelStyle={{color: 'white'}}
                                    textareaStyle={{color: 'white'}}
                                    floatingLabelText={translate('START_PAGE_AUTOCOMPLETE_LABEL')}
                                    filter={AutoComplete.noFilter}
                                    openOnFocus={true}
                                    dataSource={
                                        this.state.categories
                                        .map(_ => {
                                            return {
                                                text: _.code,
                                                value: (
                                                    <MenuItem
                                                        onClick={
                                                            () => goTo(`/new-listing?category=${_.code}`)
                                                        }
                                                        primaryText={_.label}
                                                    />
                                                )
                                            };
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default StartPage;
