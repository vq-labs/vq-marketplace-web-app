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
                                        In online marketplaces, there are two sides (supply & demand) who interact with one another. While in one type of marketplace demand side posts listings and supply side sends a request (Taskrabbit) then the demand side books; in other type, it is the supply side who posts a listing and demand side books the listing (Airbnb).  The decision depends on the business model and use-case of the Marketplace.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            VQ Marketplace allows you to configure it. Read more about the <a target="_blank" href="https://vqlabs.freshdesk.com/solution/articles/33000212957-demand-supply-model" >Demand and Supply Model</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/listing?fromSection=get-started');
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
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                        Read more about <a target="_blank" href="https://vqlabs.freshdesk.com/solution/articles/33000166407-creating-new-listing-categories" >listing categories</a>.
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
                                        <p style={{ marginTop: 30 }}>
                                            You can add a cover photo by going to the Design Tab of the admin panel. The cover photo is shown in the homepage for all users that visit the landing page. Recommended size for the photo is <b>1280x850</b> pixels.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            If you use a photo with any other size, it will be resized automatically meaning that images that are tall will have some of their top and bottom sides cropped.
                                            
                                            To enjoy the best results, you should use the recommended size.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000212959-configure-the-cover-photos-and-logo" target="_blank">Cover photos</a>.
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
                            <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 4})}>
                                    User configuration
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            In online marketplaces, there are two sides (supply & demand) who interact with one another. While on some marketplaces a user can be both the supply and demand at the same time, for other marketplace platforms it might be preferred to limit the user's role into one. The decision depends on the business model and use-case of the Marketplace.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000212957-demand-supply-model" target="_blank">user configuration</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/user?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Define user settings"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 5})}>
                                    Edit the content of your landing page
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            There are two landing pages which are determined according to the user type - supply and demand. As an admin, you can edit the content of both pages. This step requires knowledge of HTML. 
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000212407-using-custom-html-javascript-and-css-on-your-landing-page" target="_blank">the landing page</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/landing-page?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Go to landing page settings"
                                        />
                                    </div>
                                </StepContent>
                            </Step>

                            <Step>
                                 <StepButton onClick={() => this.setState({stepIndex: 6})}>
                                    Configure all labels in the marketplace
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            Configure all the labels such as titles, descriptions, button texts, pop ups that you have on your marketplace. Additionally, you can configure labels in any additional language that you set up for your marketplace. 
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000166408-configure-all-the-labels-of-your-marketplace" target="_blank">the configuration</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/labels?fromSection=get-started');
                                                location.reload();
                                            }}
                                            label="Go to labels"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 7})}>
                                    Configure privacy policy, terms of service, email content and create custom pages
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                        Add/edit the content of privacy policy, terms of service and emails. Add custom pages to your site with HTML.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000166409-editing-privacy-policy-terms-of-service-and-imprint" target="_blank">the configuration</a>.
                                        </p>                             
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/posts?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Go to content"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 8})}>
                                    Connect your social media channels and google analytics
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000212962-configure-seo-and-social-media-channels" target="_blank">social media, SEO configuration andsetting up Google analytics</a>.
                                        </p>
                                        <RaisedButton
                                            primary={true}
                                            onTouchTap={() => {
                                                goTo('/admin/seo?fromSection=get-started');
                                                
                                                location.reload();
                                            }}
                                            label="Go to SEO"
                                        />
                                    </div>
                                </StepContent>
                            </Step>
                            <Step>
                                <StepButton onClick={() => this.setState({stepIndex: 9})}>
                                    Setup payments
                                </StepButton>
                                <StepContent>
                                    <div className="col-xs-12">
                                        <p style={{ marginTop: 30 }}>
                                            VQ Marketplace's Stripe-powered payment system helps your buyers (Demand side) purchase goods and services from your providers (Supply side). The buyers can pay with either their credit or debit card. As the administrator of the marketplace, you can easily charge a fee for each transaction.
                                        </p>
                                        <p style={{ marginTop: 30 }}>
                                            Read more about <a href="https://vqlabs.freshdesk.com/solution/articles/33000212964-connect-to-payment-provider-stripe-" target="_blank">Stripe configuration</a>.
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
