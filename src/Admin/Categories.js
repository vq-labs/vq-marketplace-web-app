import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import EditableEntity from '../Components/EditableEntity';
import * as apiConfig from '../api/config';
import { Card, CardActions, CardMedia, CardTitle } from 'material-ui/Card';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';

function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
}

export default class SectionCategories extends React.Component {
    constructor() {
        super();
        this.state = { categories: [] };
    }

    componentDidMount() {
        apiConfig
            .categories
            .getItems()
            .then(categories => this.setState({
                categories
            }));
    }

    render() {
        const EditableCategory = (values, index) =>
                <div className="col-xs-12">
                    <EditableEntity
                        fields={[
                            {   
                                key: 'code',
                                type: 'string',
                                label: 'Internal category ID',
                                deriveValue: otherFields => {
                                    if (this.state.isAddingNewCategory) {
                                        return slugify(otherFields.label);
                                    }
                                    
                                    return otherFields.code;
                                }
                            },
                            { key: 'label', type: 'string', label: 'Enter category label' },
                            { key: 'desc', type: 'string', label: 'Enter category description' },
                            { key: 'minPriceHour', type: 'number', label: 'Enter the minimum price per hour in the supported currency' },
                            { key: 'imageUrl', type: 'single-image', label: 'Add category image', hint: 'Category image will be used on the category selection page.' },
                            // { key: 'bigImageUrl', type: 'single-image', label: 'Add high resolution category image', hint: 'This image will be used to create a landing page for this category.' }
                        ]}
                        value={values}
                        showCancelBtn={true}
                        style={{'marginTop': '20px'}}
                        autoEditMode={typeof index !== 'undefined'}
                        placeholder={'New Category'}
                        onCancel={() => {
                            let isAddingNewCategory = this.state.isAddingNewCategory;
                            const categories = this.state.categories;

                            if (this.state.isAddingNewCategory) {
                                isAddingNewCategory = false;
                                categories.pop();
                            }

                            this.setState({
                                categoryIndexInEdit: null,
                                categoryInEdit: null,
                                isAddingNewCategory, 
                                categories
                            });
                        }}
                        onConfirm={newCategory => {
                            const categories = this.state.categories;

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
                                categoryIndexInEdit: null,
                                categoryInEdit: null,
                                isAddingNewCategory: false,
                                newCategory: {},
                                categories
                            });
                    }}
                />
            </div>;


            return (
                <div className="row">
             <div className="col-xs-12">
                <h1>Listing categories</h1>

                { this.state.categoryInEdit &&
                    <div className="row">
                        <div className="col-xs-12">
                            { EditableCategory(this.state.categoryInEdit, this.state.categoryIndexInEdit) }
                        </div>
                    </div>
                }

                { !this.state.categoryInEdit && this.state.categories && this.state.categories
                    .map((category, index) =>
                    <div className="col-xs-12 col-sm-6" style={{ marginBottom: 10 }}>
                    <Card>
                        <CardMedia>
                            <img src={category.imageUrl || '/images/category-default-img.jpeg'} alt={category.label}/>
                        </CardMedia>
                
                        <CardTitle title={category.label} subtitle={category.desc} />
                
                        <CardActions>
                            <FlatButton label="Edit" onTouchTap={() => {
                                this.setState({
                                    categoryIndexInEdit: index,
                                    categoryInEdit: category
                                });
                            }}/>
                            <FlatButton label="Delete" onTouchTap={() => {
                                openConfirmDialog({
                                    headerLabel: `Delete category "${category.code}"`,
                                    confirmationLabel: `Are you sure?`,
                                    okLabel: 'Confirm',
                                    cancelLabel: 'Cancel'
                                }, () => {
                                    this.state.categories.splice(index, 1);

                                    apiConfig.categories
                                    .deleteItem(category.id)
                                    .then(() => {
                                        this.setState({ 
                                            categories: this.state.categories
                                        });
                                    });
                                });
                            }} />
                        </CardActions>
                    </Card>
                </div>
                )}
                { !this.state.categoryInEdit && !this.state.isAddingNewCategory && 
                    <div className="col-xs-12 col-sm-6" style={{ marginBottom: 10}}>       
                        <FloatingActionButton 
                            onClick={ () => {
                                const categories = this.state.categories;
                                const categoryLastIndex = categories.length;

                                categories.push({});
                                
                                this.setState({
                                    categoryIndexInEdit: categoryLastIndex,
                                    categoryInEdit: categories[categoryLastIndex],
                                    isAddingNewCategory: true,
                                    categories: this.state.categories 
                                });
                            } } mini={true} backgroundColor={"#546e7a"} >
                            <ContentAdd />
                        </FloatingActionButton>
                    </div>
                }
            </div>
        </div>
      );
    }
};
