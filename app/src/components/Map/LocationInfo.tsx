import './LocationInfo.scss'

interface DataProps {
    zip_code: string;
    risk_zone: string;
    latitude: number;
    longitude: number;
}

export default function LocationInfo({
    zip_code,
    risk_zone,
    latitude,
    longitude
}: DataProps) {
    return (
        <div className="location-info">
            <h2>Location Info</h2>
            <ul>
                <li>
                    Zip: <strong>{zip_code}</strong>
                </li>
                <li>
                    Risk Zone: <strong>{risk_zone}</strong>
                </li>
                <li>
                    Latitude: <strong>{latitude}</strong>
                </li>
                <li>
                    Longitude: <strong>{longitude}</strong>
                </li>
            </ul>
        </div>
    );
}
