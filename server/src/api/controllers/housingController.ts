import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import config from '../../config/config';
import * as housing from '../../config/Final_Datasets/housing.json';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

export default class HousingController {
    // Create Housing Price Database
    public create_housing_price_db = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        await housing.forEach(async (data) => {
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `HSG#${data.zip_code}`,
                    SK: `YR#${data.year}`,
                    persqrt_price: data.persqrt_price,
                    risk_zone: data.risk_zone,
                    crime_count: data.crime_count,
                    housing_city: data.primary_city,
                    house_crime_correlation: data.house_crime_correlation
                }
            };

            await documentClient.put(params, function (err, data) {
                if (err) console.log(err);
            });
        });

        await res.send({
            status: 200,
            data: 'Created Housing Price DB Successfully',
            message: 'OK'
        });
    };

    // Get Housing Cities Information
    public get_housing_cities_info = async (req: Request, res: Response) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();

            let params = {
                TableName: config.DATABASE_NAME,
                FilterExpression: 'begins_with(PK, :pk)',
                ExpressionAttributeValues: {
                    ':pk': 'HSG'
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

            const transformedData = await items.map(
                (location) => location.housing_city
            );

            res.send({
                status: 200,
                data: [...new Set(transformedData)].sort(),
                message: 'Fetched Cities of Housing Locations'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };

    // Get Housing Recommendation Information
    public get_housing_recommendation_info = async (
        req: Request,
        res: Response
    ) => {
        try {
            let documentClient = new AWS.DynamoDB.DocumentClient();
            let { cities, persqrt_range } = req.body;

            let items = [];

            for (let i = 0; i < cities.length; i++) {
                let params = {
                    TableName: config.DATABASE_NAME,
                    FilterExpression:
                        'housing_city = :city AND persqrt_price >= :min_persqrt AND persqrt_price <= :max_persqrt',
                    ExpressionAttributeValues: {
                        ':city': cities[i],
                        ':min_persqrt': persqrt_range[0],
                        ':max_persqrt': persqrt_range[1]
                    },
                    ExclusiveStartKey: undefined
                };

                while (true) {
                    let data = await documentClient.scan(params).promise();
                    items = items.concat(data.Items);
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    if (!params.ExclusiveStartKey) break;
                }
            }

            const transformedData = await items.map((location) => ({
                zip_code: location.PK.split('#')[1],
                year: location.SK.split('#')[1],
                housing_city: location.housing_city,
                crime_count: location.crime_count,
                house_crime_correlation: location.house_crime_correlation,
                persqrt_price: location.persqrt_price,
                risk_zone: location.risk_zone
            }));

            const combinedData = [];
            const tempData = {};

            for (let i = 0; i < transformedData.length; i++) {
                const obj = transformedData[i];
                if (!tempData[obj.zip_code]) {
                    tempData[obj.zip_code] = {
                        zip_code: obj.zip_code,
                        housing_city: obj.housing_city,
                        year_data: []
                    };
                }
                tempData[obj.zip_code].year_data.push({
                    year: obj.year,
                    crime_count: obj.crime_count,
                    house_crime_correlation: obj.house_crime_correlation,
                    persqrt_price: obj.persqrt_price,
                    risk_zone: obj.risk_zone
                });
            }

            for (const key in tempData) {
                const obj = tempData[key];
                obj.year_data.sort(
                    (a, b) => parseInt(b.year) - parseInt(a.year)
                );
                combinedData.push(obj);
            }

            combinedData.sort((a, b) => {
                const riskZoneOrder = ["Low Risk Zone", "Medium Risk Zone", "High Risk Zone"];
                const aRiskZoneIndex = riskZoneOrder.indexOf(a.year_data[0].risk_zone);
                const bRiskZoneIndex = riskZoneOrder.indexOf(b.year_data[0].risk_zone);
                if (aRiskZoneIndex !== bRiskZoneIndex) {
                  return aRiskZoneIndex - bRiskZoneIndex;
                }
              
                // If risk zone is equal, sort by year
                if (a.year_data[0].year !== b.year_data[0].year) {
                  return b.year_data[0].year - a.year_data[0].year;
                }
              
                // If year is equal, sort by persqrt_price
                return a.year_data[0].persqrt_price - b.year_data[0].persqrt_price;
              });

            res.send({
                status: 200,
                data: combinedData,
                message: 'Fetched Housing Info'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };
}
