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
                                   Define the supply and demand side
                                </StepButton>

                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            In online marketplaces, there are two sides (supply & demand) who interact with one another. While on some Marketplace platforms a user can both act as the supply and demand, other marketplaces prefer to limit the user's role into one. The decision depends on the business model and use-case of the Marketplace.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            VQ Marketplace allows you to configure it. Read more about the <a target="_blank" href="https://vqlabs.freshdesk.com/solution/articles/33000212957-demand-supply-model" >Demand and Supply Model</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/user-types?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Configure Demand and Supply"
                                        />
                                    </div>
                                </ StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 1})}>
                                   Add a slogan & description
                                </StepButton>

                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            The slogan and description help new visitors understand what your marketplace is about. They are the first thing visitors notice when they land on your site, so try to make them compact but descriptive.
                                        </p>

                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/basics?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Add Slogans and Descriptions"
                                        />
                                    </div>
                                </ StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 2})}>
                                    Add Listing Categories
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p>
                                            Marketplaces have categories for different types of listings. You can define and manage these categories from the Admin panel.

                                            When users add new listings, they have to choose what category it belongs to.

                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000166407-creating-new-listing-categories" target="_blank">Listing categories</a>.
                                        </p>
                                            
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/categories?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Add Listing Categories"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({ stepIndex: 3 })}>
                                    Upload a cover photo
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p>
                                            You can add a cover photo by going to the Design Tab of the admin panel. The cover photo is shown in the homepage for non-logged-in users. Image size should be <b>1280px x 850px</b> pixels.
                                        </p>
                                        <p>
                                            If you use a photo with any other size, it will be resized automatically and taller images will be cut in the middle (top and bottom will be cropped).
                                            
                                            To enjoy the best results, you should use the recommended size.
                                        </p>
                                        <p>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000166407-creating-new-listing-categories" target="_blank">Cover photos</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/design?fromSection=get-started');

                                                location.reload();
                                            }}
                                            label="Define colors and upload cover photos"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            {
                                //02032018, Sercan: disabled at the request of Ani, VM-152 
                            }
                            {/* <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 4})}>
                                    Describe how it works
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/labels?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Define custom labels"
                                        />
                                    </div>
                                </StepContent>
                            </Step> */}
                            <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 4})}>
                                    Edit the content of your landing page
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/landing-page?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Go to landing page"
                                        />
                                    </div>
                                </StepContent>
                            </Step>

                            <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 5})}>
                                    Edit all the labels such as popup and button texts, titles, descriptions or translate them to other languages if you specified a Supported Language in the Basics
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/labels?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Go to labels page"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 6})}>
                                    Connect your social media channels
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000212962-configure-seo-and-social-media-channels" target="_blank">Social Media</a> configuration.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/seo?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Setup your Social Media channels"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 7})}>
                                    Setup Analytics
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">                                   
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/analytics?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Connect Google Analytics"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 8})}>
                                    Setup payments
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p>
                                            VQ Marketplace's Stripe-powered payment system helps your buyers (Demand side) purchase goods and services from your providers (Supply side). The buyers can pay with either their credit or debit card. As the administrator of the marketplace, you can easily charge a fee for each transaction.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/payments?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Setup payments"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            {
                                //@todo
                                //02032018, Sercan: disabled because there is no such feature yet
                            }
                            {/* <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 9})}>
                                    Invite your users
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <RaisedButton
                                            disabled={true}
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/analytics?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Invite your users (coming soon)"
                                        />
                                    </div>
                                </StepContent>
                            </Step> */}
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
