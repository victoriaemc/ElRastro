import React, { useRef, useEffect } from "react";
import { Card } from 'react-bootstrap';

const ProductLocation = ({ latitude, longitude }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const loadMap = () => {
            const mapOptions = {
                center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                zoom: 13,
            };

            const map = new window.google.maps.Map(mapRef.current, mapOptions);

            new window.google.maps.Marker({
                position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                map: map,
                title: "Product Location",
            });
        };

        // Check if the Google Maps script is already loaded
        if (window.google && window.google.maps) {
            loadMap();
        } else {
            // If not, wait for the script to be loaded
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDGVdzguPEa5nanlBOLCoHdjcVgMEuNscY&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.head.appendChild(script);
        }
    }, [latitude, longitude]);

    return (
        <Card.Body>
            <div
                ref={mapRef}
                style={{ height: "300px", width: "100%", marginBottom: "10px" }}
            />
        </Card.Body>
    );
};

export default ProductLocation;
