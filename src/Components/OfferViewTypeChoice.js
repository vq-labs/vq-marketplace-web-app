import React, { Component } from 'react';
import VIEW_TYPES from '../Components/VIEW_TYPES';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../core/i18n';

export default class OfferViewTypeChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewType: props.selected
        };
    }

    componentDidMount() {
        
    }

    changeViewType(viewType) {
        this.setState({
            viewType
        });

        this.props.onSelect(viewType);
    }

    render() {
        return (
            <div className="row pull-right">
                { this.state.viewType !== VIEW_TYPES.MAP &&
                    <FlatButton
                        onClick={() => this.changeViewType(VIEW_TYPES.MAP)}
                        label={translate('MAP')}
                        primary={true}
                    />
                }
                { this.state.viewType === VIEW_TYPES.MAP &&
                    <RaisedButton
                        label={translate('MAP')}
                        primary={true}
                    />
                }
                { this.state.viewType !== VIEW_TYPES.GRID &&
                    <FlatButton
                        onClick={() => this.changeViewType(VIEW_TYPES.GRID)}
                        label={translate('GRID')}
                        primary={true}
                    />
                }
                { this.state.viewType === VIEW_TYPES.GRID &&
                    <RaisedButton
                        label={translate('GRID')}
                        primary={true}
                    />
                }
                { this.state.viewType !== VIEW_TYPES.LIST &&
                    <FlatButton
                        onClick={() => this.changeViewType(VIEW_TYPES.LIST)}
                        label={translate('LIST')}
                        primary={true}
                    />
                }
                { this.state.viewType === VIEW_TYPES.LIST &&
                    <RaisedButton
                        label={translate('LIST')}
                        primary={true}
                    />
                }
            </div>
        )
    }
}
