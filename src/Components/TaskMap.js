import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ListingHeader from '../Components/ListingHeader';
import { compose } from "recompose";
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import { getConfigAsync } from '../core/config';
import COUNTRY_CODES  from '../constants/COUNTRIES';

const getLocation = cb => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => cb(null, position));
    } else {
        cb('Error');
    }
}

const TaskMapBuilt = compose(
    withGoogleMap
    )(props => {
        let defaultZoom = props.markers.length ? 12 : 4;

        const defaultCenter = props.markers.length ?
        props.markers[0].position :
        {
            lat: COUNTRY_CODES.find(country => country.value.toLowerCase() === props.country).lat,
            lng: COUNTRY_CODES.find(country => country.value.toLowerCase() === props.country).lng
        };

        return <GoogleMap
            ref={() => {}}
            defaultZoom={defaultZoom}
            defaultCenter={defaultCenter}
            onClick={() => {}}
        >
            { props.markers
                .map((marker, index) => 
                <Marker
                    position={marker.position}
                    key={index}
                    defaultAnimation={2}
                    onClick={() => props.onMarkerClick(marker)}
                >
                    {marker.showInfo &&
                    <InfoWindow
                        style={{
                            width: 500
                        }}
                        onMarkerClose={props.handleMarkerClose}>
                        {marker.infoBox}
                    </InfoWindow>
                    }
                </Marker>
                )
            }
        </GoogleMap>
    });

class TaskMap extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedMarker: {},
            listings: props.listings || [],
            markers: []
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config
            });
       
            getLocation((err, currentPosition) => {
                if (!err) {
                    this.setState({
                        currentPosition
                    });
                }
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            listings: nextProps.listings
        })
    } 

    render() {
        const listings = this.state.listings;
        
        const markers = listings
            .filter(_ => _.location)
            .map(_ => {
                _.position = {
                    lat: _.location.lat,
                    lng: _.location.lng
                };

                _.showInfo = _.id === this.state.selectedListingId;

                const offer = _;

                if (this.state.config)
                    _.infoBox = (
                    <div style={{ maxWidth: 300 }}>
                        <ListingHeader
                            hideCategories={true}
                            noPaddings={true}
                            hideDesc={true}
                            noColumns={true}
                            config={this.state.config}
                            task={offer}
                        />
                        
                        <RaisedButton
                            labelStyle={{color: 'white '}}
                            backgroundColor={this.state.config.COLOR_PRIMARY}
                            onClick={() => goTo(`/task/${offer.id}`)}
                            label={translate('GO_TO_LISTING')}
                        />
                    </div>
                    );

                return _;
            });

        return (
                <TaskMapBuilt
                    onMarkerClick={rSelectedMarker => {
                        this.setState({
                            selectedListingId: rSelectedMarker.id
                        });
                    }}
                    onMarkerClose={targetOffer => {
                        this.setState({
                            selectedListingId: null
                        })
                    }}
                    markers={
                        markers
                    }
                    country={this.state.config ? this.state.config.LISTING_GEOFILTER_COUNTRY_RESTRICTION : ''}
                    containerElement={
                        <div style={{ height: `100%` }} />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                />
        )}
    }

export default TaskMap;
