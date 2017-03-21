import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import TaskCard from '../Components/TaskCard';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Autocomplete from 'react-google-autocomplete';
import { serializeQueryObj, formatGeoResults } from '../core/util';
import { translate } from '../core/i18n';

import apiTask from '../api/task';
import * as apiConfig from '../api/config';
import * as apiCategory from '../api/category';

import '../App.css';

const _chunk = require('lodash.chunk');



class Offers extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.displayPrice = this.displayPrice.bind(this); 
        this.displayTitle = this.displayTitle.bind(this);
    }
    componentDidMount() {
        this.setState({ isLoading: true });

        apiCategory.getItems().then(categories => this.setState({ categories }));
        apiConfig.meta.getItems().then(meta => this.setState({ meta: meta[0] }))

        this.loadTasks(this.props.location.query);
    }
    displayIconElement (offer) {
        if(offer && offer.location && offer.location.formattedAddress){
            return <MapsPlace viewBox='-20 -7 50 10' />;
        }else{
            return (
                <FileCloud viewBox='-20 -7 50 10'/>);
        }
    };
    
displayPrice (offer) {
    let label = String((offer.price / 100 ).toFixed(0)) + '€';
        
    if (offer.priceType===0) {
        label += " pro Auftrag";
    } else {
        label += " pro Stunde";
    }

    return label;
}

displayLocation (task) {
    if (task.location) {
        return task.location.formattedAddress || 'Online';
    } else {
        return 'Online';
    }  
}

displayTitle (title) {
    if (title.length > 24) {
        return title.substring(0, 23) + '...';
    }

    return title;
}

loadTasks(query) {
    this.setState({
        isLoading: true
    });
    
    apiTask.getItems({
        task_type: 1,
        status: 'ACTIVE',
        lat: query.lat,
        lng: query.lng,
        category: query.category
    })
    .then(offers => {
        this.setState({
            isLoading: false,
            offers: offers,
            offersChunks: _chunk(offers, 3)
        });
    });
}
    
    searchUpdated (term) {
        this.setState({searchTerm: term})
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

    render() {
        return (
            <div>
            <div className="st-welcome text-center">
                <div className="col-xs-12" style={ { marginTop: 30 } }>
                    <h1 style={ { color: "white", fontSize: 35 } }>
                        {this.state.meta.slogan}
                    </h1>
                    <h2 style={ { color: "white", fontSize: 20 } }>
                        {this.state.meta.desc}
                    </h2>
                </div>
            </div>
            <div className="container custom-xs-style" style={ { marginTop: 10 } }> 
                <div className="col-sm-4 col-md-4">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-10 col-lg-10"  style={{'marginTop': '12px'}}>
                        <TextField children={
                            <Autocomplete  
                                placeholder="PLZ / Ort"
                                style={{'width': '100%','fontSize':'16px'}}
                                types={['(regions)']}
                                onPlaceSelected={ place => {
                                    var location = formatGeoResults([place])[0];
                                    this.updateResults({ lat: location.lat, lng: location.lng});
                                }} />}
                        />
                    </div>

                    <div className="col-xs-1 col-sm-2 col-md-1 col-lg-1">     
                                    <IconMenu
                                    iconButtonElement={
                                    <IconButton><MoreVertIcon /></IconButton>
                                    }
                                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                        className='menuIconStyle'>
                                                <MenuItem primaryText="Aufgaben in Berlin" onClick={ () => {this.updateResults(52.52000659999999, 13.404953999999975);}} />
                                                <MenuItem primaryText="Aufgaben in Frankfurt am Main" onClick={ () => {this.updateResults(50.11092209999999, 8.682126700000026);}} />
                                                <MenuItem primaryText="Aufgaben in Heidelberg" onClick={ () => {this.updateResults(49.3987524, 8.672433500000011 );}} />
                                                <MenuItem primaryText="Aufgaben in Mannheim" onClick={ () => {this.updateResults(49.4874592, 8.466039499999965 );}}/>
                                                <MenuItem primaryText="Aufgaben in München" onClick={ () => {this.updateResults(48.1351253, 11.581980599999952  ); }}/>
                                                <MenuItem primaryText="Aufgaben in stuttgart" onClick={ () => {this.updateResults(48.7758459, 9.182932100000016  );}}/>
                                                <MenuItem primaryText="Aufgaben in Walldorf" onClick={ () => {this.updateResults(49.3063689, 8.642769300000054);}}/>
                                                <MenuItem primaryText="Aufgaben in Köln" onClick={ () => {this.updateResults(50.937531, 6.960278600000038   );}}/>                 
                                        </IconMenu>
                    </div>
                    </div>
                    <div className="row hidden-xs">
                        <div>
                            <span 
                            style={
                                {
                                    fontWeight: !this.state.appliedFilter.category ? 'bold' : 'normal'
                                }
                            }    
                            className="vq-category-main with-pointer" onClick={
                                () => {
                                    this.updateResults({ category: null }); 
                                 }
                            }>
                             { translate('ALL_CATEGORIES') }
                            </span>
                        </div>
                        {  
                            this.state.categories && 
                            this.state.categories.map((category, index) =>
                               <div>
                                    <span style={
                                        {
                                            fontWeight: this.state.appliedFilter.category === category.code ? 'bold' : 'normal'
                                        }
                                    } className="vq-category-main with-pointer" onClick={
                                        () => {
                                           this.updateResults({ category: category.code }); 
                                        }
                                    }>{translate(category.code)}
                                    </span>
                               </div>    
                            )
                        }
                        <div className="col-xs-12">

                        </div>
                        
                        </div>
                        </div>
                        <div className="col-sm-8 col-md-8 custom-xs-style" >
                                { this.state.isLoading && 
                                    <div className="text-center" style={{ 'marginTop': '40px' }}>
                                            <CircularProgress size={80} thickness={5} />
                                    </div>
                                }
                                {  
                                    !this.state.isLoading && this.state.offersChunks && 
                                    this.state.offersChunks.map((offerRow, index) => 
                                        <div className="row">
                                            { this.state.offersChunks[index].map(offer =>
                                                <div className="col-xs-12 col-sm-4" style={ { marginBottom: 10} }>
                                                    <TaskCard task={offer} displayPrice={true} key={offer._id}  />
                                                </div>
                                            )}
                                        </div>
                                    )

                                }
                        </div>
            </div>
            </div>
        );
    }
}

export default Offers;
