import React from 'react';
import Moment from 'react-moment';
import { sortDates } from '../core/util';

const momentFormat = "DD.MM.YYYY";

const displayTaskTiming = (taskTimings) => {
    let dates = taskTimings;
    //  .map( _ => _.date);

    // dates = sortDates(dates, -1);
    if (dates.length === 1) {
      const timing = dates[0];
      let utcTiming = {};

      if (typeof timing.date === 'number') {
        let startDate = new Date(timing.date * 1000);
        let endDate = timing.endDate ? new Date(timing.endDate * 1000 ) : startDate;
        
        utcTiming.date = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(),  startDate.getUTCHours(), startDate.getUTCMinutes(), startDate.getUTCSeconds());
        utcTiming.endDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(),  endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds());
      } else {
        utcTiming.date = timing.date;
        utcTiming.endDate = timing.endDate || timing.date;
      }

      if (utcTiming.date.getDate() === utcTiming.endDate.getDate()) {
        return <div>
          <Moment format={momentFormat}>{utcTiming.date}</Moment>
        </div>;
      }

      return <div>
                <Moment format={momentFormat}>{utcTiming.date}</Moment> - <Moment format={momentFormat}>{utcTiming.endDate}</Moment>
             </div>;
    }

    return <div>
             <Moment format={momentFormat}>{dates[0]}</Moment> - <Moment format={momentFormat}>{dates[dates.length - 1]}</Moment>
            </div>;
  };

  export default displayTaskTiming;