import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import RaisedButton from 'material-ui/RaisedButton';
import InputRange from 'react-input-range';
import Loader from "../Components/Loader";
import TaskCard from '../Components/TaskCard';
import TaskListItem from '../Components/TaskListItem';
import VIEW_TYPES from '../Components/VIEW_TYPES';
import { displayPrice }  from '../core/format';
import * as apiConfig from '../api/config';
import apiTask from '../api/task';
import * as apiCategory from '../api/category';
import TaskMap from "../Components/TaskMap";
import TextField from 'material-ui/TextField';
import Autocomplete from 'react-google-autocomplete';

import OfferViewTypeChoice from "../Components/OfferViewTypeChoice";
import { stripHtml, formatGeoResults, serializeQueryObj } from '../core/util';
import { goTo, setQueryParams } from '../core/navigation';
import { getUserAsync } from '../core/auth';
import { getConfigAsync } from '../core/config';
import { translate } from '../core/i18n';
import { getMeOutFromHereIfAmNotAuthorized } from '../helpers/user-checks';

const _chunk = require('lodash.chunk');

let updatingResults;

class Offers extends Component {
    constructor(props) {
        super(props);

        const query = this.props.location.query;

        let locationQueryString;

        if ((query.q && query.q !== 'null') || (query.lat && query.lng)) {
            locationQueryString = (query.q || `${query.lat} ${query.lng}`);
        }
        
        this.state = {
            offers: [],
            offerMarkers: [],
            viewType: VIEW_TYPES.LIST,
            queryCity: null,
            config: {},
            autoCompleteText: '',
            isLoading: false,
            locationQueryString,
            appliedFilter: {
                q: locationQueryString,
                minPrice: query.minPrice || 500,
                maxPrice: query.maxPrice || 10000,
                category: query.category,
                lat: query.lat,
                lng: query.lng
            },
            offer: {
                utm: {}
            }
        };

        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleMarkerClose = this.handleMarkerClose.bind(this);
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config
            });

            getUserAsync(user => {
                if (getMeOutFromHereIfAmNotAuthorized(user)) {
                    return;
                }

                /**
                 * Only sellers can access this page
                 */
                if (String(user.userType) !== '2') {
                    return goTo('/dashboard');
                }

                this.setState({
                    isLoading: true
                });

                apiCategory
                .getItems()
                .then(categories => 
                    this.setState({
                        categories
                    })
                );

                this.updateResults(this.state.appliedFilter);
            }, true);
        });
    }
    
    displayIconElement (offer) {
        if (offer && offer.location && offer.location.formattedAddress){
            return <MapsPlace viewBox='-20 -7 50 10' />;
        }
        
        return <FileCloud viewBox='-20 -7 50 10'/>;
    }

    loadTasks(query) {
        this.setState({
            isLoading: true
        });
        
        apiTask
        .getItems({
            untilNow: 1,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            taskType: 1,
            status: '0',
            lat: query.lat,
            lng: query.lng,
            category: query.category
        })
        .then(offers => {
            offers = offers
            .filter(offer => {
                if (offer.priceType === null) {
                    console.error(`Task ${offer.id} has priceType of type null`);

                    return false;
                }

                return true;
            })

            const offerMarkers = offers
                .filter(_ => _.location)
                .map(_ => {
                    _.position = {
                        lat: _.location.lat,
                        lng: _.location.lng
                    };

                    return _;
                });

            this.setState({
                isLoading: false,
                offerMarkers,
                offers,
                offersChunksMD: _chunk(offers, 3),
                offersChunksXS: _chunk(offers, 2)
            });
        });
    }
    
    searchUpdated (term) {
        this.setState({
            searchTerm: term
        });
    }

    updateResults (query) {
        const appliedFilter = this.state.appliedFilter;

        appliedFilter.lat = typeof query.lat === 'undefined' ? appliedFilter.lat : query.lat ? query.lat : undefined;
        appliedFilter.lng = typeof query.lng === 'undefined' ? appliedFilter.lng : query.lng ? query.lng : undefined;
        appliedFilter.category = typeof query.category === 'undefined' ? appliedFilter.category : query.category ? query.category : undefined;
        
        setQueryParams(appliedFilter);

        this.setState({
            appliedFilter
        });

        this.loadTasks(appliedFilter);
    }

    handleMarkerClick(targetOffer) {
        const offerMarkers = this.state.offerMarkers
            .map(offer => {
                if (offer.id === targetOffer.id) {
                    return {
                        ...offer,
                        showInfo: true,
                        infoBox:
                        <div style={{ maxWidth: 200 }}>
                            <h4>{offer.title}</h4>
                            <p>{stripHtml(offer.description, 200)}</p>
                            <p className="text-muted">
                                {offer.location.street}, {offer.location.postalCode} {offer.location.city} 
                            </p>
                            <RaisedButton
                                onClick={() => goTo(`/task/${offer.id}`)}
                                label={translate('GO_TO_LISTING')}
                                primary={true}
                            />
                        </div>
                    };
                }

                return offer;
            });

        this.setState({
            offerMarkers
        });
    }

    handleMarkerClose(targetOffer) {
        this.setState({
            offerMarkers: this.state.offerMarkers
                .map(offer => {
                    if (offer.id === targetOffer.id) {
                        return {
                            ...offer,
                            showInfo: false
                        };
                    }

                    return offer;
                }),
        });
    }

    render() {
        const Intro = 
        <div className="vq-listings-intro text-center" style={{ 
            background: `url(${this.state.config.PROMO_URL_SELLERS || this.state.config.PROMO_URL}) no-repeat center center fixed`,
            backgroundSize: 'cover' 
        }}>
            <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3" style={{ marginTop: 50 }}>
                <div style={{
                    backgroundColor: this.state.config.teaserBoxColor,
                    padding: 10,
                    maxWidth: '850px',
                    margin: '0 auto'
                }}>
                    
                    { false && <h1 style={{
                        color: "white",
                        fontSize: 25
                    }}>
                        {translate('LISTINGS_PROMO_HEADER')}
                    </h1>
                    }
                    { false && <h2 style={{ 
                        color: "white",
                        fontSize: 18
                    }}>
                        {translate('LISTINGS_PROMO_DESC')}
                    </h2>
                    }
                    
                    <Autocomplete
                        value={this.state.locationQueryString}
                        onChange={ev => {
                            const locationQueryString = ev.target.value;
                            const newState = {};

                            if (locationQueryString === '') {
                                const appliedFilter = this.state.appliedFilter;
                            

                                appliedFilter.lat = null;
                                appliedFilter.lng = null;
                                appliedFilter.q = null;

                                newState.appliedFilter = appliedFilter;

                                this.updateResults(appliedFilter);
                            }

                            newState.locationQueryString = locationQueryString;

                            this.setState(newState);
                        }}
                        style={{
                            padding: 5,
                            fontSize: 20,
                            border: 0,
                            borderRadius: 5,
                            width: '100%',
                            height: 50
                        }}
                        componentRestrictions={{
                            country: 'hu'
                        }}
                        onPlaceSelected={place => {
                            const locationQueryString = place.formatted_address;
                            const locationValue = formatGeoResults([
                                place
                            ])[0];
                            const appliedFilter = this.state.appliedFilter;
                            
                            appliedFilter.lat = locationValue.lat;
                            appliedFilter.lng = locationValue.lng;
                            appliedFilter.q = locationQueryString;

                            this.setState({
                                locationQueryString,
                                appliedFilter
                            });

                            this.updateResults({
                                q: locationQueryString,
                                lat: appliedFilter.lat,
                                lng: appliedFilter.lng
                            });
                        }}
                        types={[ 'address' ]}
                        placeholder={translate('LISTING_FILTER_GEO')}
                    >
                    </Autocomplete>
                    { this.state.locationQueryString &&
                        <button
                            onTouchTap={() => {
                                const appliedFilter = this.state.appliedFilter;
                                const locationQueryString = '';

                                delete appliedFilter.lat;
                                delete appliedFilter.lng;
                                delete appliedFilter.q;

                                this.setState({
                                    locationQueryString,
                                    appliedFilter
                                });

                                this.updateResults(appliedFilter);
                            }}
                            className="close-icon"
                            type="reset"
                        ></button>
                    }
                </div>
            </div>
        </div>;

        const SidebarContent =
        <div className="row hidden-xs">
            <div className="col-xs-12"> 
            <div>
                <span style={{
                    fontWeight: !this.state.appliedFilter.category ? 'bold' : 'normal'
                }}    
                className="vq-uppercase with-pointer" onClick={
                    () => this.updateResults({ category: null })
                }>
                    { translate('ALL_CATEGORIES') }
                </span>
            </div>
            {  
            this.state.categories &&
            this.state.categories
            .map((category, index) =>
                <div key={index}>
                    <span style={{
                        fontWeight: this.state.appliedFilter.category === category.code ? 'bold' : 'normal'
                    }} className="vq-uppercase with-pointer" onClick={
                    () => {
                        this.updateResults({
                            category: category.code
                        }); 
                    }
                    }>{translate(category.code) === category.code ?
                        category.label : translate(category.code)
                    }
                    </span>
                </div>    
            )
            }
            </div>
            <div className="col-xs-12" style={{
                marginTop: 50,
            }}>
                <span className="vq-uppercase vq-bold">
                    <strong>{translate('PRICE')}</strong>
                </span>
                <hr style={{
                    marginTop: '5px'
                }}/>
                <div style={{ width: '100%' }}>
                    <h4 style={{ fontSize: '14px' }}>{this.state.appliedFilter.minPrice}-{this.state.appliedFilter.maxPrice} {displayPrice(undefined, 'HUF', 1)}</h4>
                    <InputRange
                        formatLabel={value => displayPrice(value, 'HUF', 1)}
                        maxValue={10000}
                        step={500}
                        minValue={500}
                        value={{
                            min: this.state.appliedFilter.minPrice,
                            max: this.state.appliedFilter.maxPrice
                        }}
                        onChange={value => {
                            const appliedFilter = this.state.appliedFilter;
                            
                            appliedFilter.minPrice = value.min;
                            appliedFilter.maxPrice = value.max;

                            if (!updatingResults) {
                                updatingResults = setTimeout(() => {
                                    updatingResults = null;
                                    
                                    this.updateResults({
                                        minPrice: value.min,
                                        maxPrice: value.max
                                    });
                                }, 1000);
                            }

                            return this.setState({
                                appliedFilter
                            });
                        }}
                    />
                </div>
            </div>
        </div>;

        return (
            <div>

            {Intro}

            <div className="container custom-xs-style" style={{ marginTop: 10 }}>
                        <div className="col-sm-4 col-md-3 col-lg-2">
                            <div className="row">
                                {SidebarContent}
                            </div>
                        </div>
                        <div className="col-lg-2 visible-lg">
                        </div>
                        <div className="col-sm-8 col-md-9 col-lg-8 custom-xs-style" >
                            <div className="col-xs-12" style={{ marginBottom: 5 }}>
                                <OfferViewTypeChoice
                                    className="pull-right"
                                    selected={VIEW_TYPES.LIST}
                                    onSelect={viewType => this.setState({
                                        viewType
                                    })}
                                />
                            </div>
                            { this.state.isLoading && 
                                <Loader isLoading={true} />
                            }
                            { !this.state.isLoading &&
                            <div className="col-xs-12">
                                    {!this.state.offers.length &&
                                    this.state.viewType !== VIEW_TYPES.MAP &&
                                        <div 
                                            className="text-center text-muted col-xs-12"
                                            style={{ marginBottom: 10} }
                                        >
                                                {translate('NO_LISTINGS')}
                                            <div className="row"><hr /></div>
                                        </div>
                                    }


                                    { this.state.viewType === VIEW_TYPES.LIST &&
                                            this.state.offers.map(offer =>
                                                <div 
                                                    className="col-xs-12"
                                                    style={{ marginBottom: 10} }
                                                >
                                                    <TaskListItem
                                                        key={offer.id}
                                                        task={offer}
                                                        displayPrice={true}
                                                    />
                                                   <div className="row"><hr /></div>
                                                </div>
                                            )
                                    }
                                    { this.state.viewType === VIEW_TYPES.MAP &&
                                        <div className="row">
                                            <div
                                                class="col-xs-12" 
                                                style={{
                                                    height: '350px',
                                                    width: '100%'
                                                }}
                                            >
                                                <TaskMap
                                                    onMarkerClick={this.handleMarkerClick}
                                                    onMarkerClose={this.handleMarkerClose}
                                                    markers={
                                                        this.state.offerMarkers
                                                    }
                                                    containerElement={
                                                        <div style={{ height: `100%` }} />
                                                    }
                                                    mapElement={
                                                        <div style={{ height: `100%` }} />
                                                    }
                                                />
                                            </div>
                                        </div>
                                    }
                                    {this.state.viewType === VIEW_TYPES.GRID &&
                                        <div className="row visible-xs visible-sm" >
                                            { this.state.offersChunksXS && 
                                                this.state.offersChunksXS.map((offerRow, index) =>
                                                    <div className="row" key={index}>
                                                        { this.state.offersChunksXS[index]
                                                            .map(offer =>
                                                                <div 
                                                                    className="col-xs-12 col-sm-6"
                                                                    style={{ marginBottom: 10} }
                                                                >
                                                                    <TaskCard
                                                                        key={offer.id}
                                                                        task={offer}
                                                                        displayPrice={true}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                            )}
                                        </div>
                                    }
                                    {this.state.viewType === VIEW_TYPES.GRID &&
                                        <div className="row hidden-xs hidden-sm" >
                                            { this.state.offersChunksMD && 
                                                this.state.offersChunksMD.map((offerRow, index) =>
                                                    <div className="row" key={index}>
                                                        { this.state.offersChunksMD[index].map(offer =>
                                                            <div className="col-xs-12 col-sm-4" style={ { marginBottom: 10} }>
                                                                <TaskCard task={offer} displayPrice={true} key={offer.id}  />
                                                            </div>
                                                        )}
                                                    </div>
                                            )}
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                </div>
            </div>
        );
    }
}

export default Offers;
