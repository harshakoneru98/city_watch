// Importing express package
import * as express from 'express';
import UserController from '../controllers/userController'

const router = express.Router();
const Controller = new UserController()

// Creating Database
router.post('/create_user', Controller.create_user)

export default router;