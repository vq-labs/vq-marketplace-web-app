import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import EditableText from '../Components/EditableText';
import * as apiConfig from '../api/config';
import { translate } from '../core/i18n';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';

export default class SectionCategories extends React.Component {
    constructor() {
        super();
        this.state = { categories: [] };
    }
    componentDidMount() {
        apiConfig.categories.getItems().then(categories => this.setState({ categories }));
    }
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
                placeholder={ 'New Category' }
                onCancel={() => {
                    if (typeof index !== 'undefined') {
                        const categories = this.state.categories;

                        categories[index].editMode = false;
            
                        this.forceUpdate();
                    }

                    if (this.state.isAddingNewCategory) {
                        this.setState({
                            isAddingNewCategory : false
                        });
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
                        apiConfig.categories
                        .createItem(newCategory)
                        .then(rNewCategoryDoc => {
                            categories[index] = rNewCategoryDoc;
                        });
                    } else {
                        apiConfig.categories
                        .updateItem(newCategory.id, newCategory)
                        .then(rNewCategoryDoc => {});
                    }

                    this.setState({
                        isAddingNewCategory: false,
                        newCategory: {},
                        categories
                    });
            }}/>
            </div>;


            return (
             <div className="col-xs-12">
                { this.state.categories && this.state.categories.map( (category, index) =>
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
                                    this.state.categories
                                    .map((category, currentIndex) => {
                                        category.editMode = currentIndex === index;

                                        return category;
                                    });
                                    
                                    this.setState({ 
                                        categories: this.state.categories
                                    });
                                }}/>
                                <FlatButton label="Delete" onTouchTap={ () => {
                                    this.state.categories.splice(index, 1)

                                    apiConfig.categories
                                    .deleteItem(category.id)
                                    .then(() => {
                                        this.setState({ 
                                            categories: this.state.categories
                                        });
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
        </div>
      );
    }
};
