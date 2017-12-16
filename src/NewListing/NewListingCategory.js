import React from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import Loader from "../Components/Loader";
import * as apiCategory from '../api/category';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';

const _chunk = require('lodash.chunk');

export default class NewListingCategory extends React.Component {
    constructor(props) {
        super();

        this.state = {
            categories: [],
            isLoading: true
        };
    }
    componentDidMount() {
        getConfigAsync(config => {
            apiCategory
                .getItems()
                .then(categories => {
                    this.setState({
                        isLoading: false,
                        ready: true,
                        config,
                        categories: _chunk(categories, 3) 
                    });
                });
        });
    }
    onCategoryChosen (tile) {
        this.props.onSelected && this.props.onSelected(tile.code);
    }
    render() {
        return <div className="container">
                    { this.state.ready &&
                        <div className="row">
                            <div className="col-xs-12">
                                <h1 style={{color: this.state.config.COLOR_PRIMARY}} className="text-left">
                                    {this.props.listingType === 1 ? translate("NEW_LISTING_CATEGORY_HEADER") : translate("NEW_SUPPLY_LISTING_CATEGORY_HEADER") }
                                </h1>
                                <p>{this.props.listingType === 1 ? translate("NEW_LISTING_CATEGORY_DESC") : translate("NEW_SUPPLY_LISTING_CATEGORY_DESC") }</p>
                            </div>
                        </div>
                    }
                    <hr />

                    { this.state.isLoading &&
                        <Loader isLoading={true}/>
                    }
                    
                    <div className="row">
                        <div className="col-xs-12">
                            { this.state.categories && this.state.categories
                                .map((row, rowIndex) => (
                                    <div key={rowIndex} className="row">
                                        { row.map(tile =>
                                            <div
                                                key={tile.code}
                                                className="col-xs-12 col-sm-4"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Card
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={
                                                        () => this.onCategoryChosen(tile)
                                                    }>
                                                    <CardMedia
                                                        overlay={
                                                            <CardTitle title={tile.label || translate(tile.code)} />
                                                        }
                                                    >
                                                        <img alt="category" src={tile.imageUrl || '/images/category-default-img.jpeg'} />
                                                    </CardMedia>
                                                </Card>
                                            </div>
                                        )} 
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
    }
};