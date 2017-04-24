import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../core/i18n';

const PRICING_MODELS = {
    TOTAL: 0,
    HOURLY: 1,
    REQUEST_QUOTE: 2
};

export default class NewListingPricing extends React.Component {
    constructor(props) {
        super();

        this.state = {
            price: props.price,
            priceType: props.priceType
        };

        this.handlePriceTypeChange = this.handlePriceTypeChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
    }
    componentDidMount() {
        /* */
    }

    setPrice (price) {
      price = Number(price);

      this.setState({ price });

      this.props.onPricingChange({
        price, 
        priceType: this.state.priceType, 
      });
    }

    handlePriceTypeChange (event) {
        const priceType = Number(event.target.value);

        this.setState({ priceType });

        this.props.onPricingChange({
            price: this.state.price, 
            priceType
        });
    }

    handlePriceChange (event) {
        const price = Number(event.target.value);

        this.setState({ price });

        this.props.onPricingChange({
            price, 
            priceType: this.state.priceType 
        });
    }

    render() {
        return <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>{translate("STEP")} 2. {translate("DETERMINE_PRICING_MODEL")}</h1>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-12">
                        <RadioButtonGroup 
                            name="priceTypeButtons" 
                            onChange={this.handlePriceTypeChange} 
                            ref="priceType"
                            style={{width: '100%'}}
                            inputStyle={{width: '100%'}}
                            defaultSelected={this.state.priceType}>
                                    <RadioButton
                                        value={PRICING_MODELS.HOURLY}
                                        label={
                                            translate("PRICING_MODEL_HOURLY")
                                        }
                                    />
                                    <RadioButton
                                        value={PRICING_MODELS.TOTAL}
                                        label={
                                            translate("PRICING_MODEL_TOTAL")
                                        }
                                    />
                                    <RadioButton
                                        value={PRICING_MODELS.REQUEST_QUOTE}
                                        label={
                                            translate("PRICING_MODEL_REQUEST_QUOTE")
                                        }
                                    />
                        </RadioButtonGroup>
                    </div>
                </div>
                { this.state.priceType !== 2 &&
                    <div className="row">
                        <div className="col-xs-12">
                            <TextField
                                onChange={this.handlePriceChange}
                                value={this.state.price}
                                style={{width: '100%'}}
                                inputStyle={{width: '100%'}}
                                floatingLabelText={translate("PRICE")}
                            />
                        </div>
                    </div>
                } 
                {   this.state.priceType !== undefined &&
                    this.state.priceType !== 2 &&
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
};