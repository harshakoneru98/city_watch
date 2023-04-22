import { Fragment, useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import SelectInput from '../../components/SelectInput/SelectInput';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchHousingCitiesDataInfoData } from '../../store/slices/housingcitiesdataSlice';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import RangeSlider from '../../components/RangeSlider/RangeSlider';
import './Housing.scss';

export default function Housing() {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>();
    const [priceRange, setPriceRange] = useState<[number, number]>([100, 1000]);
    const [areaRange, setAreaRange] = useState<[number, number]>([1000, 10000]);

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

    const handleAreaRangeChange = (value: [number, number]) => {
        setAreaRange(value);
    };

    const handleGetResults = () => {
      console.log("Selected City : ", selectedCity);
      console.log("Price Range : ", priceRange);
      console.log("Area Range : ", areaRange);
    };

    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <div className="housing-container">
                    <div className="filter-container">
                        <Grid
                            container
                            spacing={2}
                            className="housing_summary"
                            bgcolor="white"
                        >
                            <Grid item xs={2}>
                                <div className="selectInputContainer girdItemCenter">
                                    <SelectInput
                                        data={cities}
                                        name="City"
                                        selectedValue={selectedCity? selectedCity : 'All Cities'}
                                        onValChange={handleCityChange}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="sliderContainer girdItemCenter">
                                    <RangeSlider
                                        min_value={100}
                                        max_value={1000}
                                        step={100}
                                        min={100}
                                        max={1000}
                                        alias="k"
                                        onValChange={handlePriceRangeChange}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="sliderContainer girdItemCenter">
                                    <RangeSlider
                                        min_value={1000}
                                        max_value={10000}
                                        step={1000}
                                        min={1000}
                                        max={10000}
                                        alias="sqft"
                                        onValChange={handleAreaRangeChange}
                                    />
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
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
