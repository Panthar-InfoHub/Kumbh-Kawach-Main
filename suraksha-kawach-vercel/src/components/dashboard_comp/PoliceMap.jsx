'use client';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';

const policePriorityInfo = (priority) => {
    if (priority >= 6) {
        return { color: "#dc2626", border: "#fee2e2" }; // red
    } else if (priority >= 3) {
        return { color: "#d97706", border: "#fef3c7" }; // amber
    } else {
        return { color: "#2563eb", border: "#dbeafe" }; // blue
    }
};
// Helper: Decode an encoded polyline string into an array of LatLng objects : GPT helped here
const LIBRARIES = ['marker'];

const PoliceMap = React.memo(({ points = [] }) => {
    console.debug("Points in PoliceMap: ", points);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Marker position gets updated every 5 seconds.
    const [mapInstance, setMapInstance] = useState(null);

    // User first location : ** Don't change this dynamically or map component will reset after every 5 sec
    const [mapCenter] = useState({
        lat: points[0]?.location_data[0]?.latitude || 25.448597673303105,
        lng: points[0]?.location_data[0]?.longitude || 78.56976152160085,
    });


    // Google Maps API is loaded or not
    const markerRefs = useRef([]);
    const [googleLoaded, setGoogleLoaded] = useState(false);


    //Only to initialise Marker (Advance Marker) : Because dumbass google depricated the marker
    useEffect(() => {
        if (mapInstance && googleLoaded && points.length) {

            markerRefs.current.forEach(marker => {
                if (marker && marker.map) marker.map = null;
            });
            markerRefs.current = [];

            points.forEach((point) => {
                const latestLocation = point.location_data[point.location_data.length - 1];
                const position = new window.google.maps.LatLng(latestLocation.latitude, latestLocation.longitude);

                const { color, border } = policePriorityInfo(point.ticket_priority || 1); // use priority from point

                const content = document.createElement('div');
                content.style.width = '48px';
                content.style.height = '48px';
                content.style.border = `3px solid ${color}`;
                content.style.borderRadius = '50%';
                content.style.overflow = 'hidden';
                content.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
                content.style.backgroundColor = border;

                // Load profile image
                const img = document.createElement('img');
                img.src = point.user?.photoURL || '/default-profile.png';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';

                content.appendChild(img);

                const marker = new window.google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position,
                    content,
                });
                markerRefs.current.push(marker);
            });
        }
    }, [mapInstance, googleLoaded, points]);


    const handleMapLoad = (map) => {
        setMapInstance(map);
        setGoogleLoaded(true);
    };


    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={LIBRARIES} >
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%", position: "relative" }}
                center={mapCenter}
                zoom={18}
                onLoad={handleMapLoad}
                options={{
                    mapTypeId: "terrain",
                    disableDefaultUI: true,
                    gestureHandling: 'greedy',
                    mapId: '18326da18fa85f93'
                }}
            >
            </GoogleMap>
        </LoadScript>
    );
});

export default PoliceMap;
