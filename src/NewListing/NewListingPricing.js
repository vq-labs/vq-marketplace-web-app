import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import { displayPrice } from '../core/format';
import { CONFIG } from '../core/config';
import { translate } from '../core/i18n';

const PRICING_MODELS = {
    HOURLY: 1,
    REQUEST_QUOTE: 2,
    TOTAL: 3
};

const PRICE_ENTRY_TYPES = {
    TEXT_BOX: 1,
    SLIDER: 2
};

export default class NewListingPricing extends React.Component {
    constructor(props) {
        super();

        this.state = {
            currency: props.currency || 'EUR',
            priceEntryType: PRICE_ENTRY_TYPES.SLIDER,
            price: props.price,
            priceType: props.priceType,
            minPrice: props.minPrice
        };
    }

    componentDidMount() { }

    componentWillReceiveProps (nextProps) {console.log('nextprops', nextProps)}

    handlePriceChange (price, priceType) {
        if (price) {
            this.setState({
                price
            });
        }

        if (priceType) {
            this.setState({
                priceType
            });
        }

        if (this.props.onPricingChange) {
            this.props.onPricingChange({
                price: price || this.state.price,
                priceType: priceType || this.state.priceType 
            });
        }
    }

    render() {
        return <div className="row">
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <h1 style={{color: CONFIG.COLOR_PRIMARY}}>
                            {this.props.listingType === 1 ? translate("NEW_LISTING_PRICING_HEADER") : translate("NEW_SUPPLY_LISTING_PRICING_HEADER")}
                        </h1>
                        <p>{this.props.listingType === 1 ? translate("NEW_LISTING_PRICING_DESC") : translate("NEW_SUPPLY_LISTING_PRICING_DESC")}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-12">
                        { false &&
                            <RadioButtonGroup
                                checked={this.state.priceType}
                                value={this.state.priceType}
                                name="priceTypeButtons" 
                                onChange={(_, priceType) => this.handlePriceChange(null, priceType)} 
                                style={{width: '100%'}}
                                inputStyle={{width: '100%'}}
                            >       
                                    <RadioButton
                                        value={PRICING_MODELS.HOURLY}
                                        label={translate("PRICING_MODEL_HOURLY")}
                                    />
                            
                                { false && CONFIG.PRICING_CONTRACT === "1" &&
                                    <RadioButton
                                        value={PRICING_MODELS.TOTAL}
                                        label={translate("PRICING_MODEL_TOTAL")}
                                    />
                                }
                            
                                { false && CONFIG.PRICING_REQUEST === "1" &&
                                    <RadioButton
                                        value={PRICING_MODELS.REQUEST_QUOTE}
                                        label={translate("PRICING_MODEL_REQUEST_QUOTE")}
                                    />
                                }
                            </RadioButtonGroup>
                        }
                    </div>
                </div>
                { this.state.priceType !== 2 &&
                    <div className="row">
                        <div className={"col-xs-12"}>
                            <h2 
                                style={{ color: CONFIG.COLOR_PRIMARY }}
                                className="text-center"
                            >
                                {displayPrice(this.state.price, this.state.currency, this.state.priceType)}
                            </h2>
                            <Slider
                                min={this.state.minPrice}
                                max={Number(CONFIG.LISTING_PRICE_FILTER_MAX)}
                                step={Number(CONFIG.LISTING_PRICE_FILTER_STEP)}
                                value={this.state.price}
                                onChange={(ev, price) => this.handlePriceChange(price)}
                            />
                        </div>
                    </div>
                } 
            </div>
        </div>
     }
};