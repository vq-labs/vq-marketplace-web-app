import React from 'react';
import Moment from 'react-moment';
import { sortDates } from '../core/util';

const momentFormat = "DD.MM.YYYY";

const displayTaskTiming = (taskTimings) => {
    let dates = taskTimings
      .map( _ => _.date);

    dates = sortDates(dates, -1);

    if (dates.length === 1) {
      return <div>
                <Moment format={momentFormat}>{dates[0]}</Moment>
             </div>;
    }

    return <div>
             <Moment format={momentFormat}>{dates[0]}</Moment> - <Moment format={momentFormat}>{dates[dates.length - 1]}</Moment>
            </div>;
  };

  export default displayTaskTiming;