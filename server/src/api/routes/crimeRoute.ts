// Importing express package
import * as express from 'express';
import CrimeController from '../controllers/crimeController'

const router = express.Router();
const Controller = new CrimeController()

// Creating Database
router.get('/create_riskzone_db/', Controller.create_riskzone_db)
router.get('/create_metadata_db/', Controller.create_metadata_db)
router.get('/create_crimedata_db/', Controller.create_crimedata_db)
router.get('/create_monthdata_db/', Controller.create_monthdata_db)
router.get('/create_weekdata_db/', Controller.create_weekdata_db)

// Get Metadata Info
router.get('/get_metadata_info/', Controller.get_metadata_info)
router.post('/get_yearly_zipcodes_info_by_city', Controller.get_yearly_zipcodes_info_by_city)
router.post('/get_crimedata_info_by_year_zipcode', Controller.get_crimedata_info_by_year_zipcode)
router.post('/get_crimedata_info_by_city', Controller.get_crimedata_info_by_city)

export default router;