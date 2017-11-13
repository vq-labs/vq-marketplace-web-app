import React from 'react';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SectionOverview from './Overview';
import SectionCategories from './Categories';
import SectionGetStarted from './GetStarted';
import SectionBasics from './Basics';
import SectionSEO from './SEO';
import SectionCustomPages from './CustomPages';
import SectionDesign from './Design';
import SectionCustomScripts from './CustomScripts';
import SectionLandingPage from './LandingPage';
import SectionUsers from './Users';
import SectionUserTypes from './UserTypes';
import SectionPayments from './Payments';
import SectionAnalytics from './Analytics';
import SectionListingFilters from './Filters';
import SectionListings from './Listings';
import SectionOrders from './Orders';
import SectionRequests from './Requests';
import SectionLabels from './Labels';
import SectionPricing from './Pricing';
import SectionListing from './Listing';
import SectionPosts from './Posts';
import SectionSubscriptionPlan from './SubscriptionPlan';

import { goTo, convertToAppPath } from '../core/navigation';
import { getUserAsync } from '../core/auth';

const menuPoints = [
    [ "General",
        [
            [ 'get-started', 'Get Started' ],
            [ 'overview', 'Overview' ]
        ]
    ],
    [ 'Entities',
        [
            [ 'users', 'Users' ],
            [ 'listings', 'Listings' ],
            [ 'requests', 'Requests' ]
        ]
    ],
    [ 'Configuration',
        [
            [ 'basics', 'Basics details' ],
            [ 'design', 'Design' ],
            [ 'seo', 'SEO' ],
            [ 'analytics', 'Analytics' ],
            [ 'landing-page', 'Landing Page (beta)' ],
            [ 'labels', 'Labels' ],
            [ 'payments', 'Payments' ],
            [ 'custom-scripts', 'Custom Scripts (beta)' ],
            [ 'custom-pages', 'Custom Pages' ],
            [ 'listing', 'Listing' ],
            [ 'listing-filters', 'Listing filters' ],
            [ 'categories', 'Listing categories' ],
            [ 'pricing', 'Pricing' ],
            [ 'content', 'Content' ]
        ]
    ]
];

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            section: props.params.section || 'overview',
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
                return goTo(`/login?redirectTo=${convertToAppPath(location.pathname)}`);
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
                <button onTouchTap={() => this.handleToggle()}/>
                <Drawer docked={true} open={this.state.open} >
                    <div className="col-xs-12" style={{ marginBottom: 10 }}>
                            { menuPoints.map(menuGroup =>
                                 <Menu
                                 selectedMenuItemStyle={{ backgroundColor: 'rgb(0, 6, 57)', color: '#FFFFFF' }}
                                 value={this.state.section}
                             >
                                    <h4>{menuGroup[0]}</h4>
                                    { menuGroup[1].map(menuItem =>
                                        <MenuItem
                                            value={menuItem[0]}
                                            onClick={() => this.goToSection(menuItem[0])}>
                                            {menuItem[1]}
                                        </MenuItem>
                                    )}
                                 </Menu>
                            )}
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
                                alt="presentation"
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
                                        { this.state.section === 'landing-page' && <SectionLandingPage /> }
                                        { this.state.section === 'analytics' && <SectionAnalytics /> }
                                        { this.state.section === 'orders' && <SectionOrders /> }
                                        { this.state.section === 'payments' && <SectionPayments /> }
                                        { this.state.section === 'requests' && <SectionRequests /> } 
                                        { this.state.section === 'labels' && <SectionLabels /> }
                                        { this.state.section === 'custom-scripts' && <SectionCustomScripts /> }
                                        { this.state.section === 'listing-filters' && <SectionListingFilters /> }
                                        { this.state.section === 'custom-pages' && <SectionCustomPages /> }
                                        { this.state.section === 'user-types' && <SectionUserTypes /> }
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