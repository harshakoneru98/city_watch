import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import config from '../../config/config';
import * as housing from '../../config/Final_Datasets/housing.json'

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
                    primary_city: data.primary_city,
                    house_crime_correlation: data.house_crime_correlation,
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
}
