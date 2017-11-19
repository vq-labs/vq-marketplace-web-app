import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LoginSignup from '../Components/LoginSignup';
import ImageUploader from '../Components/ImageUploader';
import * as coreAuth from '../core/auth';
import * as apiCategory from '../api/category';
import * as apiTaskLocation from '../api/task-location';
import { translate } from '../core/i18n';
import { goTo, convertToAppPath } from '../core/navigation';
import NewListingBasics from './NewListingBasics';
import NewListingCategory from './NewListingCategory';
import NewListingPricing from './NewListingPricing';
import NewListingDate from './NewListingDate';
import NewListingReview from './NewListingReview';
import NewListingLocation from './NewListingLocation';
import NewListingDuration from './NewListingDuration';
import { CONFIG } from '../core/config';
import { getUserAsync } from '../core/auth';
import { getMeOutFromHereIfAmNotAuthorized } from '../helpers/user-checks';
import { displayMessage } from '../helpers/display-message.js';
import { openDialog } from '../helpers/open-message-dialog.js';
import { createListing } from '../helpers/create-listing.js';

const _ = require('underscore');

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

const TASK_TYPES = {
    REQUESTING: 1,
    OFFERING: 2
};

const TASK_STATUS = {
    ACTIVE: '0',
    INACTIVE: '103',
    CREATION_IN_PROGRESS: '10',
    BOOKED: '20'
};

let restrictedPostalCodes;
/**
 * [
        "113",
        "112",
        "111",
        "101",
        "102",
        "103",
        "105",
        "106",
        "107"
    ]
 */

const verifyPostalCode = postalCode => {
    if (!restrictedPostalCodes.length) {
        return true;
    }

    if (restrictedPostalCodes.indexOf(String(postalCode).substring(0, 3)) === -1) {
        return false;
    }

    return true;
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
            insertedTask: {},
            listingCategories: [],
            step,
            task
        };
    }

    componentDidMount() {
        restrictedPostalCodes = CONFIG.LISTING_RESTRICTED_POSTAL_CODES ? CONFIG.LISTING_RESTRICTED_POSTAL_CODES.split(",") : [];

        getUserAsync(user => {
            if (!user) {
                return goTo(`/login?redirectTo=${convertToAppPath(`${location.pathname}`)}`);
            }
            
            if (getMeOutFromHereIfAmNotAuthorized(user)) {
                return;
            }

            if (user.userType === 0) {
                goTo("/");

                return alert("No support for user type 0 yet. Create supply or demand account.");
            }

            if (user.userType === 2 && CONFIG.USER_TYPE_SUPPLY_LISTING_ENABLED !== "1") {
                return goTo('/');
            }

            if (user.userType === 1 && CONFIG.USER_TYPE_DEMAND_LISTING_ENABLED !== "1") {
                return goTo('/');
            }

            const task = this.state.task;

            task.taskType = user.userType === 1 ? TASK_TYPES.REQUESTING : TASK_TYPES.OFFERING;

            apiTaskLocation
            .getItems({
                userId: user.id
            })
            .then(defaultLocations => {
                const defaultLocation = defaultLocations[0] || {};

                const mutableProps = [
                    "locationQueryString",
                    "countryCode",
                    "street",
                    "streetNumber",
                    "addressAddition",
                    "city",
                    "postalCode",
                    "lat",
                    "lng"
                ];

                task.location = task.location || {};

                mutableProps
                .forEach(mutalblePropKey => {
                    task.location[mutalblePropKey] = defaultLocation[mutalblePropKey];
                });
                
                this.setState({
                    task
                });
            });

            apiCategory
            .getItems()
            .then(listingCategories => {
                const currency = CONFIG.PRICING_DEFAULT_CURRENCY || this.state.currency;
                const task = this.state.task;
                
                task.currency = currency;

                this.setState({
                    ready: true,
                    task,
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
    }

    handlePricingChange (priceType, priceInCents) {
        const task = this.state.task;
        
        task.priceType = priceType;
        task.price = priceInCents;

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
                                onChange={_ => {
                                    this.handleListingFieldChange('images', _);
                                }}
                            />
                        </div>
                </div>;

              const createAccountSection =
                <div className="col-xs-12">
                        <div className="row">
                            <LoginSignup
                                onSuccess={() => {
                                    let step = 6;

                                    if (Number(CONFIG.LISTING_IMAGES_MODE) === 0) {
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
                            <NewListingCategory
                                listingType={this.state.task.taskType}
                                onSelected={
                                    categoryCode => this.onCategoryChosen(categoryCode)
                                }
                            /> 
                        }
                        { this.state.step > LISTING_VIEWS.CATEGORY &&
                        <div className="col-xs-12 col-sm-8 col-md-6">
                            { this.state.step === LISTING_VIEWS.PRICING &&
                                <NewListingPricing
                                    listingType={this.state.task.taskType}
                                    currency={this.state.currency}
                                    minPrice={this.state.minPrice}
                                    price={this.state.task.price}
                                    priceType={this.state.task.priceType}
                                    onPricingChange={
                                        pricing => this.handlePricingChange(pricing.priceType, pricing.price)
                                    } 
                                /> 
                            }
                            { this.state.step === LISTING_VIEWS.BASICS && 
                                <NewListingBasics
                                    listingType={this.state.task.taskType}
                                    title={{ value: this.state.task.title, mode: CONFIG.LISTING_TITLE_MODE }}
                                    description={{ value: this.state.task.description, mode: CONFIG.LISTING_DESCRIPTION_MODE }}
                                    location={{
                                        value: this.state.task.location,
                                        mode: CONFIG.LISTING_LOCATION_MODE
                                    }}
                                    onTitleChange={_ => this.handleListingFieldChange('title', _)}
                                    onDescriptionChange={_ => this.handleListingFieldChange('description', _)}
                                    onLocationChange={_ => {
                                        
                                        return this.handleListingFieldChange('location', _);
                                    }}
                                />
                            }

                            { this.state.step === LISTING_VIEWS.LOCATION &&
                                <NewListingLocation
                                    listingType={this.state.task.taskType}
                                    countryRestriction={CONFIG.COUNTRY_RESTRICTION}
                                    location={this.state.task.location}
                                    onLocationChange={_ => {
                                        if (verifyPostalCode(String(_.postalCode)) === -1) {
                                            displayMessage({
                                                label: translate("POSTAL_CODE") + ' ' + String(_.postalCode) + ' ' + translate("IS_NOT_SUPPORTED")
                                            });
                                        }

                                        this.handleListingFieldChange('location', _)
                                    }}
                                />
                            }

                            { this.state.step === LISTING_VIEWS.LOGIN && createAccountSection }
                            { this.state.step === LISTING_VIEWS.IMAGES && addImages }
                            { this.state.step === LISTING_VIEWS.CALENDAR &&
                                <NewListingDate
                                    listingType={this.state.task.taskType}
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
                                    listingType={this.state.task.taskType}
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
                                    listingType={this.state.task.taskType}
                                    listing={this.state.task}
                                    currency={this.state.currency}
                                />
                            }
                            
                            { this.state.ready &&
                            <div className="row" style={ { marginTop: 20 } }>
                                { this.state.step !== LISTING_VIEWS.SUCCESS && this.state.step !== LISTING_VIEWS.START &&
                                    <FlatButton
                                        style={{ 
                                            color: CONFIG.COLOR_PRIMARY,
                                            float: 'left'
                                        }}
                                        label={translate("BACK")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={() => {
                                            let nextStep = this.state.step - 1;

                                            if (nextStep === LISTING_VIEWS.CALENDAR) {
                                                if (CONFIG.LISTING_TIMING_MODE !== "1") {
                                                    nextStep -= 1;
                                                }
                                            }

                                            if (nextStep === LISTING_VIEWS.REVIEW && coreAuth.getUserId()) {
                                                nextStep -= 1;
                                            }

                                            if (nextStep === LISTING_VIEWS.IMAGES) {
                                                if (Number(CONFIG.LISTING_IMAGES_MODE) === 0) {
                                                    nextStep -= 1;
                                                }
                                            }

                                            if (nextStep === LISTING_VIEWS.DURATION && CONFIG.LISTING_DURATION_MODE !== "1") {
                                                nextStep -= 1;
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
                                        labelStyle={{color: 'white '}}
                                        backgroundColor={CONFIG.COLOR_PRIMARY}
                                        label={translate("CONTINUE")}
                                        disabled={false}
                                        onTouchTap={() => {
                                            const currentStep = this.state.step;
                                            let nextStep = currentStep + 1;
                                            const task = this.state.task;

                                            // CHECKS
                                            if (currentStep === LISTING_VIEWS.PRICING) {
                                                if (typeof task.priceType === 'undefined') {
                                                    return displayMessage({
                                                        label: translate("PRICE_TYPE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!task.price && task.priceType !== 2) {
                                                    return displayMessage({
                                                        label: translate("PRICE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            if (currentStep === LISTING_VIEWS.LOCATION) {
                                                if (!task.location.city) {
                                                    return displayMessage({
                                                        label: translate("LOCATION_CITY") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                    
                                                if (!task.location.postalCode) {
                                                    return displayMessage({
                                                        label: translate("LOCATION_POSTAL_CODE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (String(task.location.postalCode).length < 4) {
                                                    return displayMessage({
                                                        label: translate("LOCATION_POSTAL_CODE") + " " + translate("IS_NOT_CORRECT")
                                                    });
                                                }

                                                if (!task.location.countryCode) {
                                                    return displayMessage({
                                                        label: translate("LOCATION_COUNTRY") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!task.location.lat) {
                                                    return displayMessage({
                                                        label: translate("LOCATION_COUNTRY") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (!task.location.lng) {
                                                    return displayMessage({
                                                        label: 'Location is not exact enough.'
                                                    });
                                                }
                                            }
                                            
                                            if (currentStep === LISTING_VIEWS.LOCATION) {
                                                if (task.location) {
                                                    if (!verifyPostalCode(String(task.location.postalCode))) {
                                                        const postalCode = task.location.postalCode;

                                                        return displayMessage({
                                                            label: translate("POSTAL_CODE") + ' ' + String(postalCode) + ' ' + translate("IS_NOT_SUPPORTED")
                                                        });
                                                    }
                                                }
                                            }

                                            if (currentStep === LISTING_VIEWS.CALENDAR) {
                                                if (!task.timing.length) {
                                                    return displayMessage({
                                                        label: translate("LISTING_DATE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            if (currentStep === LISTING_VIEWS.BASICS) {
                                                if (Number(CONFIG.LISTING_TITLE_MODE) === 2 && !this.state.task.title) {
                                                    return displayMessage({
                                                        label: translate("LISTING_TITLE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (Number(CONFIG.LISTING_DESCRIPTION_MODE) === 2 && !this.state.task.description) {
                                                    return displayMessage({
                                                        label: translate("LISTING_DESCRIPTION") + " " + translate("IS_REQUIRED")
                                                    });
                                                }

                                                if (Number(CONFIG.LISTING_DESCRIPTION_MODE) === 2 && this.state.task.description.length < 50) {
                                                    return displayMessage({
                                                        label: translate("LISTING_DESCRIPTION_TOO_SHORT")
                                                    });
                                                }

                                                /*
                                                if (Number(CONFIG.LISTING_LOCATION_MODE) === 1 && !this.state.task.location.formattedAddress) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("LISTING_LOCATION") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                */
                                            }

                                            if (nextStep === LISTING_VIEWS.CALENDAR && CONFIG.LISTING_TIMING_MODE !== "1") {
                                                nextStep += 1;
                                            }

                                            if (nextStep === LISTING_VIEWS.DURATION && CONFIG.LISTING_DURATION_MODE !== "1") {
                                                nextStep += 1;
                                            }

                                            if (nextStep === LISTING_VIEWS.IMAGES && CONFIG.LISTING_IMAGES_MODE !== "1") {
                                                nextStep += 1;
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
                                        primary={true}
                                        label={translate("NEW_LISTING_CONFIRM_AND_POST")}
                                        disabled={this.state.isSubmitting}
                                        onTouchTap={() => {
                                            this.setState({
                                                isSubmitting: true
                                            });

                                            const task = _.clone(this.state.task);

                                            // for cent currencies, we multiply with 100
                                            /**
                                                if (task.currency !== 'HUF') {
                                                    task.price *= 100;
                                                }
                                            */

                                            delete task.location.locationQueryString;
                                            delete task.location.countryRestriction;
                                            
                                            task.status = TASK_STATUS.ACTIVE;

                                            createListing(task, err => {
                                                if (err) {
                                                    alert(err);
                                                    
                                                    this.setState({
                                                        isSubmitting: false
                                                    });

                                                    return;
                                                }

                                                openDialog({
                                                    header: this.state.task.taskType === 1 ?
                                                        translate('NEW_LISTING_SUCCESS_HEADER') :
                                                        translate('NEW_SUPPLY_LISTING_SUCCESS_HEADER'),
                                                    desc: this.state.task.taskType === 1 ?
                                                        translate('NEW_LISTING_SUCCESS_DESC') :
                                                        translate('NEW_SUPPLY_LISTING_SUCCESS_DESC')
                                                }, () => {
                                                    goTo(`/task/${task.id}`);
                                                });
                                            });
                                        } }
                                    />
                                }
                            </div>
                            }
                        </div> 
                        }
                    </div>
            );
    }
};