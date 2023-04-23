import { Fragment, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import './Compare.scss';
import { Typography, Grid, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

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

                    <Grid container direction="column">
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}></Grid>
                    </Grid>
                </div>
            </div>
        </Fragment>
    );
}
