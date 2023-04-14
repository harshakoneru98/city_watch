// Importing express package
import * as express from 'express';
import CrimeController from '../controllers/crimeController'

const router = express.Router();
const Controller = new CrimeController()

// Creating RiskZone DB
router.get('/create_riskzone_db/', Controller.create_riskzone_db)

export default router;