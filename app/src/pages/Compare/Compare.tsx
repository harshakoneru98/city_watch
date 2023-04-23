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
    const [yearZipCodes1, setYearZipCodes1] = useState<string[]>([]);
    const [yearZipCodes2, setYearZipCodes2] = useState<string[]>([]);

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
                setYearZipCodes1(response.data)
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
                setYearZipCodes2(response.data)
              } catch (error) {
                console.log(error);
              }
            }
          };
          getCity2Data();
    }, [selectedCity2]);

    useEffect(() => {
        if(yearZipCodes1){
            console.log('Year Zipcodes 1 : ', yearZipCodes1)
        }
    }, [yearZipCodes1])

    useEffect(() => {
        if(yearZipCodes2){
            console.log('Year Zipcodes 2 : ', yearZipCodes2)
        }
    }, [yearZipCodes2])

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

                    <Grid container bgcolor="white" className="compare-filters">
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
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Fragment>
    );
}
