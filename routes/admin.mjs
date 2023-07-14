import express from 'express';
import nocache from 'nocache';
import { isAuthenticated, isAdmin } from '../utils/authenticate.mjs';
import adminController from '../controllers/adminController.mjs';

const router = express.Router();

// GET /admin/dashboard
// Route for displaying the admin dashboard.
router.get('/dashboard', nocache(), isAuthenticated, isAdmin, adminController.displayDashboard);

// GET /admin/fetch
// Route for fetching user data.
router.get('/fetch', isAuthenticated, isAdmin, adminController.fetchUserdata);

// DELETE /admin/deleteUser/:userId
// Route for deleting an user.
router.delete('/deleteUser/:userId', isAuthenticated, isAdmin, adminController.handleUserRemoval);

// PATCH /admin/editUser/:userId
// Route for editing an user.
router.patch('/editUser/:userId', isAuthenticated, isAdmin, adminController.handleUserEdit);

export default router;