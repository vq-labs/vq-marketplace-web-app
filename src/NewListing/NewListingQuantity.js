import React from 'react';
import Slider from 'material-ui/Slider';
import { CONFIG } from '../core/config';
import { translate } from '../core/i18n';

export default class NewListingQuantity extends React.Component {
    constructor(props) {
        super();

        this.state = {
            listingType: props.listingType,
            quantity: props.quantity || 0 ,
            unitOfMeasure: props.unitOfMeasure,
            minQuantity: props.minQuantity,
            maxQuantity: props.maxQuantity,
            quantityStep: props.quantityStep
        };
    }

    onQuantityChange = quantity => {
        if (quantity) {
            this.setState({
                quantity
            });
        }

        if (this.props.onQuantityChange) {
            this.props.onQuantityChange(quantity || this.state.quantity);
        }
    }

    getSlider = (state) => {
        return <Slider
            min={state.minQuantity}
            max={state.maxQuantity}
            step={state.quantityStep}
            value={state.quantity}
            onChange={(ev, quantity) => this.onQuantityChange(quantity)}
        />
    }

    render() {
        const state = this.state;
        debugger;
        return <div className="row">
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <h1 style={{color: CONFIG.COLOR_PRIMARY}}>
                            {
                                this.state.listingType === 1 ?
                                translate("NEW_DEMAND_LISTING_QUANTITY_HEADER") :
                                translate("NEW_SUPPLY_LISTING_QUANTITY_HEADER")
                            }
                        </h1>
                        <p>
                            {
                                this.state.listingType === 1 ?
                                translate("NEW_DEMAND_LISTING_QUANTITY_DESC") :
                                translate("NEW_SUPPLY_LISTING_QUANTITY_DESC")
                            }
                        </p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className={"col-xs-12"}>
                        <h2 
                            style={{ color: CONFIG.COLOR_PRIMARY }}
                            className="text-center"
                        >
                            {`${state.quantity} ${state.unitOfMeasure}`}
                        </h2>
                        {this.getSlider(state)}
                    </div>
                </div>
            </div>
        </div>
     }
};