import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LoginSignup from '../Components/LoginSignup';
import ImageUploader from '../Components/ImageUploader';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import * as apiCategory from '../api/category';
import * as apiTaskImage from '../api/task-image';
import * as apiTaskLocation from '../api/task-location';
import * as apiTaskCategory from '../api/task-category';
import * as apiTaskTiming from '../api/task-timing';
import { translate } from '../core/i18n';
import { goTo, convertToAppPath } from '../core/navigation';
import Snackbar from 'material-ui/Snackbar';

import NewListingBasics from './NewListingBasics';
import NewListingCategory from './NewListingCategory';
import NewListingPricing from './NewListingPricing';
import NewListingDate from './NewListingDate';
import NewListingReview from './NewListingReview';
import NewListingLocation from './NewListingLocation';
import NewListingDuration from './NewListingDuration';

import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import { getMeOutFromHereIfAmNotAuthorized } from '../helpers/user-checks';

const _chunk = require('lodash.chunk');

const LISTING_VIEWS = {
    START: 1,
    CATEGORY: 1,
    PRICING: 2,
    BASICS: 3,
    LOCATION: 4,
    CALENDAR: 5,
    DURATION: 6,
    IMAGES: 7,
    REVIEW: 8,
    SUCCESS: 9,
    LOGIN: 10
};

const PRICING_MODELS = {
    TOTAL: 0,
    HOURLY: 1,
    REQUEST_QUOTE: 2
};

const TASK_TYPES = {
    OFFERING: 1,
    SEARCHING: 2
};

const TASK_STATUS = {
    ACTIVE: '0',
    INACTIVE: '103',
    CREATION_IN_PROGRESS: '10',
    BOOKED: '20'
};

export default class NewListing extends Component {
    constructor(props) {
        super();

        let step = LISTING_VIEWS.CATEGORY;

        const task = {
            title: '',
            description: '',
            location: {},
            duration: 2,
            priceType: 1,
            taskType: TASK_TYPES.OFFERING,
            categories: [],
            timing: [],
            images: [],
            utm: {
                source: 'web-app',
                medium: 'web'
            }
        };

        if (props.location.query.category) {
            const category = props.location.query.category;

            step = LISTING_VIEWS.PRICING;

            task
                .categories
                .push(category);
        }

        this.state = {
            value: 'signup',
            auth: coreAuth.getUserId(),
            minPrice: 0,
            openSnackbar: false,
            insertedTask: {},
            listingCategories: [],
            step,
            task
        };
    }

    componentDidMount() {
        getConfigAsync(meta => {
            getUserAsync(user => {
                if (!user) {
                    return goTo(`/login?redirectTo=${convertToAppPath(`${location.pathname}`)}`);
                }

                if (getMeOutFromHereIfAmNotAuthorized(user)) {
                    return;
                }

                /**
                 * Only buyers can access this page
                 */
                if (String(user.userType) !== '1') {
                    return goTo('/');
                }

                apiCategory
                .getItems()
                .then(listingCategories => {
                    let priceType = 0;
                    const currency = meta.PRICING_DEFAULT_CURRENCY || this.state.currency;
                    const pricingConfig = {
                        hourly: Boolean(Number(meta.PRICING_HOURLY)),
                        contract: Boolean(Number(meta.PRICING_CONTRACT)),
                        request: Boolean(Number(meta.PRICING_REQUEST))
                    };

                    if (pricingConfig.hourly) {
                        priceType = PRICING_MODELS.HOURLY;
                    }

                    if (pricingConfig.contract) {
                        priceType = PRICING_MODELS.TOTAL;
                    }

                    if (pricingConfig.request) {
                        priceType = PRICING_MODELS.REQUEST_QUOTE;
                    }

                    const task = this.state.task;
                    
                    task.priceType = priceType;
                    task.currency = currency;

                    this.setState({
                        appConfig: meta,
                        ready: true,
                        task,
                        priceType,
                        pricingConfig,
                        currency
                    });
                
                    const category = listingCategories
                        .filter(
                            _ => _.code === task.categories[0] || this.props.location.query.category
                        )[0];
                        
                    const minPrice = category ? category.minPriceHour || 0 : 0;
                    
                    task.price = minPrice;

                    this.setState({
                        listingCategories,
                        minPrice,
                        task
                    });
                });
            }, true);
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

        this.setState({
            task
        });
    }

    onCategoryChosen (categoryCode) {
        const task = this.state.task;
        const listingCategories = this.state.listingCategories;
        const categories = [ categoryCode ];

        task.categories = categories;    

        const category = listingCategories
            .filter(
                _ => _.code === categoryCode
            )[0];
        const minPrice = category.minPriceHour || 0;
        
        task.price = minPrice;

        this.setState({
            minPrice,
            step: LISTING_VIEWS.PRICING, 
            task
        });
    }

    handleListingFieldChange(fieldName, fieldValue) {
        const task = this.state.task;

        task[fieldName] = fieldValue;

        this.setState({ task });
    }

    render() {
              const success=
              <div className="container">
                <div className="row">
                    { this.state.ready &&
                        <div className="col-xs-12">
                            <h1 style={{color: this.state.appConfig.COLOR_PRIMARY}}>Bravo! {translate("YOUR_LISTING_HAS_BEEN_SUBMITTED")}</h1>
                        </div>
                    }
                </div>

                { this.state.ready &&
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                           <RaisedButton
                                label={'Go to your offer'}
                                backgroundColor={this.state.appConfig.COLOR_PRIMARY}
                                primary={true}
                                disabled={false}
                                onTouchTap={() => goTo(`/task/${this.state.task.id}`)}
                            />
                        </div>
                    </div>
                </div>
                }
              </div>;

              const addImages =
                <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>{translate("STEP")} 4. {translate("NEW_LISTING_PHOTO_HEADER")}</h1>
                                <p className="text-muted">{translate("NEW_LISTING_PHOTO_DESC")}</p>
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
                                onSuccess={() => {
                                    let step = 6;

                                    if (Number(this.state.appConfig.LISTING_IMAGES_MODE) === 0) {
                                        step = step + 1;
                                    }
                                      
                                    this.setState({ 
                                        auth: true,
                                        step
                                    })
                                }}
                            />
                        </div>
                </div>;

            return (
                    <div className="container">
                        { this.state.step === LISTING_VIEWS.CATEGORY && 
                            <NewListingCategory onSelected={
                                categoryCode => this.onCategoryChosen(categoryCode)
                            } /> 
                        }
                        { this.state.step > LISTING_VIEWS.CATEGORY &&
                        <div className="col-xs-12 col-sm-8 col-md-6">
                            { this.state.ready && this.state.step === LISTING_VIEWS.PRICING &&
                                <NewListingPricing
                                    pricingConfig={this.state.pricingConfig}
                                    currency={this.state.currency}
                                    minPrice={this.state.minPrice}
                                    price={this.state.task.price}
                                    priceType={this.state.priceType}
                                    onPricingChange={
                                        pricing => this.handlePricingChange(pricing.priceType, pricing.price)
                                    } 
                                /> 
                            }
                            { this.state.step === LISTING_VIEWS.BASICS && 
                                <NewListingBasics
                                    title={{ value: this.state.task.title, mode: this.state.appConfig.LISTING_TITLE_MODE }}
                                    description={{ value: this.state.task.description, mode: this.state.appConfig.LISTING_DESCRIPTION_MODE }}
                                    location={{ value: this.state.task.location, mode: this.state.appConfig.LISTING_LOCATION_MODE }}
                                    onTitleChange={_ => this.handleListingFieldChange('title', _)}
                                    onDescriptionChange={_ => this.handleListingFieldChange('description', _)}
                                    onLocationChange={_ => this.handleListingFieldChange('location', _)}
                                />
                            }

                            { this.state.ready && this.state.step === LISTING_VIEWS.LOCATION &&
                                <NewListingLocation
                                    countryRestriction={this.state.appConfig.COUNTRY_RESTRICTION}
                                    location={this.state.task.location}
                                    onLocationChange={_ => this.handleListingFieldChange('location', _)}
                                />
                            }

                            { this.state.step === LISTING_VIEWS.LOGIN && createAccountSection }
                            { this.state.step === LISTING_VIEWS.IMAGES && addImages }
                            { this.state.step === LISTING_VIEWS.CALENDAR &&
                                <NewListingDate 
                                    selected={this.state.task.timing}
                                    onSelect={selectedDate => {
                                        const task = this.state.task;
                                        
                                        task.timing = selectedDate;

                                        this.setState({
                                            task
                                        });
                                    }}
                                /> 
                            }
                            { this.state.step === LISTING_VIEWS.DURATION &&
                                <NewListingDuration 
                                    duration={this.state.task.duration}
                                    handleDurationChange={duration => {
                                        const task = this.state.task;
                                        
                                        task.duration = duration;

                                        this.setState({
                                            task
                                        });
                                    }}
                                /> 
                            }
                            { this.state.step === LISTING_VIEWS.REVIEW &&
                                <NewListingReview
                                    listing={this.state.task}
                                    currency={this.state.currency}
                                />
                            }
                            
                            { this.state.step === LISTING_VIEWS.SUCCESS && success }
                            { this.state.ready &&
                            <div className="row" style={ { marginTop: 20 } }>
                                { this.state.step !== LISTING_VIEWS.SUCCESS && this.state.step !== LISTING_VIEWS.START &&
                                    <FlatButton
                                        style={{ 
                                            color: this.state.appConfig.COLOR_PRIMARY,
                                            float: 'left'
                                        }}
                                        label={translate("BACK")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            let nextStep = this.state.step - 1;

                                            if (nextStep === LISTING_VIEWS.REVIEW && coreAuth.getUserId()) {
                                                nextStep -= 1;
                                            }

                                            if (nextStep === LISTING_VIEWS.IMAGES) {
                                                if (Number(this.state.appConfig.LISTING_IMAGES_MODE) === 0) {
                                                    nextStep -= 1;
                                                }
                                            }

                                            this.setState({ 
                                                step: nextStep
                                            });
                                        } }
                                    />
                                }
                                {   this.state.step > LISTING_VIEWS.START &&
                                    this.state.step < LISTING_VIEWS.REVIEW &&
                                    this.state.step !== LISTING_VIEWS.LOGIN &&
                                    <RaisedButton
                                        style={{
                                            float: 'right'
                                        }}
                                        backgroundColor={this.state.appConfig.COLOR_PRIMARY}
                                        label={translate("CONTINUE")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            const currentStep = this.state.step;
                                            let nextStep = currentStep + 1;
                                            const task = this.state.task;

                                            this.setState({
                                                openSnackbar: false
                                            });

                                            // CHECKS
                                            if (currentStep === LISTING_VIEWS.PRICING) {
                                                if (typeof task.priceType === 'undefined') {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("PRICE_TYPE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!task.price && task.priceType !== 2) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("PRICE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            if (currentStep === LISTING_VIEWS.LOCATION) {
                                                if (!task.location.city) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LOCATION_CITY") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                    
                                                if (!task.location.postalCode) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LOCATION_POSTAL_CODE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (String(task.location.postalCode).length < 4) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LOCATION_POSTAL_CODE") + " " + translate("IS_NOT_CORRECT")
                                                    });
                                                }

                                                if (!task.location.countryCode) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LOCATION_COUNTRY") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!task.location.lat) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LOCATION_COUNTRY") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!task.location.lng) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: 'Location is not exact enough.'
                                                    });
                                                }
                                            }


                                            if (currentStep === LISTING_VIEWS.CALENDAR) {
                                                if (!task.timing.length) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LISTING_DATE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            if (currentStep === LISTING_VIEWS.BASICS) {
                                                if (Number(this.state.appConfig.LISTING_TITLE_MODE) === 2 && !this.state.task.title) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LISTING_TITLE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (Number(this.state.appConfig.LISTING_DESCRIPTION_MODE) === 2 && !this.state.task.description) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LISTING_DESCRIPTION") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (Number(this.state.appConfig.LISTING_DESCRIPTION_MODE) === 2 && this.state.task.description.length < 50) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LISTING_DESCRIPTION") + " min. 50 chars"
                                                    });
                                                }

                                                /*
                                                if (Number(this.state.appConfig.LISTING_LOCATION_MODE) === 1 && !this.state.task.location.formattedAddress) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LISTING_LOCATION") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                */
                                            }

                                            if (nextStep === LISTING_VIEWS.IMAGES && Number(this.state.appConfig.LISTING_IMAGES_MODE) === 0) {
                                                nextStep = nextStep + 1;
                                            }

                                            this.setState({
                                                step: nextStep
                                            })
                                        } }
                                    />
                                }
                                { this.state.step === LISTING_VIEWS.REVIEW && this.state.auth &&
                                    <RaisedButton
                                        style={{
                                            float: 'right'
                                        }}
                                        backgroundColor={this.state.appConfig.COLOR_PRIMARY}
                                        label={translate("NEW_LISTING_CONFIRM_AND_POST")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            const task = this.state.task;

                                            if (task.currency === 'EUR' || task.currency === 'USD' || task.currency === 'PLN') {
                                                task.price *= 100;
                                            }

                                            delete task.location.locationQueryString;
                                            delete task.location.countryRestriction;
                                            
                                            task.status = TASK_STATUS.ACTIVE;

                                            apiTask.createItem({})
                                            .then(rTask => {
                                                task.id = rTask.id;

                                                return apiTaskCategory.createItem(task.id, task.categories);
                                            })
                                            .then(() => apiTask.updateItem(task.id, task))
                                            .then(() => apiTaskLocation.createItem(task.id, task.location))
                                            .then(() => apiTaskImage.createItem(task.id, task.images))
                                            .then(() => apiTaskTiming.createItem(task.id, {
                                                dates: task.timing,
                                                duration: task.duration
                                            }))
                                            .then(() => apiTask.updateItem(task.id, {
                                                status: 0
                                            }))
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
                            }
                        </div> 
                        }
                    </div>
            );
    }
};