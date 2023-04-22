import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import SelectInput from '../../components/SelectInput/SelectInput';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchHousingCitiesDataInfoData } from '../../store/slices/housingcitiesdataSlice';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RangeSlider from '../../components/RangeSlider/RangeSlider';
import SingleSlider from '../../components/SingleSlider/SingleSlider';
import './Housing.scss';

interface HousingProps {
  defaultCity: string;
}

Housing.defaultProps = {
  defaultCity: 'All Cities'
};

Housing.propTypes = {
  defaultCity: PropTypes.string
};

export default function Housing({defaultCity}: HousingProps) {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>(defaultCity);
    const [priceRange, setPriceRange] = useState<[number, number]>([100, 1000]);
    const [areaRange, setAreaRange] = useState<number>(1000);

    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

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

    useEffect(() => {
        if (housingCitiesData.length) {
            setCities(['All Cities', ...housingCitiesData]);
        } else {
            dispatch(
                fetchHousingCitiesDataInfoData(
                    'housing/get_housing_cities_info/'
                )
            );
        }
    }, [housingCitiesData]);

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
    };

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value);
    };

    const handleAreaRangeChange = (value: number) => {
        setAreaRange(value);
    };

    const handleGetResults = () => {
        console.log('Selected City : ', selectedCity);
        console.log('Price Range : ', priceRange);
        console.log('Area Range : ', areaRange);
    };

    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <div className="housing-container">
                    <Fragment>
                        <Grid container bgcolor="white" className='housing_header'>
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
                                <div className="selectInputContainer girdItemCenter">
                                    <SelectInput
                                        data={cities}
                                        name="City"
                                        selectedValue={
                                            selectedCity
                                                ? selectedCity
                                                : defaultCity
                                        }
                                        onValChange={handleCityChange}
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
                                                defaultValue={1000}
                                                step={1000}
                                                min={1000}
                                                max={10000}
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
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
}
