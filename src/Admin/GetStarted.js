import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { getUserAsync } from '../core/auth';
import { goTo } from '../core/navigation';

import {
    Step,
    Stepper,
    StepContent,
    StepButton
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
                        <Stepper linear={false} activeStep={this.state.stepIndex} orientation="vertical">
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 0})}>
                                   Add a slogan & description
                                </StepButton>

                                <StepContent>
                                    <div className="col-xs-12">
                                        <img alt={'Configure the slogan and description of the VQ-Marketplace'} src="/images/get-started-slogans.jpg" className="img-responsive" />
                                        
                                        <p style={{ marginTop: 30 }}>
                                            The slogan and description help new visitors understand what your marketplace is about. They are the first thing visitors notice when they land on your site, so try to make them compact but descriptive.
                                        </p>
                                    
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/basics');
                                                location.reload();
                                            }}
                                            label="Add Slogans and Descriptions"
                                        />
                                    </div>
                                </ StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                                    Upload a cover photo
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/design');
                                                location.reload();
                                            }}
                                            label="Define colors and upload cover photos"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 2})}>
                                    Describe how it works
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/labels');
                                                location.reload();
                                            }}
                                            label="Define custom labels"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 3})}>
                                    Add Listing Categories
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/categories');
                                                
                                                location.reload();
                                            }}
                                            label="Add Listing Categories"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 4})}>
                                    Connect your social media channels
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/seo');
                                                
                                                location.reload();
                                            }}
                                            label="Setup your Social Media channels"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 5})}>
                                    Setup Analytics
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/analytics');
                                                
                                                location.reload();
                                            }}
                                            label="Connect Google Analytics"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 6})}>
                                    Connect to Stripe and setup payments
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            disabled={true}
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/analytics');
                                                
                                                location.reload();
                                            }}
                                            label="Connect Stripe (disabled)"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 7})}>
                                    Invite your users
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            disabled={true}
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/analytics');
                                                
                                                location.reload();
                                            }}
                                            label="Invite your users (coming soon)"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                        </Stepper>
                    </div>

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
