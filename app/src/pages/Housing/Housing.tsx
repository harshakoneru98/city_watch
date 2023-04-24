import { Fragment, useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import AutoComplete from '../../components/AutoComplete/AutoComplete';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchHousingCitiesDataInfoData } from '../../store/slices/housingcitiesdataSlice';
import { fetchHousingDataInfoData } from '../../store/slices/housingdataSlice';
import { Button, Grid, Typography } from '@mui/material';
import RangeSlider from '../../components/RangeSlider/RangeSlider';
import SingleSlider from '../../components/SingleSlider/SingleSlider';
import './Housing.scss';
import HousingTable from '../../components/HousingTable/HousingTable';

export default function Housing() {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>();
    const [priceRange, setPriceRange] = useState<[number, number]>([100, 1000]);
    const [areaRange, setAreaRange] = useState<number>(1000);

    const [housingData, setHousingData] = useState<any>({});

    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    useEffect(() => {
        setHousingData({});
    }, []);

    const {
        housingCitiesData,
        housingCitiesDataStatus,
        housingCitiesDataError
    } = useSelector((state: RootState) => state.housingCitiesDataInfo);

    if (housingCitiesDataStatus === 'loading') {
        console.log('Housing City Data Loading');
    }

    if (housingCitiesDataError === 'failed') {
        console.log(housingCitiesDataError);
    }

    const { housingInfoData, housingInfoDataStatus, housingInfoDataError } =
        useSelector((state: RootState) => state.housingDataInfo);

    if (housingInfoDataStatus === 'loading') {
        console.log('Housing Data Loading');
    }

    if (housingInfoDataError === 'failed') {
        console.log(housingInfoDataError);
    }

    useEffect(() => {
        if (housingCitiesData.length) {
            setCities(housingCitiesData);
        } else {
            dispatch(
                fetchHousingCitiesDataInfoData(
                    'housing/get_housing_cities_info/'
                )
            );
        }
    }, [housingCitiesData]);

    const handleCityChange = (cities: string[]) => {
        setSelectedCities(cities);
    };

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value);
    };

    const handleAreaRangeChange = (value: number) => {
        setAreaRange(value);
    };

    const handleGetResults = () => {
        let cities_selected = selectedCities ? selectedCities : ['Los Angeles'];
        handleCityChange(cities_selected);
        dispatch(
            fetchHousingDataInfoData({
                endpoint: 'housing/get_housing_recommendation_info',
                cities: cities_selected,
                persqrt_range: priceRange.map(
                    (item) => (item * 1000) / areaRange
                )
            })
        );
    };

    useEffect(() => {
        if (housingInfoData.data) {
            console.log('Housing Data : ', housingInfoData.data);
            setHousingData(housingInfoData.data);
        }
    }, [housingInfoData]);

    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <div className="housing-container">
                    <Fragment>
                        <Grid
                            container
                            bgcolor="white"
                            className="housing_header"
                        >
                            <Grid item xs={12} className="header_grid">
                                <Typography variant="h4">
                                    Let's Find Your Next Home Together
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            className="housing_summary"
                            bgcolor="white"
                        >
                            <Grid item xs={2}>
                                <div className="girdItemCenter">
                                    <AutoComplete
                                        data={cities}
                                        selectedValues={selectedCities}
                                        onSelectionChange={handleCityChange}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="sliderContainer girdItemCenter">
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Typography
                                                className="housing_filter_header"
                                                variant="h6"
                                            >
                                                Price Range
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <RangeSlider
                                                min_value={100}
                                                max_value={1000}
                                                step={100}
                                                min={100}
                                                max={1000}
                                                alias="k"
                                                onValChange={
                                                    handlePriceRangeChange
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="sliderContainer girdItemCenter">
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Typography
                                                className="housing_filter_header"
                                                variant="h6"
                                            >
                                                House Area
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <SingleSlider
                                                defaultValue={500}
                                                step={500}
                                                min={500}
                                                max={5000}
                                                alias="sqft"
                                                onValChange={
                                                    handleAreaRangeChange
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div className="girdItemCenter">
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2, width: 150 }}
                                        onClick={handleGetResults}
                                    >
                                        Get Results
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                        {housingData.length && (
                            <HousingTable
                                data={housingData}
                                sqrt_selected={areaRange}
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
}
