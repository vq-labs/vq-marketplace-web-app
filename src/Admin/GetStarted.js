import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { getUserAsync } from '../core/auth';
import { goTo } from '../core/navigation';

import {
    Step,
    Stepper,
    StepLabel,
  } from 'material-ui/Stepper';

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
                            <img alt={'Configure the slogan and description of the VQ-Marketplace'} src="/images/get-started-slogans.jpg" className="img-responsive" />
                            
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
