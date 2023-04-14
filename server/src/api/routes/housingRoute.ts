// Importing express package
import * as express from 'express';
import HousingController from '../controllers/housingController'

const router = express.Router();
const Controller = new HousingController()

// Creating Database
router.get('/create_housing_price_db/', Controller.create_housing_price_db)

export default router;