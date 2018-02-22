import React from 'react';
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
import SectionUserConfig from './UserConfig';
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
            [ 'requests', 'Requests' ],
            [ 'orders', 'Transactions' ]
        ]
    ],
    [ 'Configuration',
        [
            [ 'basics', 'Basics details' ],
            [ 'design', 'Design' ],
            [ 'seo', 'SEO' ],
            [ 'analytics', 'Analytics' ],
            [ 'landing-page', 'Landing Page (beta)' ],
            [ 'user-types', 'Supply and Demand' ],
            [ 'labels', 'Labels' ],
            [ 'payments', 'Payments' ],
            [ 'custom-scripts', 'Custom Scripts (beta)' ],
            [ 'custom-pages', 'Custom Pages' ],
            [ 'listing', 'Listing' ],
            [ 'user-config', 'User' ],
            [ 'listing-filters', 'Listing filters' ],
            [ 'categories', 'Listing categories' ],
            [ 'pricing', 'Pricing' ],
            [ 'posts', 'Content' ]
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
                lastSection: this.state.lastSection,
                section
            });
        };
    }

    componentDidMount() {
        getUserAsync(user => {
/*             if (!user) {
                return goTo(`/login?redirectTo=${convertToAppPath(location.pathname)}`);
            }

            if (!user.isAdmin) {
                return goTo('/');
            } */
        }, true);
    }

    handleToggle() { 
        return this.setState({
            open: !this.state.open 
        });
    }
  
    render() {
        return (
            <div className="container-fluid">
                    <div className="col-xs-12 col-sm-3 col-md-2" style={{
                        marginBottom: 10,
                    }}>
                            { menuPoints.map(menuGroup =>
                                    <div className="col-xs-12">
                                        <h4 style={ { textTransform: 'uppercase', color: '##9E9E9E' } }>{menuGroup[0]}</h4>
                                        <ul className="list-unstyled vq-account-sector-list">
                                            { menuGroup[1].map((menuItem, index2) =>
                                                <li key={index2} className={this.state.section === menuItem[0] && 'vq-account-sector-active'}>
                                                    <a
                                                        style={{cursor: 'pointer'}}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.goToSection(menuItem[0]);
                                                        }}
                                                    >
                                                        {menuItem[1]}
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                            )}
                                <div className="col-xs-12">
                                <h4 style={ { textTransform: 'uppercase', color: '##9E9E9E' } }>Support</h4>
                                <ul className="list-unstyled vq-account-sector-list">
                                        <li>
                                            <a 
                                                href="https://vqlabs.freshdesk.com/support/tickets/new"
                                                target="_blank"
                                            >
                                                Submit ticket
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="https://vqlabs.freshdesk.com/support/solutions"
                                                target="_blank"
                                            >
                                                Knowledge solutions
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="https://vq-labs.com"
                                                target="_blank"
                                            >
                                                VQ LABS - Company
                                            </a>
                                        </li>
                                </ul>
                            </div>
                </div>
        
                <div className="col-sm-9 col-md-10" style={{
                    marginBottom: 100
                }}>
                    { this.state.lastSection === 'get-started' &&
                        <a href="#" onTouchTap={() => this.goToSection("get-started")}>‹ Back to Get Started</a>
                    }
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
                                    { this.state.section === 'content' && <SectionPosts /> }
                                    { this.state.section === 'custom-scripts' && <SectionCustomScripts /> }
                                    { this.state.section === 'listing-filters' && <SectionListingFilters /> }
                                    { this.state.section === 'custom-pages' && <SectionCustomPages /> }
                                    { this.state.section === 'user-types' && <SectionUserTypes /> }
                                    { this.state.section === 'user-config' && <SectionUserConfig /> }
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