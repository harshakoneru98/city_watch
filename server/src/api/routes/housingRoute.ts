// Importing express package
import * as express from 'express';
import HousingController from '../controllers/housingController'

const router = express.Router();
const Controller = new HousingController()

// Creating Database
router.get('/create_housing_price_db/', Controller.create_housing_price_db)

// Housing Cities Info
router.get('/get_housing_cities_info/', Controller.get_housing_cities_info)
router.post('/get_housing_recommendation_info', Controller.get_housing_recommendation_info)

export default router;