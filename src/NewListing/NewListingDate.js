import React, { Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import { translate } from '../core/i18n';

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
       
    }
    
    render() {
     return <div className="row">
                <div className="col-xs-12">
                    <h1>{translate('NEW_LISTING_DATE_HEADER')}</h1>
                    <p>{translate('NEW_LISTING_DATE_DESC')}</p>
                </div>
                <hr />
                <div className="col-xs-12">
                    <InfiniteCalendar
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
    }
}
