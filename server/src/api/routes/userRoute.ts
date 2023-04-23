// Importing express package
import * as express from 'express';
import UserController from '../controllers/userController'

const router = express.Router();
const Controller = new UserController()

// Creating Database
router.post('/create_user', Controller.create_user)

// Check User in Database
router.post('/check_user', Controller.check_user)
router.post('/get_user_data', Controller.get_user_data)


export default router;