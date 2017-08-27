import React from 'react';

const displayLocation = taskLocations => {
    const taskLocation = taskLocations[0];

    if (!taskLocation) {
        return 'Online';
    }


    return <div>{taskLocation.street}, {taskLocation.city}</div>;
};

export default displayLocation;