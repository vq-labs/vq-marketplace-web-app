import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import SectionOverview from './Overview';
import SectionCategories from './Categories';
import SectionBasics from './Basics';
import SectionDesign from './Design';
import SectionUsers from './Users';
import SectionOrders from './Orders';
import SectionRequests from './Requests';
import SectionLabels from './Labels';
import SectionPricing from './Pricing';
import SectionListing from './Listing';
import SectionPosts from './Posts';

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
                    <div className="col-xs-12">
                        <h4>Analytics</h4>
                        <MenuItem onClick={ () => this.goToSection('overview') }>Overview</MenuItem>

                        <h4>Entities</h4>
                        <MenuItem onClick={ () => this.goToSection('users') }>Users</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('orders') }>Orders</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('requests') }>Requests</MenuItem>
                    
                        <h4>Configuration</h4>
                        <MenuItem onClick={ () => this.goToSection('basics') }>Basics details</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('design') }>Design</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('labels') }>Labels (i18n)</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('listing') }>Listing</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('categories') }>Listing categories</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('pricing') }>Pricing</MenuItem>
                        
                        <h4>Content</h4>
                        <MenuItem onClick={ () => this.goToSection('posts') }>Content</MenuItem>
                    </div>
                </Drawer>

                <div className="row" style={{ marginBottom: 100, paddingLeft: '256px' }}>
                        <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12">
                                        { this.state.section === 'overview' && <SectionOverview /> } 
                                        { this.state.section === 'users' && <SectionUsers /> }
                                        { this.state.section === 'orders' && <SectionOrders /> }
                                        { this.state.section === 'requests' && <SectionRequests /> } 
                                        { this.state.section === 'labels' && <SectionLabels /> }
                                        { this.state.section === 'categories' && <SectionCategories /> }
                                        { this.state.section === 'basics' && <SectionBasics /> }
                                        { this.state.section === 'design' && <SectionDesign /> }
                                        { this.state.section === 'pricing' && <SectionPricing /> }
                                        { this.state.section === 'listing' && <SectionListing /> }
                                        { this.state.section === 'posts' && <SectionPosts /> }
                                    </div> 
                                </div> 
                        </div>    
                </div>    
            </div>
        );
  }
}