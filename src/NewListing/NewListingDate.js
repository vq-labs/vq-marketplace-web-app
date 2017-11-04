import React, { Component } from 'react';
import InfiniteCalendar, {
  Calendar,
  withRange
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import { translate } from '../core/i18n';
import { getConfigAsync } from '../core/config';

const WithRangeCalendar = withRange(Calendar);

export default class NewListingDate extends Component {
    constructor(props) {
        super();

        const today = new Date((new Date()).setHours(0, 0, 0, 0));
        const minDate = new Date((new Date()).setHours(0, 0, 0, 0));
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
        
        const startDate = props.selected ?
            props.selected[0] ? props.selected[0].date : today ||
            today : today;

        const endDate = props.selected ?
            props.selected[0] ? props.selected[0].endDate || props.selected[0].date :
            today : today;
        
        this.state = {
            selected: {
                start: startDate,
                end: endDate
            },
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
                                Component={WithRangeCalendar}
                                // interpolateSelection={defaultMultipleDateInterpolation}
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
                                onSelect={selectedEvent => {
                                    /**
                                     * 1: on selected start date
                                     * 2: on hover end date
                                     * 3: on selected start&end date
                                     */
                                    if (selectedEvent.eventType !== 3) {
                                        return;
                                    }

                                    /**
                                    const selectedDates = this.state.selected;
                                    const dateIndex = selectedDates
                                        .map(_ => String(_))
                                        .indexOf(String(date));

                                    if (dateIndex === -1) {
                                        selectedDates.push(date);
                                    } else {
                                        selectedDates.splice(dateIndex, 1);
                                    }
                                    */


                     
                                    const localStart = selectedEvent.start;
                                    const localEnd = selectedEvent.end;
                                    
                                    const selectedDate = {
                                        start: localStart,
                                        end: localEnd
                                    };
                                    

                                    this.setState({
                                        selectedDate
                                    });

                                    if (this.props.onSelect) {
                                        this.props.onSelect([{
                                            date: selectedDate.start,
                                            endDate: selectedDate.end
                                        }]);
                                    }
                                }}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    }
}
