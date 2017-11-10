import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';

export default class ViewTypeChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewTypes: props.viewTypes,
            viewType: props.selected
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                ready: true,
                config
            });
        })
    }

    changeViewType(viewType) {
        this.setState({
            viewType
        });

        this.props.changeViewType &&
        this.props.changeViewType(viewType);
    }

    render() {
        return (
            <div className={`row pull-${this.props.halign}`}>
                { this.state.ready && Object.keys(this.state.viewTypes)
                .map(viewType => 
                    <div style={{ display: 'inline-block' }}>
                        { this.state.viewType !== this.state.viewTypes[viewType] &&
                            <FlatButton
                                primary={true}
                                onClick={() => this.changeViewType(this.state.viewTypes[viewType])}
                                label={translate(viewType)}
                            />
                        }
                        { this.state.viewType === this.state.viewTypes[viewType] &&
                            <RaisedButton
                                primary={true}
                                label={translate(viewType)}
                            />
                        }
                    </div>
                )}
            </div>
        )
    }
}
