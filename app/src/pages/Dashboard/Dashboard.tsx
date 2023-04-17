import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../components/SelectInput/SelectInput';
import Map from '../../components/Map/Map';
import map_riskzone from '../../assets/data/map_riskzone.json';
import './Dashboard.scss';
import LineChart from '../../components/LineChart/LineChart';
import PieChart from '../../components/PieChart/PieChart';
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import Header from '../../components/Header/Header';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import { fetchZipDataInfoData } from '../../store/slices/zipdataSlice';
import { fetchCrimeDataInfoData } from '../../store/slices/crimedataSlice';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

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
    let city_located = localStorage.getItem('city') || defaultCity;
    city_located = city_located === 'Other City' ? defaultCity : city_located;

    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>(city_located);
    const [zipYearData, setZipYearData] = useState<any>();
    const [years, setYears] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [zipCodes, setZipCodes] = useState<any[]>([]);
    const [selectedZipcode, setSelectedZipcode] = useState<any>();

    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const { metaData, metaDataStatus, metaDataError } = useSelector(
        (state: RootState) => state.metaDataInfo
    );

    if (metaDataStatus === 'loading') {
        console.log('Meta Data Loading');
    }

    if (metaDataStatus === 'failed') {
        console.log(metaDataError);
    }

    const { zipData, zipDataStatus, zipDataError } = useSelector(
        (state: RootState) => state.zipDataInfo
    );

    if (zipDataStatus === 'loading') {
        console.log('ZipData Loading');
    }

    if (zipDataError === 'failed') {
        console.log(zipDataError);
    }

    const { crimeData, crimeDataStatus, crimeDataError } = useSelector(
        (state: RootState) => state.crimeDataInfo
    );

    if (crimeDataStatus === 'loading') {
        console.log('CrimeData Loading');
    }

    if (crimeDataError === 'failed') {
        console.log(crimeDataError);
    }

    useEffect(() => {
        if (metaData.length) {
            const cities = [
                ...new Set(metaData.map((obj: any) => obj.primary_city))
            ].sort();
            setCities(cities);
        } else {
            dispatch(fetchMetaDataInfoData('crime/get_metadata_info/'));
        }
    }, [metaData]);

    useEffect(() => {
        console.log('Selected City : ', selectedCity)
        if (selectedCity) {
            dispatch(
                fetchZipDataInfoData({
                    endpoint: 'crime/get_yearly_zipcodes_info_by_city',
                    city: selectedCity
                })
            );
        }
    }, [selectedCity]);

    useEffect(() => {
        if (zipData.data) {
            setZipYearData(zipData.data);
            let new_years = Object.keys(zipData.data);
            new_years.sort((a, b) => b.localeCompare(a));
            setYears(new_years);
            setSelectedYear(new_years[0]);
            let new_zip_codes = zipData.data[new_years[0]];
            if (new_zip_codes.length != 1) {
                new_zip_codes = ['All', ...new_zip_codes];
            }
            setZipCodes(new_zip_codes);
            setSelectedZipcode(new_zip_codes[0]);
        }
    }, [zipData]);

    useEffect(() => {
        if (selectedYear) {
            let new_zip_codes_api = [];
            if (selectedZipcode === 'All') {
                new_zip_codes_api = zipCodes.filter((elem) => elem !== 'All');
            } else {
                new_zip_codes_api = [selectedZipcode];
            }
            dispatch(
                fetchCrimeDataInfoData({
                    endpoint: 'crime/get_crimedata_info_by_year_zipcode',
                    year: selectedYear,
                    zipcodes: new_zip_codes_api
                })
            );
        }
    }, [zipCodes, selectedZipcode, selectedYear]);

    useEffect(() => {
        console.log('Crime Data : ', crimeData);
    }, [crimeData]);

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        let new_zip_codes = zipYearData[year];
        if (new_zip_codes.length != 1) {
            new_zip_codes = ['All', ...new_zip_codes];
        }
        setZipCodes(new_zip_codes);
        setSelectedZipcode(new_zip_codes[0]);
    };

    const handleZipcodeChange = (zip: string) => {
        setSelectedZipcode(zip);
    };

    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <div className="dashboard-container">
                    <div className="filter-container">
                        <div className="selectInputContainer selectInputRight">
                            <SelectInput
                                data={cities}
                                name="City"
                                defaultValue={city_located}
                                onValChange={handleCityChange}
                            />
                        </div>
                        <div className="selectInputContainer">
                            <SelectInput
                                data={years}
                                name="Year"
                                selectedValue={selectedYear}
                                onValChange={handleYearChange}
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
                    {/* <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Map
                                data={filteredData}
                                onValChange={handleZipcodeChange}
                                selectedZipCode={selectedZipcode}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <PieChart />
                        </Grid>
                        <Grid item xs={8}>
                            <LineChart />
                        </Grid>
                        <Grid item xs={4}>
                            <StackedBarChart />
                        </Grid>
                        <Grid item xs={4}>
                            <PieChart />
                        </Grid>
                        <Grid item xs={4}>
                            <PieChart />
                        </Grid>
                        <Grid item xs={4}>
                            <PieChart />
                        </Grid>
                    </Grid> */}
                </div>
            </div>
        </Fragment>
    );
}
