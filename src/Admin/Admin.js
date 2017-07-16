import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import SectionOverview from './Overview';
import SectionCategories from './Categories';
import SectionBasics from './Basics';
import SectionUsers from './Users';
import SectionLabels from './Labels';
import SectionPricing from './Pricing';
import SectionListing from './Listing';
import SectionPosts from './Posts';
import * as coreNavigation from '../core/navigation';

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
            coreNavigation.goTo(`/admin/${section}`);

            this.setState({ section });
        };
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

                        <h4>Users</h4>
                        <MenuItem onClick={ () => this.goToSection('users') }>Manage Users</MenuItem>

                        <h4>Transactions</h4>
                        <MenuItem onClick={ () => this.goToSection('users') }>Transactions</MenuItem>
                    
                        <h4>Configuration</h4>
                        <MenuItem onClick={ () => this.goToSection('basics') }>Basics details</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('labels') }>Labels (i18n)</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('design') }>Design</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('listing') }>Listing</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('categories') }>Listing categories</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('pricing') }>Pricing</MenuItem>
                        
                        <h4>Content</h4>
                        <MenuItem onClick={ () => this.goToSection('posts') }>Emails</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('posts') }>Privacy policy</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('posts') }>Terms of Service</MenuItem>
                        <MenuItem onClick={ () => this.goToSection('posts') }>Blog</MenuItem>
                    </div>
                </Drawer>

                <div className="row" style={{ marginBottom: 100, paddingLeft: '256px' }}>
                        <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12">
                                        { this.state.section === 'overview' && <SectionOverview /> } 
                                        { this.state.section === 'users' && <SectionUsers /> } 
                                        { this.state.section === 'labels' && <SectionLabels /> }
                                        { this.state.section === 'categories' && <SectionCategories /> }
                                        { this.state.section === 'basics' && <SectionBasics /> }
                                        { this.state.section === 'pricing' && <SectionPricing /> }
                                        { this.state.section === 'listing' && <SectionListing /> }
                                        { this.state.section === 'posts' && <SectionPosts /> }
                                        { this.state.section === 'post' && <SectionPostEdit /> }
                                    </div> 
                                </div> 
                        </div>    
                </div>    
            </div>
        );
  }
}