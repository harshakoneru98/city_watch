import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import { Typography, Grid, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import SelectInput from '../../components/SelectInput/SelectInput';
import './Compare.scss';

export default function Compare() {
    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity1, setSelectedCity1] = useState<string>('');
    const [selectedCity2, setSelectedCity2] = useState<string>('');
    const [yearZipCodes1, setYearZipCodes1] = useState<any>([]);
    const [yearZipCodes2, setYearZipCodes2] = useState<any>([]);

    const [years1, setYears1] = useState<string[]>([]);
    const [selectedYear1, setSelectedYear1] = useState<string>('');
    const [zipCodes1, setZipCodes1] = useState<any[]>([]);
    const [selectedZipcode1, setSelectedZipcode1] = useState<any>();

    const [years2, setYears2] = useState<string[]>([]);
    const [selectedYear2, setSelectedYear2] = useState<string>('');
    const [zipCodes2, setZipCodes2] = useState<any[]>([]);
    const [selectedZipcode2, setSelectedZipcode2] = useState<any>();

    const { metaData, metaDataStatus, metaDataError } = useSelector(
        (state: RootState) => state.metaDataInfo
    );

    if (metaDataStatus === 'loading') {
        console.log('Meta Data Loading');
    }

    if (metaDataStatus === 'failed') {
        console.log(metaDataError);
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

    const handleCityChange = (city: string, selectInput: string) => {
        if (selectInput === 'city1') {
            setSelectedCity1(city);
        } else if (selectInput === 'city2') {
            setSelectedCity2(city);
        }
    };

    let postAxiosRequest = async (data: any, endpoint: string) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${endpoint}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const getCity1Data = async () => {
            if (selectedCity1) {
                try {
                    const response = await postAxiosRequest(
                        JSON.stringify({ city: selectedCity1 }),
                        'crime/get_yearly_zipcodes_info_by_city'
                    );
                    console.log('Selected City 1 : ', selectedCity1);
                    setYearZipCodes1(response.data);
                    let new_years = Object.keys(response.data);
                    new_years.sort((a, b) => b.localeCompare(a));
                    setYears1(new_years);
                    setSelectedYear1(new_years[0]);
                    let new_zip_codes = response.data[new_years[0]];
                    if (new_zip_codes.length != 1) {
                        new_zip_codes = ['All', ...new_zip_codes];
                    }
                    setZipCodes1(new_zip_codes);
                    setSelectedZipcode1(new_zip_codes[0]);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getCity1Data();
    }, [selectedCity1]);

    useEffect(() => {
        const getCity2Data = async () => {
            if (selectedCity2) {
                try {
                    const response = await postAxiosRequest(
                        JSON.stringify({ city: selectedCity2 }),
                        'crime/get_yearly_zipcodes_info_by_city'
                    );
                    console.log('Selected City 2 : ', selectedCity2);
                    setYearZipCodes2(response.data);
                    let new_years = Object.keys(response.data);
                    new_years.sort((a, b) => b.localeCompare(a));
                    setYears2(new_years);
                    setSelectedYear2(new_years[0]);
                    let new_zip_codes = response.data[new_years[0]];
                    if (new_zip_codes.length != 1) {
                        new_zip_codes = ['All', ...new_zip_codes];
                    }
                    setZipCodes2(new_zip_codes);
                    setSelectedZipcode2(new_zip_codes[0]);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getCity2Data();
    }, [selectedCity2]);

    const handleYearChange = (year: string, selectInput: string) => {
        if (selectInput === 'year1') {
            setSelectedYear1(year);
            let new_zip_codes = yearZipCodes1[year];
            if (new_zip_codes.length != 1) {
                new_zip_codes = ['All', ...new_zip_codes];
            }
            setZipCodes1(new_zip_codes);
            setSelectedZipcode1(new_zip_codes[0]);
        } else if (selectInput === 'year2') {
            setSelectedYear2(year);
            let new_zip_codes = yearZipCodes2[year];
            if (new_zip_codes.length != 1) {
                new_zip_codes = ['All', ...new_zip_codes];
            }
            setZipCodes2(new_zip_codes);
            setSelectedZipcode2(new_zip_codes[0]);
        }
    };

    const handleZipcodeChange = (zip: string, selectInput: string) => {
        if (selectInput === 'zip1') {
            setSelectedZipcode1(zip);
        } else if (selectInput === 'zip2') {
            setSelectedZipcode2(zip);
        }
    };

    useEffect(() => {
        if (selectedYear1) {
            console.log('Selected Year 1 : ', selectedYear1);
            console.log('Selected Zip code 1 : ', selectedZipcode1);
        }
    }, [zipCodes1, selectedZipcode1, selectedYear1]);

    useEffect(() => {
        if (selectedYear2) {
            console.log('Selected Year 2 : ', selectedYear2);
            console.log('Selected Zip code 2 : ', selectedZipcode2);
        }
    }, [zipCodes2, selectedZipcode2, selectedYear2]);

    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <div className="compare-container">
                    <Box bgcolor="white">
                        <Typography className="compare_header" variant="h4">
                            Compare Insights
                        </Typography>
                    </Box>

                    <Grid container bgcolor="white">
                        <Grid item xs={6}>
                            <div className="selectInputCompare">
                                <SelectInput
                                    data={cities}
                                    name="City 1"
                                    selectedValue={selectedCity1}
                                    onValChange={(city) =>
                                        handleCityChange(city, 'city1')
                                    }
                                />
                            </div>
                            {selectedCity1 && (
                                <Fragment>
                                    <div className="selectInputCompare">
                                        <SelectInput
                                            data={years1}
                                            name="Year 1"
                                            selectedValue={selectedYear1}
                                            onValChange={(year) =>
                                                handleYearChange(year, 'year1')
                                            }
                                        />
                                    </div>
                                    <div className="selectInputCompare">
                                        <SelectInput
                                            data={zipCodes1}
                                            name="Zipcode 1"
                                            selectedValue={selectedZipcode1}
                                            onValChange={(zip) =>
                                                handleZipcodeChange(zip, 'zip1')
                                            }
                                        />
                                    </div>
                                </Fragment>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <div className="selectInputCompare">
                                <SelectInput
                                    data={cities}
                                    name="City 2"
                                    selectedValue={selectedCity2}
                                    onValChange={(city) =>
                                        handleCityChange(city, 'city2')
                                    }
                                />
                            </div>
                            {selectedCity2 && (
                                <Fragment>
                                    <div className="selectInputCompare">
                                        <SelectInput
                                            data={years2}
                                            name="Year 2"
                                            selectedValue={selectedYear2}
                                            onValChange={(year) =>
                                                handleYearChange(year, 'year2')
                                            }
                                        />
                                    </div>
                                    <div className="selectInputCompare">
                                        <SelectInput
                                            data={zipCodes2}
                                            name="Zipcode 2"
                                            selectedValue={selectedZipcode2}
                                            onValChange={(zip) =>
                                                handleZipcodeChange(zip, 'zip2')
                                            }
                                        />
                                    </div>
                                </Fragment>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Fragment>
    );
}
