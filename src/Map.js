import React, { Fragment, useEffect } from 'react';
import './Map.css';
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from './Util';

function UpdateMapCenter({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom)
    }, [center, zoom])
    return (<Fragment />)
}


function Map({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom} >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

                />
                <UpdateMapCenter center={center} zoom={zoom}/>
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    );
}

export default Map