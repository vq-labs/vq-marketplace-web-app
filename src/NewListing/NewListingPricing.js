import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import { displayPrice } from '../core/format';
import { getConfigAsync } from '../core/config';
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
            config: null,
            currency: props.currency || 'EUR',
            priceEntryType: PRICE_ENTRY_TYPES.SLIDER,
            price: props.price,
            priceType: props.priceType,
            minPrice: props.minPrice
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config,
                ready: true
            });
        })
    }

    componentWillReceiveProps (nextProps) {
        /**
        this.setState({
            price: nextProps.price,
            priceType: nextProps.priceType,
            minPrice: nextProps.minPrice,
            price: nextProps.minPrice * 2
        });
        */
    } 

    getCurrencySign() {
        const CURRENCY_SIGNS = {
            EUR: '€',
            USD: 'USD',
            PLN: 'PLN',
            HUF: 'Ft.'
        };
        
        return CURRENCY_SIGNS[this.state.currency] || 'Unknown';
    }

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
            { this.state.ready &&
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                            {translate("NEW_LISTING_PRICING_HEADER")}
                        </h1>
                        <p>{translate("NEW_LISTING_PRICING_DESC")}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-12">
                        { false && this.state.config &&
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
                            
                                { false && this.state.config.PRICING_CONTRACT === "1" &&
                                    <RadioButton
                                        value={PRICING_MODELS.TOTAL}
                                        label={translate("PRICING_MODEL_TOTAL")}
                                    />
                                }
                            
                                { false && this.state.config.PRICING_REQUEST === "1" &&
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
                                style={{ color: this.state.config.COLOR_PRIMARY }}
                                className="text-center"
                            >
                                {displayPrice(this.state.price, this.state.currency, this.state.priceType)}
                            </h2>
                            <Slider
                                min={this.state.minPrice}
                                max={10000}
                                step={500}
                                value={this.state.price}
                                onChange={(ev, price) => this.handlePriceChange(price)}
                            />
                        </div>
                    </div>
                } 
            </div>
            }
        </div>
     }
};