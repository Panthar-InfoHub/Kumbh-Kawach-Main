'use client';
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';


// Helper: Decode an encoded polyline string into an array of LatLng objects : GPT helped here
const LIBRARIES = ['marker'];
function decodePolyline(encoded) {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += dlng;

        points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return points;
}

const GoogleMapTest = React.memo(({ location, updateFunction, status, mapType, locationHistory = [] }) => {

    // console.log("Location ==> ", location)
    // console.log("Location History ==> ", locationHistory)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Marker position gets updated every 5 seconds.
    const [markerPosition, setMarkerPosition] = useState(location);
    const [mapInstance, setMapInstance] = useState(null);


    const initialMarkerRef = useRef(null); // Marker that remains static.
    const updatedMarkerRef = useRef(null);


    // User first location : ** Don't change this dynamically or map component will reset after every 5 sec
    const [mapCenter] = useState(() => {

        // console.log(`Latitude : ${location.latitude} -- Longitude : ${location.longitude}`)
        if (!location) return { lat: 0, lng: 0 }
        if (!location?.latitude || !location?.longitude) {
            console.warn("Location not provided, using default coordinates");
            return { lat: 0, lng: 0 }; // Default to world center or your preferred location
        }
        const lat = Number(location.latitude);
        const lng = Number(location.longitude);

        if (isNaN(lat) || isNaN(lng)) {
            console.warn("Invalid coordinates, using default");
            return { lat: 0, lng: 0 };
        }

        return { lat, lng }

    });


    // State to hold the decoded polyline route
    const [routePath, setRoutePath] = useState([]);

    // Google Maps API is loaded or not
    const [googleLoaded, setGoogleLoaded] = useState(false);

    // Fetch computed route from Google Routes API given an array of waypoints : Output of this will be ==> Encoded data.
    const fetchGoogleRoute = async (waypoints) => {
        if (!Array.isArray(waypoints) || waypoints.length < 2) {
            console.error("fetchGoogleRoute: Invalid waypoints received:", waypoints);
            return null;
        }

        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
        const requestBody = {
            origin: { location: { latLng: { latitude: waypoints[0]?.latitude, longitude: waypoints[0]?.longitude } } },
            destination: { location: { latLng: { latitude: waypoints[waypoints.length - 1]?.latitude, longitude: waypoints[waypoints.length - 1]?.longitude } } },
            intermediates: waypoints.length > 2
                ? waypoints.slice(1, -1).map(point => ({
                    location: { latLng: { latitude: point?.latitude, longitude: point?.longitude } },
                }))
                : [],
            travelMode: "DRIVE",
            polylineEncoding: "ENCODED_POLYLINE",
            computeAlternativeRoutes: false,
        };


        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "routes.polyline.encodedPolyline"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            // console.log("Fetch Google route data ===> ", data)
            if (data.routes && data.routes.length > 0) {
                return data.routes[0].polyline.encodedPolyline;
            }
        } catch (error) {
            console.error("Error fetching route ==> ", error);
        }
        return null;
    };


    //Only to initialise Marker (Advance Marker) : Because dumbass google depricated the marker
    useEffect(() => {
        if (mapInstance && googleLoaded) {
            // Create the static initial marker (only once) at the fixed mapCenter.
            if (!initialMarkerRef.current) {
                // console.log("I am in Initial marker - 1")
                const initialLatLng = new window.google.maps.LatLng(locationHistory[0]?.latitude, locationHistory[0]?.longitude);
                const initialContent = document.createElement('div');
                const initialImg = document.createElement('img');
                initialImg.src = '/pin.png';
                initialImg.width = 82;
                initialImg.height = 100;
                initialContent.appendChild(initialImg);
                initialMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position: initialLatLng,
                    content: initialContent,
                });

                if (status === "Closed") {
                    const latest = locationHistory[locationHistory.length - 1];
                    const currentLatLng = new window.google.maps.LatLng(latest?.latitude, latest?.longitude);

                    // console.log("I am in update marker")
                    // console.log("First update marker")
                    const updatedContent = document.createElement('div');
                    const updatedImg = document.createElement('img');
                    updatedImg.src = '/pin.png';
                    updatedImg.width = 40;
                    updatedImg.height = 40;
                    updatedImg.style.filter = 'saturate(0.5) hue-rotate(180deg)';
                    updatedContent.appendChild(updatedImg);
                    updatedMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                        map: mapInstance,
                        position: currentLatLng,
                        content: updatedContent,
                    });
                }

                return;
            }

            // For the dynamic updated marker, use the last element of locationHistory.

            // console.log("Is array -> ", Array.isArray(locationHistory))
            // console.log("Length of array -> ", locationHistory.length)


            if (Array.isArray(locationHistory) && locationHistory.length > 0) {
                const latest = locationHistory[locationHistory.length - 1];
                const currentLatLng = new window.google.maps.LatLng(latest?.latitude, latest?.longitude);

                // console.log("I am in update marker")
                if (!updatedMarkerRef.current) {
                    // console.log("First update marker")
                    const updatedContent = document.createElement('div');
                    const updatedImg = document.createElement('img');
                    updatedImg.src = '/pin.png';
                    updatedImg.width = 40;
                    updatedImg.height = 40;
                    updatedImg.style.filter = 'saturate(0.5) hue-rotate(180deg)';
                    updatedContent.appendChild(updatedImg);
                    updatedMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                        map: mapInstance,
                        position: currentLatLng,
                        content: updatedContent,
                    });
                } else {

                    // console.log("Already updated marker")
                    // Update the position of the dynamic marker.
                    updatedMarkerRef.current.position = currentLatLng;
                }
            }
        }
    }, [mapInstance, googleLoaded, locationHistory]);

    // Refetch new location every 5 seconds. Key Highlight : we update markerPosition only,
    // leaving mapCenter unchanged so the user can move freely in the map.
    useEffect(() => {

        let intervalId

        if (status != "Closed" || process.env.NEXT_PUBLIC_MODE === "Development") {
            intervalId = setInterval(() => {
                updateFunction()
                    .then((newLocation) => {
                        // console.log("New location in use Effect ==> ", newLocation)
                        // {latitude: 25.4497723, longitude: 78.5692857, created_at: '2025-03-20T11:46:42+05:30'}
                        if (newLocation) {
                            setMarkerPosition(newLocation);
                        }
                    })
                    .catch((error) => console.error("Error fetching location:", error));
            }, 5000);
        }


        return () => clearInterval(intervalId);

    }, [updateFunction]);

    // When locationHistory changes, fetch the computed route and decode it.
    useEffect(() => {
        if (Array.isArray(locationHistory) && locationHistory.length > 1) {
            const recentWaypoints = locationHistory.slice(-15);
            fetchGoogleRoute(recentWaypoints).then((polyline) => {
                if (polyline) {
                    const cleanedPolyline = polyline.replace("enc:", "");
                    const decodedPath = decodePolyline(cleanedPolyline);
                    setRoutePath(decodedPath);
                }
            });
        } else {
            console.warn("locationHistory is empty or not an array ==>", locationHistory);
        }
    }, [locationHistory]);



    const handleMapLoad = (map) => {
        setMapInstance(map);
        setGoogleLoaded(true);
    };


    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={LIBRARIES} >
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100vh", position: "relative" }}
                center={mapCenter}
                zoom={18}
                onLoad={handleMapLoad}
                options={{
                    mapTypeId: mapType,
                    disableDefaultUI: true,
                    gestureHandling: 'greedy',
                    mapId: 'dd39d94a241f944bae2bdc36'
                }}
            >
                {routePath && routePath.length > 0 && (
                    <Polyline path={routePath} options={{
                        strokeColor: "#FF0000",
                        strokeOpacity: 1,
                        strokeWeight: 5,
                    }} />
                )}
            </GoogleMap>
        </LoadScript>
    );
});

export default GoogleMapTest;
