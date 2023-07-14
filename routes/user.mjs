import express from 'express';
import nocache from 'nocache';
import { isAuthenticated } from '../utils/authenticate.mjs';
import userController from '../controllers/userController.mjs';

const router = express.Router();

// GET /user/dashboard
// Route for displaying the user dashboard.
router.get('/dashboard', nocache(), isAuthenticated, userController.displayDashboard);

export default router;