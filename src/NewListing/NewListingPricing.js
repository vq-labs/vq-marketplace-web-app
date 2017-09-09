import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import { displayPrice } from '../core/format';
import { getConfigAsync } from '../core/config';
import { translate } from '../core/i18n';

const PRICING_MODELS = {
    TOTAL: 0,
    HOURLY: 1,
    REQUEST_QUOTE: 2
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
            price: props.price || 0,
            priceType: props.priceType || 1,
            minPrice: props.minPrice || 0,
            pricingConfig: props.pricingConfig || {
                hourly: true,
                request: false,
                contract: false
            }
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
        if (nextProps.minPrice !== this.state.minPrice)
            this.setState({
                minPrice: nextProps.minPrice,
                price: nextProps.minPrice * 2
            });
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

    setPrice (price) {
        price = Number(price);

        this.setState({
            price
        });

        this.props.onPricingChange({
            price, 
            priceType: this.state.priceType
        });
    }

    handlePriceChange (price, priceType) {
        this.setState({ price, priceType });
        this.props.onPricingChange && this.props.onPricingChange({
            price,
            priceType 
        });
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
                        <RadioButtonGroup
                            name="priceTypeButtons" 
                            onChange={(ev, priceType) => {
                                this.handlePriceChange(this.state.price, priceType);
                            }} 
                            ref="priceType"
                            style={{width: '100%'}}
                            inputStyle={{width: '100%'}}
                            defaultSelected={this.state.priceType}
                        >
                                <RadioButton
                                    className={!this.state.pricingConfig.hourly && 'hidden'}
                                    value={PRICING_MODELS.HOURLY}
                                    label={translate("PRICING_MODEL_HOURLY")}
                                />
                           
                                <RadioButton
                                    className={!this.state.pricingConfig.contract && 'hidden'}
                                    value={PRICING_MODELS.TOTAL}
                                    label={translate("PRICING_MODEL_TOTAL")}
                                />
                            
                                <RadioButton
                                    className={!this.state.pricingConfig.request && 'hidden'}
                                    value={PRICING_MODELS.REQUEST_QUOTE}
                                    label={translate("PRICING_MODEL_REQUEST_QUOTE")}
                                />
                        </RadioButtonGroup>
                    </div>
                </div>
                { this.state.priceType !== 2 &&
                    <div className="row">
                        <div className={"col-xs-12"}>
                            <h2 
                                style={{color: this.state.config.COLOR_PRIMARY}}
                                className="text-center"
                            >
                                {displayPrice(this.state.price, this.state.currency, this.state.priceType)}
                            </h2>
                            <Slider
                                min={this.state.minPrice}
                                max={10000}
                                step={500}
                                value={this.state.price}
                                onChange={(ev, price) => {
                                    this.handlePriceChange(price, this.state.priceType);
                                }}
                            />
                        </div>
                        { this.state.priceEntryType === PRICE_ENTRY_TYPES.TEXT_BOX &&
                        <div className="col-xs-12">
                            <TextField
                                type="number"
                                step={500}
                                min={this.state.minPrice}
                                max={this.state.minPrice * 10}
                                onChange={(ev, price) => {
                                    this.handlePriceChange(price, this.state.priceType);
                                }}
                                value={this.state.price}
                                style={{width: '100%'}}
                                inputStyle={{width: '100%'}}
                                floatingLabelText={`${translate("PRICE")} (${this.getCurrencySign()})`}
                            />
                        </div>
                        }
                    </div>
                } 
                {   this.state.priceType !== undefined &&
                    this.state.priceType !== 2 && this.state.quickChoice &&
                    <div className="row">
                        <div className="col-xs-12">
                            <em>{translate("QUICK_CHOICE")}:</em>
                            { this.state.priceType===1 &&
                                <div>
                                    <FlatButton label="10€" onClick={() => this.setPrice(10)}/>
                                    <FlatButton label="20€" onClick={() => this.setPrice(20)} />
                                    <FlatButton label="30€" onClick={() => this.setPrice(30)} />
                                    <FlatButton label="40€" onClick={() => this.setPrice(40)} />
                                </div>
                            }
                            { this.state.priceType === 0 &&
                                <div>
                                    <FlatButton label="20€" onClick={() => this.setPrice(20)} />
                                    <FlatButton label="50€" onClick={() => this.setPrice(50)} />
                                    <FlatButton label="100€" onClick={() => this.setPrice(100)} />
                                    <FlatButton label="500€" onClick={() => this.setPrice(500)} />
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
            }
        </div>
     }
};