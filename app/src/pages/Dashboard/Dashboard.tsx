import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../components/SelectInput/SelectInput';
import Map from '../../components/Map/Map';
import './Dashboard.scss';
import LineChart from '../../components/LineChart/LineChart';
import PieChart from '../../components/PieChart/PieChart';
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import Header from '../../components/Header/Header';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import { fetchZipDataInfoData } from '../../store/slices/zipdataSlice';
import { fetchCrimeDataInfoData } from '../../store/slices/crimedataSlice';
import { fetchTop5CrimeDataInfoData } from '../../store/slices/topcrimedataSlice';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import BarChart from '../../components/BarChart/BarChart';

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
    const [top5Ethnicity, setTop5Ethnicity] = useState<any>();
    const [top5Gender, setTop5Gender] = useState<any>();
    const [ageDistribution, setAgeDistribution] = useState<any>();

    const [montlyFrequency, setMontlyFrequency] = useState<any>();
    const [weeklyFrequency, setWeeklyFrequency] = useState<any>();
    const [crimeFrequency, setCrimeFrequency] = useState<string>('Monthly');

    const [top5RecentData, setTop5RecentData] = useState<any>();

    const [totalCrimes, setTotalCrimes] = useState<number>();
    const [vulnerableGender, setVulnerableGender] = useState<string>();
    const [vulnerableAgeRange, setVulnerableAgeRange] = useState<string>();
    const [vulnerableEthnicity, setVulnerableEthnicity] = useState<string>();

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

    const {
        top5RecentCrimeData,
        top5RecentCrimeDataStatus,
        top5RecentCrimeDataError
    } = useSelector((state: RootState) => state.topCrimeDataInfo);

    if (top5RecentCrimeDataStatus === 'loading') {
        console.log('Top 5 Crime Data Loading');
    }

    if (top5RecentCrimeDataError === 'failed') {
        console.log(top5RecentCrimeDataError);
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

    const get_aggregated_data = (
        data: any,
        max: number,
        sort_data: boolean,
        montly_line_chart: boolean,
        weekly_line_chart: boolean
    ) => {
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

        if (montly_line_chart) {
            let lineChartData = Object.keys(aggregatedData)
                .map((dataName) => [
                    { x: dataName, y: aggregatedData[dataName] }
                ])
                .flat();
            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];

            const newData = lineChartData.map((d) => {
                const monthIndex = parseInt(d.x) - 1; // subtract 1 to convert from 1-based to 0-based indexing
                return { x: months[monthIndex], y: d.y };
            });
            return newData;
        } else if (weekly_line_chart) {
            let lineChartData = Object.keys(aggregatedData)
                .map((dataName) => [
                    { x: dataName, y: aggregatedData[dataName] }
                ])
                .flat();
            return lineChartData;
        } else {
            let sortedData = Object.keys(aggregatedData)
                .map((dataName) => [
                    {
                        id: dataName.toUpperCase(),
                        value: aggregatedData[dataName]
                    }
                ])
                .flat();
            if (sort_data) {
                sortedData = sortedData.sort((a, b) => b.value - a.value);
            }
            sortedData = sortedData.slice(0, max);
            return sortedData;
        }
    };

    useEffect(() => {
        if (crimeData.length != 0) {
            const top_5_crimes_data = crimeData.map((obj) => obj.top5_crimes);
            setTop5CrimeData(
                get_aggregated_data(top_5_crimes_data, 5, true, false, false)
            );

            const ethnicity_distribution_data = crimeData.map(
                (obj) => obj.ethnicity_distribution
            );

            let agg_ethnicity_data = get_aggregated_data(
                ethnicity_distribution_data,
                5,
                true,
                false,
                false
            );

            setTop5Ethnicity(agg_ethnicity_data);

            // Get Vulnerable Ethnicity
            const filtered_ethnicity_data = [];
            for (let i = 0; i < agg_ethnicity_data.length; i++) {
                const obj = agg_ethnicity_data[i] as {
                    id: string;
                    value: number;
                };
                if (obj.id !== 'UNKNOWN' && obj.id !== 'OTHER') {
                    filtered_ethnicity_data.push(obj);
                }
            }
            if (filtered_ethnicity_data.length > 0) {
                setVulnerableEthnicity(filtered_ethnicity_data[0].id);
            } else {
                let first_ethnicity_data = agg_ethnicity_data[0] as {
                    id: string;
                    value: number;
                };
                setVulnerableEthnicity(first_ethnicity_data.id);
            }

            const gender_distribution_data = crimeData.map(
                (obj) => obj.gender_distribution
            );

            let agg_gender_data = get_aggregated_data(
                gender_distribution_data,
                5,
                true,
                false,
                false
            );

            setTop5Gender(agg_gender_data);

            // Get Vulnerable Gender
            let gender_max = (
                agg_gender_data[0] as { id: string; value: number }
            ).value;
            let gender_max_id = (
                agg_gender_data[0] as { id: string; value: number }
            ).id;

            for (let i = 1; i < agg_gender_data.length; i++) {
                if (
                    (agg_gender_data[i] as { id: string; value: number })
                        .value > gender_max
                ) {
                    gender_max = (
                        agg_gender_data[i] as { id: string; value: number }
                    ).value;
                    gender_max_id = (
                        agg_gender_data[i] as { id: string; value: number }
                    ).id;
                }
            }

            setVulnerableGender(gender_max_id);

            // Total Crimes
            let total_crimes = 0;
            if (agg_gender_data.length > 0) {
                agg_gender_data.forEach((item) => {
                    if ('value' in item) {
                        total_crimes += item.value;
                    }
                });
            }
            setTotalCrimes(total_crimes);

            const age_distribution_data = crimeData.map(
                (obj) => obj.age_distribution
            );

            let agg_age_data = get_aggregated_data(
                age_distribution_data,
                10,
                false,
                false,
                false
            );

            setAgeDistribution(agg_age_data);

            // Get Vulnerable Age Range
            let age_max = (agg_age_data[0] as { id: string; value: number })
                .value;
            let age_max_id = (agg_age_data[0] as { id: string; value: number })
                .id;

            for (let i = 1; i < agg_age_data.length; i++) {
                if (
                    (agg_age_data[i] as { id: string; value: number }).value >
                    age_max
                ) {
                    age_max = (agg_age_data[i] as { id: string; value: number })
                        .value;
                    age_max_id = (
                        agg_age_data[i] as { id: string; value: number }
                    ).id;
                }
            }

            setVulnerableAgeRange(age_max_id);

            let actual_monthly_data = crimeData.map(
                (obj) => obj.actual_month_crime_freq
            );

            actual_monthly_data = get_aggregated_data(
                actual_monthly_data,
                12,
                false,
                true,
                false
            );

            let actual_weekly_data = crimeData.map(
                (obj) => obj.actual_week_crime_freq
            );

            actual_weekly_data = get_aggregated_data(
                actual_weekly_data,
                52,
                false,
                false,
                true
            );

            setCrimeFrequency('Monthly');

            if (
                crimeData &&
                (crimeData[0]?.prediction_month_crime_freq ||
                    crimeData[0]?.prediction_week_crime_freq)
            ) {
                let prediction_monthly_data = crimeData.map(
                    (obj) => obj.prediction_month_crime_freq
                );

                prediction_monthly_data = get_aggregated_data(
                    prediction_monthly_data,
                    12,
                    false,
                    true,
                    false
                );

                let prediction_weekly_data = crimeData.map(
                    (obj) => obj.prediction_week_crime_freq
                );

                prediction_weekly_data = get_aggregated_data(
                    prediction_weekly_data,
                    52,
                    false,
                    false,
                    true
                );

                let complete_montly_data = [
                    {
                        id: 'Actual',
                        data: actual_monthly_data
                    },
                    { id: 'Forecasted', data: prediction_monthly_data }
                ];
                setMontlyFrequency(complete_montly_data);

                let complete_weekly_data = [
                    {
                        id: 'Actual',
                        data: actual_weekly_data
                    },
                    { id: 'Forecasted', data: prediction_weekly_data }
                ];
                setWeeklyFrequency(complete_weekly_data);
            } else {
                let complete_montly_data = [
                    {
                        id: 'Actual',
                        data: actual_monthly_data
                    }
                ];
                setMontlyFrequency(complete_montly_data);

                let complete_weekly_data = [
                    {
                        id: 'Actual',
                        data: actual_weekly_data
                    }
                ];
                setWeeklyFrequency(complete_weekly_data);
            }

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

    const handleCrimeFrequencyChange = (type: string) => {
        setCrimeFrequency(type);
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

    useEffect(() => {
        if (top5CrimeData) {
            if (selectedYear) {
                let new_zip_codes_api = [];
                if (selectedZipcode === 'All') {
                    new_zip_codes_api = zipCodes.filter(
                        (elem) => elem !== 'All'
                    );
                } else {
                    new_zip_codes_api = [selectedZipcode];
                }
                dispatch(
                    fetchTop5CrimeDataInfoData({
                        endpoint: 'crime/get_top5_crimedata_by_zipcode',
                        desiredCrimes: top5CrimeData?.map(
                            (crime: any) => crime.id
                        ),
                        zipcodes: new_zip_codes_api
                    })
                );
            }
        }
    }, [top5CrimeData, zipCodes, selectedZipcode, selectedYear]);

    useEffect(() => {
        if (top5RecentCrimeData?.data) {
            setTop5RecentData(top5RecentCrimeData.data);
        }
    }, [top5RecentCrimeData]);

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
                        <Fragment>
                            <Grid container spacing={2} className="summary">
                                <Grid item xs={3}>
                                    <Box bgcolor="white" height="120px">
                                        <Typography
                                            className="demographics_header"
                                            variant="h6"
                                        >
                                            Total Crimes
                                        </Typography>
                                        <Typography
                                            className="demographics_header summary_value"
                                            variant="h6"
                                        >
                                            {totalCrimes}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box bgcolor="white" height="120px">
                                        <Typography
                                            className="demographics_header"
                                            variant="h6"
                                        >
                                            Vulnerable Ethnicity
                                        </Typography>
                                        <Typography
                                            className="demographics_header summary_value"
                                            variant="h6"
                                        >
                                            {vulnerableEthnicity}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box bgcolor="white" height="120px">
                                        <Typography
                                            className="demographics_header"
                                            variant="h6"
                                        >
                                            Vulnerable Age Range
                                        </Typography>
                                        <Typography
                                            className="demographics_header summary_value"
                                            variant="h6"
                                        >
                                            {vulnerableAgeRange}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box bgcolor="white" height="120px">
                                        <Typography
                                            className="demographics_header"
                                            variant="h6"
                                        >
                                            Vulnerable Gender
                                        </Typography>
                                        <Typography
                                            className="demographics_header summary_value"
                                            variant="h6"
                                        >
                                            {vulnerableGender}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Grid container direction="column">
                                        <Grid>
                                            <Box bgcolor="white">
                                                <Typography
                                                    className="demographics_header"
                                                    variant="h5"
                                                >
                                                    Geographic Analysis
                                                </Typography>
                                                {mapData && (
                                                    <Map
                                                        data={mapData}
                                                        onValChange={
                                                            handleZipcodeChange
                                                        }
                                                        selectedZipCode={
                                                            selectedZipcode
                                                        }
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid className="linechart_container">
                                            <Box bgcolor="white">
                                                <Typography
                                                    className="demographics_header"
                                                    variant="h5"
                                                >
                                                    Crime Forecasting
                                                </Typography>

                                                <div className="freq_input">
                                                    <SelectInput
                                                        data={[
                                                            'Monthly',
                                                            'Weekly'
                                                        ]}
                                                        name="Frequency"
                                                        selectedValue={
                                                            crimeFrequency
                                                        }
                                                        onValChange={
                                                            handleCrimeFrequencyChange
                                                        }
                                                    />
                                                </div>
                                            </Box>
                                            <Box bgcolor="white">
                                                {(weeklyFrequency ||
                                                    montlyFrequency) && (
                                                    <LineChart
                                                        data={
                                                            crimeFrequency ===
                                                            'Monthly'
                                                                ? montlyFrequency
                                                                : weeklyFrequency
                                                        }
                                                        line_type={'montly'}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid
                                        container
                                        direction="column"
                                        bgcolor="white"
                                    >
                                        <Grid item>
                                            <Box>
                                                <Typography
                                                    className="demographics_header"
                                                    variant="h6"
                                                >
                                                    Top 5 Crime Statistics
                                                </Typography>
                                                {top5CrimeData && (
                                                    <PieChart
                                                        data={top5CrimeData}
                                                        type="top5crimes"
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box>
                                                <Typography
                                                    className="demographics_header"
                                                    variant="h6"
                                                >
                                                    Recent Years Insights
                                                </Typography>
                                                {top5RecentData && (
                                                    <StackedBarChart
                                                        data={top5RecentData}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container className="demographics_container">
                                <Grid item xs={12} className="header_grid">
                                    <Typography
                                        className="demographics_header"
                                        variant="h4"
                                    >
                                        Victim Demographic Insights
                                    </Typography>
                                </Grid>
                                {top5Ethnicity && (
                                    <Grid item xs={4}>
                                        <Box>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Ethnicity Breakdown
                                            </Typography>
                                            <PieChart
                                                data={top5Ethnicity}
                                                type="ethnicity"
                                            />
                                        </Box>
                                    </Grid>
                                )}
                                {ageDistribution && (
                                    <Grid item xs={4}>
                                        <Box>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Age Range Analysis
                                            </Typography>
                                            <BarChart data={ageDistribution} />
                                        </Box>
                                    </Grid>
                                )}
                                {top5Gender && (
                                    <Grid item xs={4}>
                                        <Box>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Gender Distribution
                                            </Typography>
                                            <PieChart
                                                data={top5Gender}
                                                type="gender"
                                            />
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Fragment>
                    )}
                </div>
            </div>
        </Fragment>
    );
}
