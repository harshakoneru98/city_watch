import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../components/SelectInput/SelectInput';
import Map from '../../components/Map/Map';
import map_riskzone from '../../assets/data/map_riskzone.json';
import './Dashboard.scss';

interface DashboardProps {
    defaultCity: string;
}

Dashboard.defaultProps = {
    defaultCity: 'Los Angeles'
};

Dashboard.propTypes = {
    defaultCity: PropTypes.string
};

export default function Dashboard({ defaultCity }: DashboardProps) {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>(defaultCity);
    const [zipCodes, setZipCodes] = useState<number[]>([]);
    const [selectedZipcode, setSelectedZipcode] = useState<number>();

    useEffect(() => {
        const uniqueCities = [
            ...new Set(map_riskzone.map((item) => item.primary_city))
        ].sort();
        setCities(uniqueCities);
    }, []);

    useEffect(() => {
        const selectedCityZipCodes = map_riskzone
            .filter((item) => item.primary_city === selectedCity)
            .map((item) => item.zip_code);
        setZipCodes(selectedCityZipCodes);
        console.log('Selected City : ', selectedCity);
    }, [selectedCity]);

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        setSelectedZipcode(undefined);
    };

    const handleZipcodeChange = (zip: number) => {
        setSelectedZipcode(zip);
    };

    useEffect(() => {
        console.log('Selected Zipcode : ', selectedZipcode);
    }, [selectedZipcode]);

    return (
        <Fragment>
            <div className="container">
                <div className="selectInputContainer selectInputRight">
                    <SelectInput
                        data={cities}
                        name="City"
                        defaultValue={defaultCity}
                        onValChange={handleCityChange}
                    />
                </div>
                <div className="selectInputContainer">
                    <SelectInput
                        data={zipCodes}
                        name="Zipcode"
                        onValChange={handleZipcodeChange}
                    />
                </div>
            </div>
            {/* <Map /> */}
        </Fragment>
    );
}
