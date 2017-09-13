import React, { Component } from 'react';
import Moment from 'react-moment';
import DOMPurify from 'dompurify'
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';
import { displayPrice } from '../core/format';

export default class NewListingReview extends Component {
    constructor(props) {
        super();

        this.state = {
            listing: props.listing,
            currency: props.currency
        };
    }

    componentDidMount() {
       getConfigAsync(config => this.setState({
           config,
           ready: true
       }))
    }
    
    render() {
     return <div className="row">
                {this.state.ready &&
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("NEW_LISTING_FINAL_REVIEW_HEADER")}</h1>
                            <p>{translate("NEW_LISTING_FINAL_REVIEW_DESC")}</p>
                        </div>
                    </div>

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("CATEGORY")}</h4>
                            {
                                this.state.listing.categories
                                .map(category =>
                                    <span>{category}</span>
                                )
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("LISTING_TITLE")}</h4>
                            {this.state.listing.title}
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("LISTING_DESCRIPTION")}</h4>
                            <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.listing.description)}}></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("LISTING_LOCATION")}</h4>
                            <div>{this.state.listing.location.street} {this.state.listing.location.streetNumber}, {this.state.listing.location.postalCode} {this.state.listing.location.city}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("LISTING_DATE")}</h4>
                            <div>
                                { this.state.listing.timing
                                    .map(timing =>
                                        <div className="row">
                                            { timing.date === timing.endDate &&
                                                <div className="col-xs-12">
                                                    <Moment format="DD.MM.YYYY">
                                                        {timing.date}
                                                    </Moment>
                                                </div>
                                            }
                                            { timing.date !== timing.endDate &&
                                                <div className="col-xs-12">
                                                    <Moment format="DD.MM.YYYY">
                                                        {timing.date}
                                                    </Moment>
                                                    -
                                                    <Moment format="DD.MM.YYYY">
                                                        {timing.endDate}
                                                    </Moment>
                                                </div>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("LISTING_DURATION")}</h4>
                            <div>
                                {this.state.listing.duration}h
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("PRICING")}</h4>
                            { this.state.listing.priceType === 1 ? translate("PRICING_MODEL_HOURLY") : this.state.listing.priceType === 0 ? translate("PRICING_MODEL_TOTAL") : translate("PRICING_MODEL_REQUEST_QUOTE") }
                        </div>
                    </div>

                    { this.state.listing.priceType !== 2 && 
                        <div className="row">
                            <div className="col-xs-12">
                                <h4 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("PRICE")}</h4>
                                {displayPrice(this.state.listing.price, this.state.currency, this.state.listing.priceType)}
                            </div>
                        </div>
                    }
                </div>
            </div>
            }
        </div>
    }
}
