// Importing express package
import * as express from 'express';
import CrimeController from '../controllers/crimeController'

const router = express.Router();
const Controller = new CrimeController()

// Creating RiskZone DB
router.get('/create_riskzone_db/', Controller.create_riskzone_db)
router.get('/create_metadata_db/', Controller.create_metadata_db)
router.get('/create_crimedata_db/', Controller.create_crimedata_db)
router.get('/create_monthdata_db/', Controller.create_monthdata_db)

export default router;