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
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import './Compare.scss';

export default function Compare() {
    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity1, setSelectedCity1] = useState<string>('');
    const [selectedCity2, setSelectedCity2] = useState<string>('');
    const [yearZipCodes1, setYearZipCodes1] = useState<any>();
    const [yearZipCodes2, setYearZipCodes2] = useState<any>();

    const [years1, setYears1] = useState<string[]>([]);
    const [selectedYear1, setSelectedYear1] = useState<string>('');
    const [zipCodes1, setZipCodes1] = useState<any[]>([]);
    const [selectedZipcode1, setSelectedZipcode1] = useState<any>();

    const [years2, setYears2] = useState<string[]>([]);
    const [selectedYear2, setSelectedYear2] = useState<string>('');
    const [zipCodes2, setZipCodes2] = useState<any[]>([]);
    const [selectedZipcode2, setSelectedZipcode2] = useState<any>();

    const [crimeData1, setCrimeData1] = useState<any>();
    const [crimeData2, setCrimeData2] = useState<any>();

    const [top5CrimeData1, setTop5CrimeData1] = useState<any>();
    const [top5Ethnicity1, setTop5Ethnicity1] = useState<any>();
    const [top5Gender1, setTop5Gender1] = useState<any>();
    const [ageDistribution1, setAgeDistribution1] = useState<any>();

    const [top5CrimeData2, setTop5CrimeData2] = useState<any>();
    const [top5Ethnicity2, setTop5Ethnicity2] = useState<any>();
    const [top5Gender2, setTop5Gender2] = useState<any>();
    const [ageDistribution2, setAgeDistribution2] = useState<any>();

    const insights = [
        'Top 5 Crime Statistics',
        'Victim Ethnicity Breakdown',
        'Victim Age Range Analysis',
        'Victim Gender Distribution'
    ];

    const [selectedInsight, setSelectedInsight] = useState<string>('');

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
        const getCrime1Data = async () => {
            if (selectedYear1) {
                let new_zip_codes_api = [];
                if (selectedZipcode1 === 'All') {
                    new_zip_codes_api = zipCodes1.filter(
                        (elem) => elem !== 'All'
                    );
                } else {
                    new_zip_codes_api = [selectedZipcode1];
                }

                try {
                    const response = await postAxiosRequest(
                        JSON.stringify({
                            year: selectedYear1,
                            zipcodes: new_zip_codes_api
                        }),
                        'crime/get_crimedata_info_by_year_zipcode'
                    );
                    setCrimeData1(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getCrime1Data();
    }, [zipCodes1, selectedZipcode1, selectedYear1]);

    useEffect(() => {
        const getCrime2Data = async () => {
            if (selectedYear2) {
                let new_zip_codes_api = [];
                if (selectedZipcode2 === 'All') {
                    new_zip_codes_api = zipCodes2.filter(
                        (elem) => elem !== 'All'
                    );
                } else {
                    new_zip_codes_api = [selectedZipcode2];
                }

                try {
                    const response = await postAxiosRequest(
                        JSON.stringify({
                            year: selectedYear2,
                            zipcodes: new_zip_codes_api
                        }),
                        'crime/get_crimedata_info_by_year_zipcode'
                    );
                    setCrimeData2(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getCrime2Data();
    }, [zipCodes2, selectedZipcode2, selectedYear2]);

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
        if (crimeData1) {
            console.log('Crime Data 1 : ', crimeData1);

            // Top 5 Crimes
            const top_5_crimes_data = crimeData1.map(
                (obj: any) => obj.top5_crimes
            );
            setTop5CrimeData1(
                get_aggregated_data(top_5_crimes_data, 5, true, false, false)
            );

            // Ethnicity Distribution
            const ethnicity_distribution_data = crimeData1.map(
                (obj: any) => obj.ethnicity_distribution
            );
            let agg_ethnicity_data = get_aggregated_data(
                ethnicity_distribution_data,
                5,
                true,
                false,
                false
            );
            setTop5Ethnicity1(agg_ethnicity_data);

            // Gender Distribution
            const gender_distribution_data = crimeData1.map(
                (obj: any) => obj.gender_distribution
            );
            let agg_gender_data = get_aggregated_data(
                gender_distribution_data,
                5,
                true,
                false,
                false
            );
            setTop5Gender1(agg_gender_data);

            // Age Distribution
            const age_distribution_data = crimeData1.map(
                (obj: any) => obj.age_distribution
            );
            let agg_age_data = get_aggregated_data(
                age_distribution_data,
                10,
                false,
                false,
                false
            );
            setAgeDistribution1(agg_age_data);
        }
    }, [crimeData1]);

    useEffect(() => {
        if (crimeData2) {
            console.log('Crime Data 2 : ', crimeData2);

            // Top 5 Crimes
            const top_5_crimes_data = crimeData2.map(
                (obj: any) => obj.top5_crimes
            );
            setTop5CrimeData2(
                get_aggregated_data(top_5_crimes_data, 5, true, false, false)
            );

            // Ethnicity Distribution
            const ethnicity_distribution_data = crimeData2.map(
                (obj: any) => obj.ethnicity_distribution
            );
            let agg_ethnicity_data = get_aggregated_data(
                ethnicity_distribution_data,
                5,
                true,
                false,
                false
            );
            setTop5Ethnicity2(agg_ethnicity_data);

            // Gender Distribution
            const gender_distribution_data = crimeData2.map(
                (obj: any) => obj.gender_distribution
            );
            let agg_gender_data = get_aggregated_data(
                gender_distribution_data,
                5,
                true,
                false,
                false
            );
            setTop5Gender2(agg_gender_data);

            // Age Distribution
            const age_distribution_data = crimeData2.map(
                (obj: any) => obj.age_distribution
            );
            let agg_age_data = get_aggregated_data(
                age_distribution_data,
                10,
                false,
                false,
                false
            );
            setAgeDistribution2(agg_age_data);
        }
    }, [crimeData2]);

    const handleInsightChange = (insight: string) => {
        setSelectedInsight(insight);
    };

    useEffect(() => {
        console.log('Selected Insight : ', selectedInsight);
    }, [selectedInsight]);

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

                    <Grid container bgcolor="white">
                        <Grid item xs={12}>
                            {selectedCity1 && selectedCity2 && (
                                <div className="selectInputCompare">
                                    <SelectInput
                                        data={insights}
                                        name="Insights"
                                        selectedValue={selectedInsight}
                                        onValChange={(insights) =>
                                            handleInsightChange(insights)
                                        }
                                        width={'400px'}
                                    />
                                </div>
                            )}
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        bgcolor="white"
                        className="compare-insights"
                    >
                        <Grid item xs={1}></Grid>
                        <Grid item xs={4}>
                            {selectedInsight === 'Top 5 Crime Statistics' && (
                                <Box>
                                    {top5CrimeData1 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Top 5 Crime Statistics
                                            </Typography>

                                            <PieChart
                                                data={top5CrimeData1}
                                                type="top5crimes"
                                            />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                            {selectedInsight ===
                                'Victim Ethnicity Breakdown' && (
                                <Box>
                                    {top5Ethnicity1 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Ethnicity Breakdown
                                            </Typography>
                                            <PieChart
                                                data={top5Ethnicity1}
                                                type="ethnicity"
                                            />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                            {selectedInsight ===
                                'Victim Age Range Analysis' && (
                                <Box>
                                    {ageDistribution1 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Age Range Analysis
                                            </Typography>
                                            <BarChart data={ageDistribution1} />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                            {selectedInsight ===
                                'Victim Gender Distribution' && (
                                <Box>
                                    {top5Gender1 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Gender Distribution
                                            </Typography>
                                            <PieChart
                                                data={top5Gender1}
                                                type="gender"
                                            />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={4}>
                            {selectedInsight === 'Top 5 Crime Statistics' && (
                                <Box>
                                    {top5CrimeData2 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Top 5 Crime Statistics
                                            </Typography>

                                            <PieChart
                                                data={top5CrimeData2}
                                                type="top5crimes"
                                            />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                            {selectedInsight ===
                                'Victim Ethnicity Breakdown' && (
                                <Box>
                                    {top5Ethnicity2 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Ethnicity Breakdown
                                            </Typography>
                                            <PieChart
                                                data={top5Ethnicity2}
                                                type="ethnicity"
                                            />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                            {selectedInsight ===
                                'Victim Age Range Analysis' && (
                                <Box>
                                    {ageDistribution2 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Age Range Analysis
                                            </Typography>
                                            <BarChart data={ageDistribution2} />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                            {selectedInsight ===
                                'Victim Gender Distribution' && (
                                <Box>
                                    {top5Gender2 && (
                                        <Fragment>
                                            <Typography
                                                className="demographics_header"
                                                variant="h6"
                                            >
                                                Gender Distribution
                                            </Typography>
                                            <PieChart
                                                data={top5Gender2}
                                                type="gender"
                                            />
                                        </Fragment>
                                    )}
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </div>
            </div>
        </Fragment>
    );
}
