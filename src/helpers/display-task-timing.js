import React from 'react';
import Moment from 'react-moment';

const momentFormat = "DD.MM.YYYY";
const displayDate = date => <Moment format={momentFormat}>{date}</Moment>;

const displayTaskTiming = (taskTimings) => {
    const dates = taskTimings
      .map( _ => _.date);

    if (dates.length === 1) {
      return <div>
                <Moment format={momentFormat}>{dates[0]}</Moment>
             </div>;
    }

    return <div>
             <Moment format={momentFormat}>{dates[0]}</Moment> - <Moment format={momentFormat}>{dates[1]}</Moment>
           </div>;
  };

  export default displayTaskTiming;