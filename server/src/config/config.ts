import * as dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || '8080',
    CITY_WATCH_AWS_ACCESS_KEY: process.env.CITY_WATCH_AWS_ACCESS_KEY,
    CITY_WATCH_AWS_SECRET_KEY: process.env.CITY_WATCH_AWS_SECRET_KEY,
    CITY_WATCH_AWS_REGION: process.env.CITY_WATCH_AWS_REGION,
    CITY_WATCH_DATABASE_NAME: process.env.CITY_WATCH_DATABASE_NAME,
    EMAIL_INDEX: process.env.EMAIL_INDEX,
    PRIMARY_CITY_INDEX: process.env.PRIMARY_CITY_INDEX,
    AUTH_KEY: process.env.AUTH_KEY
};
