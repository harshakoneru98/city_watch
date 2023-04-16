import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import config from '../../config/config';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

export default class UserController {
    // Create User
    public create_user = async (req: Request, res: Response) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();
        let user = req.body

        let email_check_params = {
            TableName: config.DATABASE_NAME,
            IndexName: config.EMAIL_INDEX,
            KeyConditionExpression: '#email = :email',
            ExpressionAttributeNames: { '#email': 'email' },
            ExpressionAttributeValues: {
                ':email': user.email
            }
        };
    
        const email_response = await documentClient
            .query(email_check_params)
            .promise();

        if (email_response.Count === 1) {
            res.send({
                status: 200,
                message: 'Email already exists',
            });
        } else {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            const user_id = v4()
            let params = {
                TableName: config.DATABASE_NAME,
                Item: {
                    PK: `AUTH#${user_id}`,
                    SK: user_id,
                    email: user.email,
                    city_located: user.city,
                    password: hashedPassword,
                }
            };
    
            try {
                await documentClient.put(params).promise();
                await res.send({
                    status: 200,
                    message: 'Created User Successfully',
                });
            } catch (err) {
                res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
        }
    };
}
