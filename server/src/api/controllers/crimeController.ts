import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import config from '../../config/config';
import * as risk_zone from '../../config/Final_Datasets/risk_zone.json';
import * as metadata from '../../config/Final_Datasets/metadata.json';
import * as crime_data from '../../config/Final_Datasets/crime_data.json';
import * as forecasted_actual_month_data from '../../config/Final_Datasets/forecasted_actual_month_data.json';
import * as forecasted_predict_month_data from '../../config/Final_Datasets/forecasted_predict_month_data.json';
import * as forecasted_actual_week_data from '../../config/Final_Datasets/forecasted_actual_week_data.json';
import * as forecasted_predict_week_data from '../../config/Final_Datasets/forecasted_predict_week_data.json';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

export default class CrimeController {
    // Create Risk Zone Database
    public create_riskzone_db = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        await risk_zone.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `RSK#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    risk_zone: data.risk_zone
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await res.send({
            status: 200,
            data: 'Created Riskzone DB Successfully',
            message: 'OK'
        });
    };

    // Create Zipcode Metadata Database
    public create_metadata_db = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        await metadata.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `META#${data.zip_code}`,
                    SK: `INFO#${data.zip_code}`,
                    primary_city: data.primary_city,
                    latitude: data.latitude,
                    longitude: data.longitude
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await res.send({
            status: 200,
            data: 'Created Metadata DB Successfully',
            message: 'OK'
        });
    };

    // Create Crime Data Database
    public create_crimedata_db = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        await crime_data.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `CRIME#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    gender_distribution: Object.entries(
                        data.gender_distribution
                    ).map(([key, value]) => ({ [key]: value })),
                    age_distribution: Object.entries(data.age_distribution).map(
                        ([key, value]) => ({ [key]: value })
                    ),
                    ethnicity_distribution: Object.entries(
                        data.ethnicity_distribution
                    ).map(([key, value]) => ({ [key]: value })),
                    top5_crimes: Object.entries(data.top5_crimes).map(
                        ([key, value]) => ({ [key]: value })
                    )
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await res.send({
            status: 200,
            data: 'Created Crime Data DB Successfully',
            message: 'OK'
        });
    };

    // Create Monthly Crime Data Database
    public create_monthdata_db = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        await forecasted_actual_month_data.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `MNT#ACT#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    month_frequency: Object.entries(data.month_frequency).map(
                        ([key, value]) => ({ [key]: value })
                    )
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await forecasted_predict_month_data.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `MNT#PRD#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    month_frequency: Object.entries(data.month_frequency).map(
                        ([key, value]) => ({ [key]: value })
                    )
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await res.send({
            status: 200,
            data: 'Created Month Crime Data DB Successfully',
            message: 'OK'
        });
    };

    // Create Weekly Crime Data Database
    public create_weekdata_db = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        await forecasted_actual_week_data.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `WEK#ACT#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    week_frequency: Object.entries(data.week_frequency).map(
                        ([key, value]) => ({ [key]: value })
                    )
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await forecasted_predict_week_data.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `WEK#PRD#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    week_frequency: Object.entries(data.week_frequency).map(
                        ([key, value]) => ({ [key]: value })
                    )
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await res.send({
            status: 200,
            data: 'Created Week Crime Data DB Successfully',
            message: 'OK'
        });
    };

    // Get MetaData Information
    public get_metadata_info = async (req: Request, res: Response) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();

            let params = {
                TableName: config.DATABASE_NAME,
                FilterExpression: 'begins_with(PK, :pk)',
                ExpressionAttributeValues: {
                    ':pk': 'META'
                },
                ExclusiveStartKey: undefined
            };

            let items = [];

            while (true) {
                let data = await documentClient.scan(params).promise();
                items = items.concat(data.Items);
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                if (!params.ExclusiveStartKey) break;
            }

            const transformedData = await items.map((location) => ({
                primary_city: location.primary_city,
                zip_code: location.SK.split('#')[1],
                latitude: location.latitude,
                longitude: location.longitude
            }));

            res.send({
                status: 200,
                data: transformedData,
                message: 'Fetched Metadata of Locations'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };

    // Get Yearly Zipcodes based on City
    public get_yearly_zipcodes_info_by_city = async (
        req: Request,
        res: Response
    ) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();
            let primary_city = req.body.city;

            let city_located_params = {
                TableName: config.DATABASE_NAME,
                IndexName: config.PRIMARY_CITY_INDEX,
                KeyConditionExpression: '#primary_city = :primary_city',
                ExpressionAttributeNames: { '#primary_city': 'primary_city' },
                ExpressionAttributeValues: {
                    ':primary_city': primary_city
                }
            };

            const location_data = await documentClient
                .query(city_located_params)
                .promise();

            const zip_codes = location_data.Items.map(
                (item) => item.SK.split('#')[1]
            );
            zip_codes.sort();

            const zip_code_yearly_data = await Promise.all(
                zip_codes.map(async (zip_code) => {
                    let risk_zone_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression:
                            '#PK = :PK and begins_with(#SK, :SK)',
                        ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'SK' },
                        ExpressionAttributeValues: {
                            ':PK': 'RSK#' + zip_code,
                            ':SK': 'YR#'
                        }
                    };

                    const risk_data = await documentClient
                        .query(risk_zone_params)
                        .promise();

                    let yearly_zip_data = risk_data.Items.map(
                        (yearly_data: any) => yearly_data.SK.split('#')[1]
                    );

                    return {
                        [zip_code]: yearly_zip_data
                    };
                })
            );

            const output = {};

            zip_code_yearly_data.forEach((item) => {
                const [zipCode, values] = Object.entries(item)[0];
                values.forEach((value) => {
                    if (!output[value]) {
                        output[value] = [zipCode];
                    } else {
                        output[value].push(zipCode);
                    }
                });
            });

            const sortedOutput = {};
            Object.keys(output)
                .sort()
                .forEach((key) => {
                    sortedOutput[key] = output[key].sort();
                });

            res.send({
                status: 200,
                data: output,
                message: 'Fetched Yearly Zipcodes by City'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };

    // Get CrimeData Information based on Year and Zipcode
    public get_crimedata_info_by_year_zipcode = async (
        req: Request,
        res: Response
    ) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();
            let { zipcodes, year } = req.body;

            let transformedData = await Promise.all(
                zipcodes.map(async (zip_code: any) => {
                    let meta_data_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression: '#PK = :PK and #SK = :SK',
                        ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'SK' },
                        ExpressionAttributeValues: {
                            ':PK': 'META#' + zip_code,
                            ':SK': 'INFO#' + zip_code
                        }
                    };

                    let risk_zone_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression: '#PK = :PK and #SK = :SK',
                        ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'SK' },
                        ExpressionAttributeValues: {
                            ':PK': 'RSK#' + zip_code,
                            ':SK': 'YR#' + year
                        }
                    };

                    let crime_data_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression: '#PK = :PK and #SK = :SK',
                        ExpressionAttributeNames: {
                            '#PK': 'PK',
                            '#SK': 'SK'
                        },
                        ExpressionAttributeValues: {
                            ':PK': 'CRIME#' + zip_code,
                            ':SK': 'YR#' + year
                        }
                    };

                    let actual_month_crime_freq_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression: '#PK = :PK and #SK = :SK',
                        ExpressionAttributeNames: {
                            '#PK': 'PK',
                            '#SK': 'SK'
                        },
                        ExpressionAttributeValues: {
                            ':PK': 'MNT#ACT#' + zip_code,
                            ':SK': 'YR#' + year
                        }
                    };

                    let actual_week_crime_freq_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression: '#PK = :PK and #SK = :SK',
                        ExpressionAttributeNames: {
                            '#PK': 'PK',
                            '#SK': 'SK'
                        },
                        ExpressionAttributeValues: {
                            ':PK': 'WEK#ACT#' + zip_code,
                            ':SK': 'YR#' + year
                        }
                    };

                    const meta_data = await documentClient
                        .query(meta_data_params)
                        .promise();

                    const risk_zone_data = await documentClient
                        .query(risk_zone_params)
                        .promise();

                    const crime_data = await documentClient
                        .query(crime_data_params)
                        .promise();

                    const actual_month_crime_freq_data = await documentClient
                        .query(actual_month_crime_freq_params)
                        .promise();

                    const actual_week_crime_freq_data = await documentClient
                        .query(actual_week_crime_freq_params)
                        .promise();

                    let final_data = {
                        zip_code: risk_zone_data.Items[0].PK.split('#')[1],
                        risk_zone: risk_zone_data.Items[0].risk_zone,
                        latitude: meta_data.Items[0].latitude,
                        longitude: meta_data.Items[0].longitude,
                        ethnicity_distribution:
                            crime_data.Items[0].ethnicity_distribution,
                        gender_distribution:
                            crime_data.Items[0].gender_distribution,
                        age_distribution: crime_data.Items[0].age_distribution,
                        top5_crimes: crime_data.Items[0].top5_crimes,
                        actual_month_crime_freq:
                            actual_month_crime_freq_data.Items[0]
                                .month_frequency,
                        actual_week_crime_freq:
                            actual_week_crime_freq_data.Items[0].week_frequency
                    };

                    if (year === '2022') {
                        let prediction_month_crime_freq_params = {
                            TableName: config.DATABASE_NAME,
                            KeyConditionExpression: '#PK = :PK and #SK = :SK',
                            ExpressionAttributeNames: {
                                '#PK': 'PK',
                                '#SK': 'SK'
                            },
                            ExpressionAttributeValues: {
                                ':PK': 'MNT#PRD#' + zip_code,
                                ':SK': 'YR#' + year
                            }
                        };

                        let prediction_week_crime_freq_params = {
                            TableName: config.DATABASE_NAME,
                            KeyConditionExpression: '#PK = :PK and #SK = :SK',
                            ExpressionAttributeNames: {
                                '#PK': 'PK',
                                '#SK': 'SK'
                            },
                            ExpressionAttributeValues: {
                                ':PK': 'WEK#PRD#' + zip_code,
                                ':SK': 'YR#' + year
                            }
                        };

                        const prediction_month_crime_freq_data =
                            await documentClient
                                .query(prediction_month_crime_freq_params)
                                .promise();

                        const prediction_week_crime_freq_data =
                            await documentClient
                                .query(prediction_week_crime_freq_params)
                                .promise();

                        final_data['prediction_month_crime_freq'] =
                            prediction_month_crime_freq_data.Items[0].month_frequency;
                        final_data['prediction_week_crime_freq'] =
                            prediction_week_crime_freq_data.Items[0].week_frequency;
                    }

                    return final_data;
                })
            );

            res.send({
                status: 200,
                data: transformedData,
                message: 'Fetched Crime Data of Locations'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };

    public get_top5_crimedata_by_zipcode = async (
        req: Request,
        res: Response
    ) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();
            let { zipcodes, desiredCrimes } = req.body;

            let transformedData = await Promise.all(
                zipcodes.map(async (zip_code: any) => {
                    let crime_data_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression:
                            '#PK = :PK and begins_with(#SK, :SK)',
                        ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'SK' },
                        ExpressionAttributeValues: {
                            ':PK': 'CRIME#' + zip_code,
                            ':SK': 'YR#'
                        }
                    };

                    const crime_data = await documentClient
                        .query(crime_data_params)
                        .promise();

                    let filtered_data = crime_data.Items.map((data) => {
                        return {
                            year: data.SK.split('#')[1],
                            top5_crimes: data.top5_crimes
                        };
                    });

                    const filteredData = [];

                    filtered_data.forEach((yearData) => {
                        const year = yearData.year;
                        const topCrimes = yearData.top5_crimes;

                        // Filter top crimes to only include desired crimes
                        const filteredTopCrimes = topCrimes.reduce(
                            (filtered, crimeObj) => {
                                const crime = Object.keys(crimeObj)[0];
                                if (desiredCrimes.includes(crime)) {
                                    filtered.push({[crime]: crimeObj[crime]});
                                }
                                return filtered;
                            },
                            []
                        );

                        filteredData.push({
                            year: year,
                            top5_crimes: filteredTopCrimes
                        });
                    });

                    return filteredData
                })
            );

            const combined_data = {};

            transformedData.forEach(sublist => {
                sublist.forEach(item => {
                    const year = item.year;
                    if (!combined_data[year]) {
                        combined_data[year] = {};
                    }
                    item.top5_crimes.forEach(crime => {
                        const crime_type = Object.keys(crime)[0];
                        const crime_count = crime[crime_type];
                        if (!combined_data[year][crime_type]) {
                            combined_data[year][crime_type] = crime_count;
                        } else {
                            combined_data[year][crime_type] += crime_count;
                        }
                    });
                });
            });

            const last_5_data = Object.keys(combined_data).sort().slice(-5).reverse()

            const final_data = []

            last_5_data.forEach((year) => {
                let year_data = {id: year}
                desiredCrimes.forEach((crime) => {
                    if(combined_data[year][crime]){
                        year_data[crime] = combined_data[year][crime]
                    }else{
                        year_data[crime] = 0
                    }
                })
                final_data.push(year_data)
            })

            res.send({
                status: 200,
                data: final_data,
                message: 'Fetched last few years Crime Data'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };

    // Get CrimeData Information based on City
    public get_crimedata_info_by_city = async (req: Request, res: Response) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();
            let primary_city = req.body.city;

            let city_located_params = {
                TableName: config.DATABASE_NAME,
                IndexName: config.PRIMARY_CITY_INDEX,
                KeyConditionExpression: '#primary_city = :primary_city',
                ExpressionAttributeNames: { '#primary_city': 'primary_city' },
                ExpressionAttributeValues: {
                    ':primary_city': primary_city
                }
            };

            const location_data = await documentClient
                .query(city_located_params)
                .promise();

            let transformedData = location_data.Items.map((location_info) => ({
                zip_code: location_info.SK.split('#')[1],
                latitude: location_info.latitude,
                longitude: location_info.longitude
            }));

            transformedData = transformedData.sort((a: any, b: any) =>
                a.zip_code.localeCompare(b.zip_code)
            );

            let risk_zone_data = await Promise.all(
                transformedData.map(async (data: any) => {
                    var risk_zone_params = {
                        TableName: config.DATABASE_NAME,
                        KeyConditionExpression:
                            '#PK = :PK and begins_with(#SK, :SK)',
                        ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'SK' },
                        ExpressionAttributeValues: {
                            ':PK': 'RSK#' + data.zip_code,
                            ':SK': 'YR#'
                        }
                    };

                    const risk_zone_data = await documentClient
                        .query(risk_zone_params)
                        .promise();

                    let yearly_risk_data = {};

                    risk_zone_data.Items.forEach((yearly_data: any) => {
                        yearly_risk_data[yearly_data.SK.split('#')[1]] = {
                            risk_zone: yearly_data.risk_zone
                        };
                    });

                    return {
                        ...data,
                        yearly_data: yearly_risk_data
                    };
                })
            );

            let updated_crime_data = await Promise.all(
                risk_zone_data.map(async (data: any) => {
                    const new_crime_data = await Promise.all(
                        Object.keys(data.yearly_data).map(async (year) => {
                            let crime_params = {
                                TableName: config.DATABASE_NAME,
                                KeyConditionExpression:
                                    '#PK = :PK and #SK = :SK',
                                ExpressionAttributeNames: {
                                    '#PK': 'PK',
                                    '#SK': 'SK'
                                },
                                ExpressionAttributeValues: {
                                    ':PK': 'CRIME#' + data.zip_code,
                                    ':SK': 'YR#' + year
                                }
                            };

                            let actual_month_crime_freq_params = {
                                TableName: config.DATABASE_NAME,
                                KeyConditionExpression:
                                    '#PK = :PK and #SK = :SK',
                                ExpressionAttributeNames: {
                                    '#PK': 'PK',
                                    '#SK': 'SK'
                                },
                                ExpressionAttributeValues: {
                                    ':PK': 'MNT#ACT#' + data.zip_code,
                                    ':SK': 'YR#' + year
                                }
                            };

                            let actual_week_crime_freq_params = {
                                TableName: config.DATABASE_NAME,
                                KeyConditionExpression:
                                    '#PK = :PK and #SK = :SK',
                                ExpressionAttributeNames: {
                                    '#PK': 'PK',
                                    '#SK': 'SK'
                                },
                                ExpressionAttributeValues: {
                                    ':PK': 'WEK#ACT#' + data.zip_code,
                                    ':SK': 'YR#' + year
                                }
                            };

                            const crime_data = await documentClient
                                .query(crime_params)
                                .promise();

                            const actual_month_crime_freq_data =
                                await documentClient
                                    .query(actual_month_crime_freq_params)
                                    .promise();

                            const actual_week_crime_freq_data =
                                await documentClient
                                    .query(actual_week_crime_freq_params)
                                    .promise();

                            return {
                                year: crime_data.Items[0].SK.split('#')[1],
                                ethnicity_distribution:
                                    crime_data.Items[0].ethnicity_distribution,
                                gender_distribution:
                                    crime_data.Items[0].gender_distribution,
                                age_distribution:
                                    crime_data.Items[0].age_distribution,
                                top5_crimes: crime_data.Items[0].top5_crimes,
                                actual_month_crime_freq:
                                    actual_month_crime_freq_data.Items[0]
                                        .month_frequency,
                                actual_week_crime_freq:
                                    actual_week_crime_freq_data.Items[0]
                                        .week_frequency
                            };
                        })
                    );

                    for (let i = 0; i < new_crime_data.length; i++) {
                        const year = new_crime_data[i].year;

                        if (data.yearly_data.hasOwnProperty(year)) {
                            data.yearly_data[year].ethnicity_distribution =
                                new_crime_data[i].ethnicity_distribution;
                            data.yearly_data[year].gender_distribution =
                                new_crime_data[i].gender_distribution;
                            data.yearly_data[year].age_distribution =
                                new_crime_data[i].age_distribution;
                            data.yearly_data[year].top5_crimes =
                                new_crime_data[i].top5_crimes;
                            data.yearly_data[year].actual_month_crime_freq =
                                new_crime_data[i].actual_month_crime_freq;
                            data.yearly_data[year].actual_week_crime_freq =
                                new_crime_data[i].actual_week_crime_freq;
                        }
                    }
                    return data;
                })
            );

            res.send({
                status: 200,
                data: updated_crime_data,
                message: 'Fetched Crime Data of Locations'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };
}
