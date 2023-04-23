import { Fragment, useEffect, useState } from 'react';
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

    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity1, setSelectedCity1] = useState<string>('');
    const [selectedCity2, setSelectedCity2] = useState<string>('');

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

    useEffect(() => {
        console.log('Selected City 1 : ', selectedCity1);
    }, [selectedCity1]);

    useEffect(() => {
        console.log('Selected City 2 : ', selectedCity2);
    }, [selectedCity2]);

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
