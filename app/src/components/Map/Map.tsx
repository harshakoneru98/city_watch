import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import './Map.scss'
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
    console.log('Data : ', map_riskzone)

    const locations = [
        { lat: 34.0522, lng: -118.2437 },
        { lat: 34.0769, lng: -118.3768 },
      ];
    
      const renderMarkers = (map: any, maps: any) => {
        for (let i = 0; i < locations.length; i++) {
          const location = locations[i];
    
          new maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map,
            center: location,
            radius: 3000,
          });
        }
      };

    return (
        <div className='map-container'>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: apiKey
                }}
                center={center}
                zoom={zoom}
                onGoogleApiLoaded={({ map, maps }: any) => renderMarkers(map, maps)}
            ></GoogleMapReact>
        </div>
    );
}
