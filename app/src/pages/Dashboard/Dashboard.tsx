import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../components/SelectInput/SelectInput';
import Map from '../../components/Map/Map';
import map_riskzone from '../../assets/data/map_riskzone.json';

interface DashboardProps {
    defaultCity: string
}

Dashboard.defaultProps = {
    defaultCity: 'Los Angeles'
};

Dashboard.propTypes = {
    defaultCity: PropTypes.string
};

export default function Dashboard({defaultCity}: DashboardProps) {
    // console.log('Data : ', map_riskzone)
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>(defaultCity);

    useEffect(() => {
        const uniqueCities = [
            ...new Set(map_riskzone.map((item) => item.primary_city))
        ].sort();
        setCities(uniqueCities);
    }, []);

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
    };

    useEffect(() => {
        console.log('Selected City : ', selectedCity)
    }, [selectedCity])

    return (
        <Fragment>
            <SelectInput data={cities} name="City" defaultValue={defaultCity} onValChange={handleCityChange}/>
            {/* <Map /> */}
        </Fragment>
    );
}
