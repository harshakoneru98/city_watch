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

                            const actual_month_crime_freq_data = await documentClient
                                .query(actual_month_crime_freq_params)
                                .promise();

                            const actual_week_crime_freq_data = await documentClient
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
                                actual_month_crime_freq: actual_month_crime_freq_data.Items[0].month_frequency,
                                actual_week_crime_freq: actual_week_crime_freq_data.Items[0].week_frequency
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
