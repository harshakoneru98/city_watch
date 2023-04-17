import * as dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || '8080',
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_REGION: process.env.AWS_REGION,
    DATABASE_NAME: process.env.DATABASE_NAME,
    EMAIL_INDEX: process.env.EMAIL_INDEX,
    PRIMARY_CITY_INDEX: process.env.PRIMARY_CITY_INDEX,
    AUTH_KEY: process.env.AUTH_KEY
};
