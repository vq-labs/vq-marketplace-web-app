import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import * as apiAdmin from '../api/admin';

import * as apiConfig from '../api/config';

import * as coreNavigation from '../core/navigation';

import EditableText from '../Components/EditableText';

import SectionBasics from './Basics';

export default class DrawerSimpleExample extends React.Component {

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
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ section: nextProps.params.section });
    }
    componentDidMount() {
        switch (this.state.section) {
            case 'overview': 
                apiAdmin.overview.getItems().then(overview => {
                    this.setState({ overview });
                });
                break;
            case 'categories':
                apiConfig.categories.getItems().then(categories => {
                    this.setState({ categories });
                });
                break;
            case 'users':
                apiAdmin.users.getItems().then(users => {
                    this.setState({ users });
                });
                break;
            default:
        }
  }

  handleToggle = () => this.setState({open: !this.state.open});
  
  render() { 
    const EditableCategory = (values, index) =>
    <div className="col-xs-12">
        <EditableText
            fields={ {
                code: { type: 'string', placeholder: 'Enter category code' },
                label: { type: 'string', placeholder: 'Enter category label' },
                desc: { type: 'string', placeholder: 'Enter category description' },
                imageUrl: { type: 'image', placeholder: 'Add category image' },
                bigImageUrl: { type: 'image', placeholder: 'Add high resolution category image' },
            } }category
        style={{  'marginTop': '20px'  }}
        autoEditMode={typeof index !== 'undefined'}
        values={ values } 
        placeholder={ 'Neue Kategorie' }
        onCancel={() => {
            if (typeof index !== 'undefined') {
                 this.state.categories[index].editMode = false;
                 this.forceUpdate()
            } 
            if (this.state.isAddingNewCategory) {
                
                this.setState({isAddingNewCategory : false})
                this.state.categories.pop();
                

            }
            this.setState({ 
                isAddingNewCategory: this.state.isAddingNewCategory, 
                categories: this.state.categories 
            });
        }}
        onChange={newCategory => {
            const categories = this.state.categories;
                newCategory.editMode = false;

                categories[index] = newCategory;
                if (this.state.isAddingNewCategory) {
                    apiConfig.categories.createItem(newCategory).then(rNewCategoryDoc => {});
                } else {
                    apiConfig.categories.updateItem(newCategory._id, newCategory).then(rNewCategoryDoc => {});
                }

                this.setState({
                    isAddingNewCategory: false,
                    newCategory: {},
                    categories
                });
    }}/>
    </div>;

    const SectionUsers = <List>
                            { this.state.users.map( user => 
                                <ListItem
                                    onClick={ () => coreNavigation.goTo(`/profile/${user._id}`)}
                                    leftAvatar={<Avatar src={ user.profile ? user.profile.imageUrl : '' } />} 
                                    primaryText={ user.profile && (user.profile.firstName + ' ' + user.profile.lastName) } 
                                />
                            )}
                         </List>;

    const SectionCategories = 
        <div className="row">
                { this.state.categories.map( (category, index) =>
                    <div className="col-xs-12 col-sm-6" style={{ marginBottom: 10}}>
                        <Card>
                        { !category.editMode && 
                            <CardMedia>
                                <img src={category.imageUrl} alt={category.label}/>
                            </CardMedia>
                        }
                        { !category.editMode && 
                            <CardTitle title={category.label} subtitle={category.desc} />
                        }
                        { category.editMode &&
                        <CardText>
                            <div className="row">
                                { EditableCategory(category, index) }
                            </div>
                        </CardText>
                        }
                        { !category.editMode && 
                            <CardActions>
                                <FlatButton label="Edit" onTouchTap={ () => {
                                    this.state.categories.map((category, currentIndex) => {
                                        category.editMode = currentIndex === index;

                                        return category;
                                    });
                                    
                                    this.setState({ 
                                        categories: this.state.categories
                                    });
                                }}/>
                                <FlatButton label="Delete" onTouchTap={ () => {
                                    this.state.categories.splice(index, 1)

                                    apiConfig.categories.deleteItem(category._id).then(categories => {
                                        this.setState({ categories: this.state.categories });
                                    });
                                }} />
                            </CardActions>
                        } 
                        </Card> 
                </div>
                )}
                { !this.state.isAddingNewCategory && 
                    <div className="col-xs-12 col-sm-6" style={{ marginBottom: 10}}>       
                        <FloatingActionButton 
                            onClick={ () => {
                                this.state.categories.push({ editMode: true });

                                this.setState({ 
                                    isAddingNewCategory: true, 
                                    categories: this.state.categories 
                                });
                            } } mini={true} backgroundColor={"#546e7a"} >
                            <ContentAdd />
                        </FloatingActionButton>
                    </div>
                }
        </div>;

    return (
      <div className="container">
        <Drawer open={true}>
          <h3>Users</h3>
          <MenuItem>Overview</MenuItem>
          <MenuItem onClick={ () => coreNavigation.goTo('/admin/users') }>Manage Users</MenuItem>
          <MenuItem onClick={ () => coreNavigation.goTo('/admin/analytics') }>Analytics</MenuItem>

          <h3>Configuration</h3>
          <MenuItem onClick={ () => coreNavigation.goTo('/admin/basics') }>Basics details</MenuItem>
          <MenuItem onClick={ () => coreNavigation.goTo('/admin/design') }>Design</MenuItem>
          <MenuItem onClick={ () => coreNavigation.goTo('/admin/categories') }>Listing categories</MenuItem>
        </Drawer>

        <div className="row" style={{ paddingLeft: '256px' }}>
                <div className="col-xs-12">
                  
                        <div className="row">
                        <div className="col-xs-12">

                        </div>     
                        <div className="col-xs-12">
                            { this.state.section === 'users' && SectionUsers } 
                            { this.state.section === 'categories' && SectionCategories }
                            { this.state.section === 'basics' && <SectionBasics /> }
                        </div> 
                        </div> 
                  
                </div>    
        </div>    
      </div>
    );
  }
}