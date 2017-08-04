import React, { Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';

export default class NewListingDate extends Component {
    constructor(props) {
        super();

        const today = new Date();
        const minDate = new Date();
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

        this.state = {
            selected: props.selected || today,
            today,
            minDate,
            maxDate
        };
    }
    
    componentDidMount() {
       getConfigAsync(config => this.setState({
           config,
           ready: true
       }))
    }
    
    render() {
     return <div className="row">
            { this.state.ready &&
             <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>{translate('NEW_LISTING_DATE_HEADER')}</h1>
                        <p>{translate('NEW_LISTING_DATE_DESC')}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-12">
                        <InfiniteCalendar
                                theme={{
                                    accentColor: '#448AFF',
                                    floatingNav: {
                                        background: this.state.config.COLOR_PRIMARY,
                                        chevron: '#FFA726',
                                        color: '#FFF',
                                    },
                                    headerColor: '#448AFF',
                                    selectionColor: this.state.config.COLOR_PRIMARY,
                                    textColor: {
                                        active: '#FFF',
                                        default: '#333',
                                    },
                                    todayColor: '#FFA726',
                                    weekdayColor: '#559FFF',
                                }}
                                height={350}
                                width={'100%'}
                                displayOptions={{
                                    showHeader: false
                                }}
                                style={{width: '100%'}}
                                minDate={this.state.minDate}
                                maxDate={this.state.maxDate}
                                selected={this.state.selected}
                                onSelect={date => {
                                    this.setState({ selected: date });

                                    this.props.onSelect(date);
                                }}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    }
}
