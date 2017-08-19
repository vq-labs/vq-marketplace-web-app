import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import TaskCard from '../Components/TaskCard';
import TaskListItem from '../Components/TaskListItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Autocomplete from 'react-google-autocomplete';
import { serializeQueryObj, formatGeoResults } from '../core/util';
import { translate } from '../core/i18n';
import * as apiConfig from '../api/config';
import apiTask from '../api/task';
import * as apiCategory from '../api/category';
import TaskMap from "../Components/TaskMap";
import OfferViewTypeChoice from "../Components/OfferViewTypeChoice";
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { stripHtml } from '../core/util';
import { goTo } from '../core/navigation';
import { getUserAsync } from '../core/auth';
import { getConfigAsync } from '../core/config';

const _chunk = require('lodash.chunk');
import VIEW_TYPES from '../Components/VIEW_TYPES';

class Offers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offers: [],
            offerMarkers: [],
            viewType: VIEW_TYPES.LIST,
            queryCity: null,
            autoCompleteText: '',
            isLoading: false,
            meta: {},
            appliedFilter: {
                category: this.props.location.query.category,
                lat: this.props.location.query.lat,
                lng: this.props.location.query.lng
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
            getUserAsync(user => {
                if (user && user.status !== '10') {
                    return goTo('/email-not-verified');
                }

                this.setState({
                    isLoading: true
                });

                apiCategory.getItems()
                .then(categories => 
                    this.setState({
                        categories
                    })
                );

                apiConfig.appConfig.getItems({}, { cache: true })
                    .then(meta => this.setState({ meta }));


                const queryCategory = this.props.location.query ? this.props.location.query.category : null;

                setTimeout(() => {
                    this.updateResults({ category: queryCategory });
                }, 1100);
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
        
        apiTask.getItems({
            taskType: 1,
            status: '0',
            // lat: query.lat,
            // lng: query.lng,
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
        
        browserHistory.push(`/app?${serializeQueryObj(appliedFilter)}`);

        this.setState({ appliedFilter });
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
        <div className="st-welcome text-center" style={{ 
            background: `url(${this.state.meta.PROMO_URL}) no-repeat center center fixed`,
            backgroundSize: 'cover' 
        }}>
            <div className="col-xs-12" style={{ marginTop: 18 }}>
                <div style={{backgroundColor: this.state.meta.teaserBoxColor, padding: 10, maxWidth: '850px', margin: '0 auto' }}>
                    <h1 style={{
                        color: "white",
                        fontSize: 25
                    }}>
                        {translate('LISTINGS_PROMO_HEADER')}
                    </h1>
                    <h2 style={{ 
                        color: "white",
                        fontSize: 18
                    }}>
                        {translate('LISTINGS_PROMO_DESC')}
                    </h2>
                </div>
            </div>
        </div>;

        const SidebarContent =
        <div className="container hidden-xs">
            <div>
                <span style={{
                    fontWeight: !this.state.appliedFilter.category ? 'bold' : 'normal'
                }}    
                className="vq-category-main with-pointer" onClick={
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
                    }} className="vq-category-main with-pointer" onClick={
                    () => {
                        this.updateResults({ category: category.code }); 
                    }
                    }>{translate(category.code)}
                    </span>
                </div>    
            )
            }
        </div>;

        return (
            <div>

            {Intro}

            <div className="container custom-xs-style" style={{ marginTop: 10 }}>
                <div className="col-sm-4 col-md-4">
                    {SidebarContent}
                </div>
                        <div className="col-sm-8 col-md-8 custom-xs-style" >
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
                                <div className="text-center" style={{
                                    marginTop: '40px',
                                    height: 200
                                }}>
                                    <CircularProgress size={80} thickness={5} />
                                </div>
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
