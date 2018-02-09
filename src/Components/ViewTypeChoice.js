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

    componentWillReceiveProps (nextProps) {
        if (nextProps.selected !== this.state.viewType || nextProps.viewTypes !== this.state.viewTypes) {
            this.changeViewType(nextProps.selected, nextProps.viewTypes);
        }
    }

    changeViewType(viewType, viewTypes) {
        this.setState({
            viewType,
            viewTypes
        });

        this.props.changeViewType &&
        this.props.changeViewType(viewType);
    }

    render() {
        return (
            <div className={`row pull-${this.props.halign}`}>
                { Object.keys(this.state.viewTypes)
                .map((viewType, index) =>
                    <div key={index} style={{ display: 'inline-block' }}>
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
