import React from 'react';
import { translate } from '../core/i18n';
import Slider from 'material-ui/Slider';
import { getConfigAsync } from '../core/config';

export default class NewListingDuration extends React.Component {
    constructor(props) {
        super();

        this.state = {
            duration: props.duration || 2,
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
        if (nextProps.duration !== this.state.duration) {
            this.setState({
                duration: nextProps.duration
            });
        }
    } 

    handleDurationChange (duration) {
        this.setState({
            duration
        });
        this.props.onChange && this.props.onChange({
            duration
        });
    }

    render() {
        return <div className="row">
            { this.state.ready &&
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                            {translate("NEW_LISTING_DURATION_HEADER")}
                        </h1>
                        <p>{translate("NEW_LISTING_DURATION_DESC")}</p>
                    </div>
                </div>
                <hr />
                
                { this.state.priceType !== 2 &&
                    <div className="row">
                        <div className={"col-xs-12"}>
                            <h2 
                                style={{color: this.state.config.COLOR_PRIMARY}}
                                className="text-center">
                                {this.state.duration}h
                            </h2>
                            <Slider
                                min={1}
                                max={8}
                                step={1}
                                value={this.state.duration}
                                onChange={(ev, duration) => {
                                    this.props.handleDurationChange &&
                                    this.props.handleDurationChange(duration);
                                }}
                            />
                        </div>
                    </div>
                } 
            </div>
            }
        </div>
     }
};