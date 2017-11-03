import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import SectionOverview from './Overview';
import SectionCategories from './Categories';
import SectionGetStarted from './GetStarted';
import SectionBasics from './Basics';
import SectionSEO from './SEO';
import SectionCustomPages from './CustomPages';
import SectionDesign from './Design';
import SectionUsers from './Users';
import SectionListingFilters from './Filters';
import SectionListings from './Listings';
import SectionOrders from './Orders';
import SectionRequests from './Requests';
import SectionLabels from './Labels';
import SectionPricing from './Pricing';
import SectionListing from './Listing';
import SectionPosts from './Posts';
import SectionSubscriptionPlan from './SubscriptionPlan';

import { goTo } from '../core/navigation';
import { getUserAsync } from '../core/auth';

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            section: props.params.section,
            isAddingNewCategory: false,
            users: [],
            categories: [],
            newCategory: {},
            meta: {}
        };

        this.goToSection = section => {
            goTo(`/admin/${section}`);

            this.setState({
                section
            });
        };
    }

    componentDidMount() {
        getUserAsync(user => {
            if (!user) {
                return goTo('/');
            }

            if (!user.isAdmin) {
                return goTo('/');
            }
        }, true);
    }

    handleToggle() { 
        return this.setState({
            open: !this.state.open 
        });
    }
  
    render() { 
        return (
            <div className="container">
                <Drawer open={true}>
                    <div className="col-xs-12" style={{ marginBottom: 10 }}>
                        { false && <MenuItem onClick={ () => this.goToSection('get-started') }>Get Started</MenuItem> }

                        <h4>General</h4>
                        <MenuItem onClick={ () => this.goToSection('overview') }>Overview</MenuItem>

                        <h4>Entities</h4>
                        <MenuItem onClick={ () => this.goToSection('users') }>Users</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('listings') }>Listings</MenuItem>
                        <MenuItem className="hidden" onClick={ () => this.goToSection('orders') }>Orders</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('requests') }>Requests</MenuItem>
                    
                        <h4>Configuration</h4>
                        <MenuItem onClick={ () => this.goToSection('basics') }>Basics details</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('design') }>Design</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('seo') }>SEO</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('custom-pages') }>Custom pages</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('labels') }>Labels (i18n)</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('listing') }>Listing fields</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('listing-filters') }>Listing filters</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('categories') }>Listing categories</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('pricing') }>Pricing</MenuItem>
                        
                        <h4>Content</h4>
                        <MenuItem onClick={ () => this.goToSection('posts') }>Content</MenuItem>


                        <h4>Subscription</h4>
                        <MenuItem onClick={ () => this.goToSection('subscription-plan') }>
                            Plan
                        </MenuItem>

                        <h4>Support</h4>
                        <a className="vq-link" href="https://vqlabs.freshdesk.com/support/tickets/new" target="_blank">
                            <MenuItem>
                                Submit ticket
                            </MenuItem>
                        </a>

                        <a className="vq-link" href="https://vqlabs.freshdesk.com/support/solutions" target="_blank">
                            <MenuItem>
                                Knowledge solutions
                            </MenuItem>
                        </a>

                        <a className="vq-link" href="https://vq-labs.com" target="_blank">
                            <MenuItem>
                                VQ LABS - Company
                            </MenuItem>
                        </a>

                        <hr />

                        <a target="_self" href="https://vq-labs.com">
                            <img
                                style={{
                                    display: 'block',
                                    margin: '0 auto',
                                    width: 50
                                }}
                                src={"https://vq-labs.com/vq-labs-logo-xs-2.png"}
                            />
                        </a>
                    </div>
                </Drawer>

                <div className="row" style={{ marginBottom: 100, paddingLeft: '256px' }}>
                        <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12">
                                        { this.state.section === 'get-started' && <SectionGetStarted /> } 
                                        { this.state.section === 'overview' && <SectionOverview /> } 
                                        { this.state.section === 'users' && <SectionUsers /> }
                                        { this.state.section === 'listings' && <SectionListings /> }
                                        { this.state.section === 'orders' && <SectionOrders /> }
                                        { this.state.section === 'requests' && <SectionRequests /> } 
                                        { this.state.section === 'labels' && <SectionLabels /> }
                                        { this.state.section === 'listing-filters' && <SectionListingFilters /> }
                                        { this.state.section === 'custom-pages' && <SectionCustomPages /> }
                                        { this.state.section === 'categories' && <SectionCategories /> }
                                        { this.state.section === 'basics' && <SectionBasics /> }
                                        { this.state.section === 'seo' && <SectionSEO /> }
                                        { this.state.section === 'design' && <SectionDesign /> }
                                        { this.state.section === 'pricing' && <SectionPricing /> }
                                        { this.state.section === 'listing' && <SectionListing /> }
                                        { this.state.section === 'posts' && <SectionPosts /> }
                                        { this.state.section === 'subscription-plan' && <SectionSubscriptionPlan /> }
                                    </div> 
                                </div> 
                        </div>    
                </div>    
            </div>
        );
  }
}