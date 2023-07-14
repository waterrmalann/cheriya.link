import express from 'express';
import authController from '../controllers/authController.mjs';
import nocache from 'nocache';
import { forgetMe, isLoggedIn, rememberMe } from '../utils/authenticate.mjs';

const router = express.Router();

// GET /auth/register
// Route for displaying the register page.
router.get('/register', nocache(), rememberMe, isLoggedIn, authController.displayRegistration);

// POST /auth/register
// Route for registering a new account.
router.post('/register', authController.handleRegistration);

// GET /auth/login
// Route for displaying the login page.
router.get('/login', nocache(), rememberMe, isLoggedIn, authController.displayLogin);

// POST /auth/login
// Route for logging in.
router.post("/login", authController.handleLogin);

// DELETE /auth/logout
// Route for logging out.
// todo: make it DELETE
router.get("/logout", forgetMe, authController.handleLogout);

export default router;