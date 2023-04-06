import { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import './Map.scss';

interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
    apiKey: string;
    data: any[];
}

Map.defaultProps = {
    center: {
        lat: 34.052235,
        lng: -118.243683
    },
    zoom: 10,
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY
};

Map.propTypes = {
    center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
    }),
    zoom: PropTypes.number,
    apiKey: PropTypes.string
};

export default function Map({ center, zoom, apiKey, data }: MapProps) {
    const [googleApiObj, setIsGoogleApiLoadedObj] = useState<any>(null);
    const [circles, setCircles] = useState<any[]>([]);

    const getRiskZone = (zip_code_info: any) => {
        const center = {
            lat: zip_code_info['latitude'],
            lng: zip_code_info['longitude']
        };

        if (zip_code_info['risk_zone'] === 'Low Risk Zone') {
            return {
                color: '#007500',
                center: center
            };
        } else if (zip_code_info['risk_zone'] === 'Moderate Risk Zone') {
            return {
                color: '#FFA500',
                center: center
            };
        } else {
            return {
                color: '#FF0000',
                center: center
            };
        }
    };

    const renderMarkers = (map: any, maps: any) => {
        const newCircles = [];

        for (let i = 0; i < data.length; i++) {
            const { color, center } = getRiskZone(data[i]);

            const circle = new maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.75,
                map,
                center: center,
                radius: 1000
            });

            newCircles.push(circle);
        }

        setCircles(newCircles);
    };

    useEffect(() => {
        if (googleApiObj && data) {
            const { map, maps } = googleApiObj;

            // Remove previous circles
            circles.forEach((circle) => {
                circle.setMap(null);
            });

            // Add new circles
            renderMarkers(map, maps);
        }
    }, [googleApiObj, data]);

    return (
        <div className="map-container">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: apiKey
                }}
                center={center}
                zoom={zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) =>
                    setIsGoogleApiLoadedObj({ map, maps })
                }
            ></GoogleMapReact>
        </div>
    );
}
