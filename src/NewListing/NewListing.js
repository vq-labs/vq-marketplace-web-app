import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import DOMPurify from 'dompurify'
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Autocomplete from 'react-google-autocomplete';
import LoginSignup from '../Components/LoginSignup';
import ImageUploader from '../Components/ImageUploader';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import * as apiCategory from '../api/category';
import * as apiTaskImage from '../api/task-image';
import * as apiTaskLocation from '../api/task-location';
import * as apiTaskCategory from '../api/task-category';
import { translate } from '../core/i18n';
import * as coreNavigation from '../core/navigation';
import { formatGeoResults } from '../core/util';
import Snackbar from 'material-ui/Snackbar';

import NewListingBasics from './NewListingBasics';
import NewListingCategory from './NewListingCategory';
import NewListingPricing from './NewListingPricing';
import NewListingDate from './NewListingDate';

const _chunk = require('lodash.chunk');

const PRICING_MODELS = {
    TOTAL: 0,
    HOURLY: 1,
    REQUEST_QUOTE: 2
};

const TASK_TYPES = {
    OFFERING: 1,
    SEARCHING: 2
};

export default class NewListing extends Component {
    constructor(props) {
        super();

        this.state = {
            value: 'signup',
            auth: coreAuth.getUserId(),
            step: 1,
            minPrice: 0,
            openSnackbar: false,
            insertedTask: {},
            listingCategories: [],
            task: {
                title: '',
                description: '',
                location: {},
                priceType: 1,
                taskType: TASK_TYPES.OFFERING,
                categories: [],
                dueDate: [],
                images: [],
                utm: {
                    source: 'web-app',
                    medium: 'web'
                }
            }
        };
 
        if (props.location.query.category) {
            const category = props.location.query.category;

            this.state.task.categories.push(category);
            this.state.step = 2;

            return;
        }

        if (props.params.taskId) {
            apiTask
                .getItem(props.params.taskId)
                .then(task => {
                    let step = 1;

                    task.price = task.price / 100;

                    if (task.categories && task.categories.length) {
                        step = 2;
                    }

                    if (typeof task.priceType !== 'undefined' && task.priceType !== null) {
                        step = 3;
                    }

                    if (task.title && task.description) {
                        step = 5;
                    }

                    if (task.images && task.images.length) {
                        step = 6;
                    }

                    this.setState({ task, step })
                });
        }
    }
    componentDidMount() {
        apiCategory
        .getItems()
        .then(listingCategories => {
            const task = this.state.task;
            const category = listingCategories.filter(_ => _.code === this.props.location.query.category)[0];
            const minPrice = category.minPriceHour || 0;
            
            task.price = minPrice;

            this.setState({
                listingCategories,
                minPrice,
                task
            });
        });
    }

    handlePricingChange (priceType, priceInCents) {
        const task = this.state.task;

        task.priceType = Number(priceType);
        task.price = Number(priceInCents);

        this.setState({
            task 
        });
    }

    handleDescChange (event, description) {
      const task = this.state.task;
      
      task.description = description;

      this.setState({ task });
    }

    onCategoryChosen (categoryCode) {
        const task = this.state.task;
        const categories = [ categoryCode ];

        task.categories = categories;    

        this.setState({ 
            step: 2, 
            task
        });

        if (false && !task.id && coreAuth.getUserId()) {
            return apiTask
                .createItem({})
                .then(rTask => {
                    apiTaskCategory
                        .createItem(rTask.id, categories)
                        .then(data => {
                            this.setState({ 
                                step: 2, 
                                task: rTask 
                            });
                        });
                }, err => {
                    console.error(err);

                    coreNavigation.goTo('/login');
                });
        }

        if (task.id) {
            apiTaskCategory
                .createItem(task.id, categories);
        }

        return this.setState({
            step: 2,
            task 
        });
    }
    handleListingFieldChange(fieldName, fieldValue) {
        const task = this.state.task;

        task[fieldName] = fieldValue;

        this.setState({ task });
    }
    render() {
              const confirmBeforePosting = 
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>{translate("STEP")} 4. {translate("CONFIRM_BEFORE_POSTING")}</h1>
                        </div>
                    </div>
                

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("CATEGORY")}</h4>
                            { 
                                this.state.task.categories &&
                                this.state.task.categories
                                .map(category => 
                                    <span>{category.label}</span>
                                )
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("TITLE")}</h4>
                            {this.state.task.title}
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("DESCRIPTION")}</h4>
                            <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("PRICING")}</h4>
                            { this.state.task.priceType === 1 ? translate("PRICING_MODEL_HOURLY") : this.state.task.priceType === 0 ? translate("PRICING_MODEL_TOTAL") : translate("PRICING_MODEL_REQUEST_QUOTE") }
                        </div>
                    </div>

                    { this.state.task.priceType !== 2 && 
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>{translate("PRICE")}</h4>
                                {this.state.task.price + '€' }
                            </div>
                        </div>
                    }
                </div>
              </div>;

              const success=<div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Bravo! {translate("YOUR_LISTING_HAS_BEEN_SUBMITTED")}</h1>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                           <RaisedButton
                                label={'Go to your offer'}
                                primary={true}
                                disabled={false}
                                onTouchTap={() => coreNavigation.goTo(`/task/${this.state.task.id}`)}
                            />
                        </div>
                    </div>
                </div>
              </div>;

              const addImages =
                <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>{translate("STEP")} 4. {translate("ADD_PICTURE_HEADER")}</h1>
                                <p className="text-muted">{translate("ADD_PICTURE_DESC")}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <ImageUploader 
                                images={this.state.task.images} 
                                onChange={_ => this.handleListingFieldChange('images', _)}
                            />
                        </div>
                </div>;

              const createAccountSection =
                <div className="col-xs-12">
                        <div className="row">
                            <LoginSignup
                                onSuccess={ () => this.setState({ 
                                    auth: true,
                                    step: 5
                                }) }
                            />
                        </div>
                </div>;

            return (
                    <div className="container">
                        { this.state.step === 1 && 
                            <NewListingCategory onSelected={
                                categoryCode => this.onCategoryChosen(categoryCode)
                            } /> 
                        }
                          { this.state.step > 1 &&
                        <div className="col-xs-12 col-sm-8 col-md-6">
                            { this.state.step === 2 && 
                                <NewListingPricing
                                    minPrice={this.state.minPrice}
                                    price={this.state.task.price}
                                    priceType={this.state.task.priceType}
                                    onPricingChange={
                                        pricing => this.handlePricingChange(pricing.priceType, pricing.price)
                                    } 
                                /> 
                            }
                            { this.state.step===3 && 
                                <NewListingBasics
                                    title={this.state.task.title}
                                    description={this.state.task.description}
                                    location={this.state.task.location}
                                    onTitleChange={_ => this.handleListingFieldChange('title', _)}
                                    onDescriptionChange={_ => this.handleListingFieldChange('description', _)}
                                    onLocationChange={_ => this.handleListingFieldChange('location', _)}
                                />
                            }
                            { this.state.step===4 && createAccountSection }
                            { this.state.step===5 && addImages }
                            { this.state.step === 6 && 
                                <NewListingDate 
                                    selected={this.state.task.dueDate[0]}
                                    onSelect={selectedDate => {
                                        const task = this.state.task;
                                        
                                        task.dueDate = [ selectedDate ];

                                        this.setState({ task });
                                    }}
                                /> 
                            }
                            { this.state.step===7 && confirmBeforePosting }
                            { this.state.step===8 && success }

                            { this.state.step !== 5 && <hr /> }
                            
                            <div className="row" style={ { marginTop: 20 } }>
                                { this.state.step !== 7 &&  this.state.step !== 1 &&    
                                    <FlatButton
                                        style={ { float: 'left' } }
                                        label={translate("BACK")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            let nextStep = this.state.step - 1;

                                            if (nextStep === 4 && coreAuth.getUserId()) {
                                                nextStep -= 1;
                                            }

                                            this.setState({ 
                                                step: nextStep
                                            });
                                        } }
                                    />
                                }
                                {   this.state.step > 1 &&
                                    this.state.step < 6 &&
                                    this.state.step !== 4 &&
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label={translate("CONTINUE")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            const currentStep = this.state.step;
                                            let nextStep = currentStep + 1;
                                            const updatedTask = JSON.parse(JSON.stringify(this.state.task));

                                            updatedTask.price *= 100;
                                            
                                            false & this.state.task.id &&
                                            coreAuth.getUserId() &&
                                            apiTask.updateItem(this.state.task.id, updatedTask);

                                            if (currentStep === 2) {
                                                debugger;
                                                if (typeof this.state.task.priceType === 'undefined') {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("PRICE_TYPE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                if (!this.state.task.price && this.state.task.priceType !== 2) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("PRICE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            if (currentStep === 3) {
                                                if (coreAuth.getUserId()) {
                                                    nextStep += 1;
                                                }

                                                if (!this.state.task.title) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("TITLE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!this.state.task.description) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("DESCRIPTION") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            this.setState({
                                                step: nextStep
                                            })
                                        } }
                                    />
                                }
                                { this.state.step === 7 && this.state.auth &&
                                    <RaisedButton
                                        style={{ float: 'right' }}
                                        label={translate("CONFIRM_AND_POST")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            const task = this.state.task;

                                            task.price *= 100;

                                            if (task.id) {
                                                return apiTask
                                                    .updateItem(task.id, {
                                                        status: 0 
                                                    })
                                                    .then(task => this.setState({
                                                        step: this.state.step + 1
                                                    }));
                                            }

                                            apiTask.createItem({})
                                            .then(rTask => {
                                                task.id = rTask.id;

                                                return apiTaskCategory.createItem(task.id, task.categories);
                                            })
                                            .then(() => apiTaskLocation.createItem(task.id, task.location))
                                            .then(() => apiTaskImage.createItem(task.id, task.images))
                                            .then(() => apiTask.updateItem(task.id, task))
                                            .then(task => this.setState({
                                                step: this.state.step + 1
                                            }));
                                        } }
                                    />
                                }
                                <Snackbar
                                    open={this.state.openSnackbar}
                                    message={this.state.snackbarMessage}
                                    autoHideDuration={4000}
                                />
                            </div>
                        </div> 
                        }
                    </div>
            );
    }
};