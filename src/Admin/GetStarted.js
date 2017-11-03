import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import * as apiAdmin from '../api/admin';
import { getUserAsync } from '../core/auth';
import LabelEdit from '../Components/LabelEdit';
import ConfigEdit from '../Components/ConfigEdit';
import { goTo, convertToAppPath } from '../core/navigation';

import {
    Step,
    Stepper,
    StepLabel,
  } from 'material-ui/Stepper';

const sloganFields = [
    {
        type: 'string',
        key: 'START_PAGE_HEADER',
        label: 'Slogan',
        explanation: 'Use the slogan to quickly tell visitors what your marketplace is about. "Buy food from locals" or "Get guitar lessons from a pro" are good examples.'
    },
    {
        type: 'string',
        key: 'START_PAGE_DESC',
        label: 'Description',
        explanation: 'Use the description to share your main value proposition. "FoodMarket is the easiest way to order produce directly from local providers" or "GuitarPro is the best place to compare music teachers" are good examples.'
    }
];

const coverPhotoFields = [
    {
        type: 'single-image',
        key: 'LOGO_URL',
        label: 'Marketplace logo (284px x 100px)',
        imageResolution: [ 100 * 2.84, 100 ]
    },
    {
        type: 'single-image',
        key: 'PROMO_URL',
        label: 'Marketplace promo for buyers/clients (1280px x 850px are supported)',
        imageResolution: [ 1280, 850 ]
    },
    {
        type: 'single-image',
        key: 'PROMO_URL_SELLERS',
        label: 'Marketplace promo for sellers/taskers (1280x850px are supported)',
        imageResolution: [ 1280, 850 ]
    }
];

export default class SectionOverview extends React.Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            user: null
        };
    }
    componentDidMount() {
        getUserAsync(user => {
            this.setState({user });
        });
    }

    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Welcome to your marketplace, {this.state.user && this.state.user.firstName}</h1>
                        <p>
                            To get your marketplace up and running, there are a few essential steps you need to take, as listed below.

                            Once finished, your marketplace will be ready to receive its first visitors!
                        </p>
                    </div>
                    <hr />
                    <div className="col-xs-12">
                        <Stepper activeStep={this.state.activeStep}>
                            <Step>
                                <StepLabel>Add a slogan & description</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Upload a cover photo</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Describe how it works</StepLabel>
                            </Step>
                        </Stepper>
                    </div>

                    { this.state.activeStep === 0 &&
                        <div className="col-xs-12">
                            <img src="/images/get-started-slogans.jpg" className="img-responsive" />
                            
                            <p style={{ marginTop: 30 }}>
                                The slogan and description help new visitors understand what your marketplace is about. They are the first thing visitors notice when they land on your site, so try to make them compact but descriptive.
                            </p>
                        
                            <RaisedButton onTouchTap={() => {
                                goTo('/admin/basics');
                                location.reload();
                            }} primary={true} label="Add Slogans and Descriptions"/>
                        </div>
                    }

                    { this.state.activeStep === 1 &&
                        <div className="col-xs-12">
                            TODO
                        </div>
                    }

                    { this.state.activeStep === 1 &&
                        <div className="col-xs-12">
                            TODO
                        </div>
                    }
                </div>
            );
    }
};
