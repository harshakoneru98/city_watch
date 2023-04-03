import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import './Map.scss';
import map_riskzone from '../../assets/data/map_riskzone.json';

interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
    apiKey: string;
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

export default function Map({ center, zoom, apiKey }: MapProps) {
    const getRiskZone = (zip_code_info: any) => {
        const center = {
            lat: zip_code_info['latitude'],
            lng: zip_code_info['longitude']
        }

        if (zip_code_info['risk_zone'] === 'Low Risk Zone'){
            return {
                color: '#007500',
                center: center
            }
        }else if (zip_code_info['risk_zone'] === 'Moderate Risk Zone'){
            return {
                color: '#FFA500',
                center: center
            }
        }else {
            return {
                color: '#FF0000',
                center: center
            }
        }
    }

    const renderMarkers = (map: any, maps: any) => {
        for (let i = 0; i < map_riskzone.length; i++) {
            const {color, center} = getRiskZone(map_riskzone[i])

            new maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.75,
                map,
                center: center,
                radius: 1000
            });
        }
    };

    return (
        <div className="map-container">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: apiKey
                }}
                center={center}
                zoom={zoom}
                onGoogleApiLoaded={({ map, maps }: any) =>
                    renderMarkers(map, maps)
                }
            ></GoogleMapReact>
        </div>
    );
}
