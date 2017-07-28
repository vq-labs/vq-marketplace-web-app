import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow, } from "react-google-maps";

const TaskMap = withGoogleMap(props => {
    const defaultCenter = props.markers.length ?
    props.markers[0].position :
    {
        lat: -25.363882,
        lng: 131.044922
    };

    return <GoogleMap
        ref={() => {}}
        defaultZoom={12}
        defaultCenter={defaultCenter}
        onClick={() => {}}
    >
        { props.markers
            .map(marker => 
            <Marker
                position={marker.position}
                key={marker.id}
                defaultAnimation={2}
                onClick={() => props.onMarkerClick(marker)}
            >
                {marker.showInfo &&
                <InfoWindow onMarkerClose={props.handleMarkerClose}>
                    {marker.infoBox}
                </InfoWindow>
                }
            </Marker>
            )
        }
    </GoogleMap>
});

export default TaskMap;
