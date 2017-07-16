import React, { Component } from 'react';
import Moment from 'react-moment';
import DOMPurify from 'dompurify'
import { translate } from '../core/i18n';

export default class NewListingReview extends Component {
    constructor(props) {
        super();

        this.state = {
            listing: props.listing,
            currency: props.currency
        };
    }

    componentDidMount() {
       
    }
    
    render() {
     return <div className="row"> 
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>{translate("NEW_LISTING_FINAL_REVIEW_HEADER")}</h1>
                            <p>{translate("NEW_LISTING_FINAL_REVIEW_DESC")}</p>
                        </div>
                    </div>
                

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("CATEGORY")}</h4>
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
                            <h4>{translate("TITLE")}</h4>
                            {this.state.listing.title}
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("DESCRIPTION")}</h4>
                            <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.listing.description)}}></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("LOCATION")}</h4>
                            <div>{this.state.listing.location.street} {this.state.listing.location.streetNumber}, {this.state.listing.location.postalCode} {this.state.listing.location.city}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("LISTING_DATE")}</h4>
                            <div>
                                <Moment format="DD.MM.YYYY">{this.state.listing.timing[0]}</Moment>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("PRICING")}</h4>
                            { this.state.listing.priceType === 1 ? translate("PRICING_MODEL_HOURLY") : this.state.listing.priceType === 0 ? translate("PRICING_MODEL_TOTAL") : translate("PRICING_MODEL_REQUEST_QUOTE") }
                        </div>
                    </div>

                    { this.state.listing.priceType !== 2 && 
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>{translate("PRICE")}</h4>
                                {this.state.listing.price + this.state.currency }
                            </div>
                        </div>
                    }
                </div>
              </div>
            </div>
    }
}
