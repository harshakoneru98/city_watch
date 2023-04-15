import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../components/SelectInput/SelectInput';
import Map from '../../components/Map/Map';
import map_riskzone from '../../assets/data/map_riskzone.json';
import './Dashboard.scss';
import LineChart from '../../components/LineChart/LineChart';
import PieChart from '../../components/PieChart/PieChart';
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import BarChart from '../../components/BarChart/BarChart';
import Header from '../../components/Header/Header';

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
    const [zipCodes, setZipCodes] = useState<any[]>([]);
    const [selectedZipcode, setSelectedZipcode] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>([]);

    useEffect(() => {
        const uniqueCities = [
            ...new Set(map_riskzone.map((item) => item.primary_city))
        ].sort();
        setCities(uniqueCities);
    }, []);

    useEffect(() => {
        const selectedCityZipCodes = map_riskzone.filter(
            (item) => item.primary_city === selectedCity
        );
        
        setFilteredData(selectedCityZipCodes);
        if (selectedCityZipCodes.length == 1){
            setZipCodes(selectedCityZipCodes.map((item) => item.zip_code))
            setSelectedZipcode(selectedCityZipCodes[0].zip_code)
        }else{
            setZipCodes(["All", ...selectedCityZipCodes.map((item) => item.zip_code)]);
            setSelectedZipcode('All')
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedZipcode) {
            let filterzipData = map_riskzone.filter(
                (item) => item.primary_city === selectedCity
            );
            if(selectedZipcode != 'All'){
                filterzipData = filterzipData.filter(
                    (item: any) => item.zip_code === selectedZipcode
                );
            }
            setFilteredData(filterzipData);
        }
    }, [selectedZipcode]);

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        setSelectedZipcode(undefined);
    };

    const handleZipcodeChange = (zip: number) => {
        setSelectedZipcode(zip);
    };

    return (
        <Fragment>
            <Header />
            <div className="filter-container">
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
                        selectedValue={selectedZipcode}
                        onValChange={handleZipcodeChange}
                    />
                </div>
            </div>
            <Map data={filteredData} onValChange={handleZipcodeChange} selectedZipCode={selectedZipcode}/>
            <LineChart />
            <PieChart />
            <StackedBarChart />
            <BarChart />
        </Fragment>
    );
}
