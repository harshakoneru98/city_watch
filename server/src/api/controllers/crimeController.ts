import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import config from '../../config/config';
import * as risk_zone from '../../config/Final_Datasets/risk_zone.json'
import * as metadata from '../../config/Final_Datasets/metadata.json'
import * as crime_data from '../../config/Final_Datasets/crime_data.json'

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
                    gender_distribution: Object.entries(data.gender_distribution).map(([key, value]) => ({ [key]: value })),
                    age_distribution: Object.entries(data.age_distribution).map(([key, value]) => ({ [key]: value })),
                    ethnicity_distribution: Object.entries(data.ethnicity_distribution).map(([key, value]) => ({ [key]: value })),
                    top5_crimes: Object.entries(data.top5_crimes).map(([key, value]) => ({ [key]: value }))
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

}
