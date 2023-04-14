import * as express from 'express';
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'

import crimeRoute from './api/routes/crimeRoute'

export const app = express();
app.use(morgan('dev'))

// BodyParsing URLEncoded and JSON Formats
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handling CORS Errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

// Routes which should handle requests
app.use('/api/crime', crimeRoute);

app.use((req, res, next) => {
    const error = new Error('Not found')
    // res.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status = error.status || 500
    res.json({
        error: {
            message: error.message
        }
    })
})
