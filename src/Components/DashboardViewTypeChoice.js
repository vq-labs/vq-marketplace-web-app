import React, { Component } from 'react';
import ViewTypeChoice from '../Components/ViewTypeChoice';

const DashboardViewTypeChoice = ({viewTypes, viewType, changeViewType}) => (
    <ViewTypeChoice
        halign="left"
        viewTypes={viewTypes}
        selected={viewType}
        changeViewType={changeViewType}
    />
)
    
export default DashboardViewTypeChoice;