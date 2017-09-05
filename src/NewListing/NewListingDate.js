import React, { Component } from 'react';
import InfiniteCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withMultipleDates,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';

const MultipleDatesCalendar = withMultipleDates(Calendar);

export default class NewListingDate extends Component {
    constructor(props) {
        super();

        const today = new Date((new Date()).setHours(0, 0, 0, 0));
        const minDate = new Date((new Date()).setHours(0, 0, 0, 0));
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

        this.state = {
            selected: props.selected ? props.selected.map(_ => String(_)) : [ String(today) ],
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
                                Component={MultipleDatesCalendar}
                                interpolateSelection={defaultMultipleDateInterpolation}
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
                                min={this.state.minDate}
                                max={this.state.maxDate}
                                selected={this.state.selected}
                                onSelect={date => {
                                    const selectedDates = this.state.selected;
                                    const dateIndex = selectedDates
                                        .map(_ => String(_))
                                        .indexOf(String(date));


                                    if (dateIndex === -1) {
                                        selectedDates.push(date);
                                    } else {
                                        selectedDates.splice(dateIndex, 1);
                                    }

                                    
                                    this.setState({
                                        selected: selectedDates.map(_ => String(_))
                                    });

                                    this.props.onSelect(selectedDates);
                                }}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    }
}
