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

    const [mapData, setMapData] = useState<any>();
    const [top5CrimeData, setTop5CrimeData] = useState<any>();

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
        console.log('Selected City : ', selectedCity);
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

    const get_top_5_crimes = (data: any) => {
        const aggregatedData = data.reduce((accumulator: any, current: any) => {
            current.forEach((data_type: any) => {
                const dataTypeName = Object.keys(data_type)[0];
                const dataTypeCount = data_type[dataTypeName];
                if (accumulator[dataTypeName]) {
                    accumulator[dataTypeName] += dataTypeCount;
                } else {
                    accumulator[dataTypeName] = dataTypeCount;
                }
            });
            return accumulator;
        }, {});

        const sortedData = Object.keys(aggregatedData)
            .map((dataName) => [
                { id: dataName, value: aggregatedData[dataName] }
            ])
            .flat()
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return sortedData;
    };

    useEffect(() => {
        if (crimeData.length != 0) {
            console.log('Crime Data : ', crimeData);
            const top_5_crimes_data = crimeData.map((obj) => obj.top5_crimes);
            setTop5CrimeData(get_top_5_crimes(top_5_crimes_data))
            let map_filtered_data = crimeData.map((obj) => ({
                zipCode: obj.zip_code,
                riskZone: obj.risk_zone,
                latitude: obj.latitude,
                longitude: obj.longitude
            }));
            setMapData(map_filtered_data);
        }
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

    const pieChartData = [
        { id: 'Los Angeles', value: 20 },
        { id: 'Pasedena', value: 30 },
        { id: 'Malibu', value: 50 },
        { id: 'Marina Del Rey', value: 10 },
        { id: 'La Canada Flintridge', value: 40 }
    ];

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
                    {crimeData.length > 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                {mapData && (
                                    <Map
                                        data={mapData}
                                        onValChange={handleZipcodeChange}
                                        selectedZipCode={selectedZipcode}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={4}>
                                {top5CrimeData && <PieChart data={top5CrimeData} />}
                            </Grid>
                            <Grid item xs={8}>
                                <LineChart />
                            </Grid>
                            <Grid item xs={4}>
                                <StackedBarChart />
                            </Grid>
                            <Grid item xs={4}>
                                <PieChart data={pieChartData} />
                            </Grid>
                            <Grid item xs={4}>
                                <PieChart data={pieChartData} />
                            </Grid>
                            <Grid item xs={4}>
                                <PieChart data={pieChartData} />
                            </Grid>
                        </Grid>
                    )}
                </div>
            </div>
        </Fragment>
    );
}
