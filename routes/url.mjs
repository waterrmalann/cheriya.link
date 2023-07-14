import express from 'express';
import urlController from '../controllers/urlController.mjs';
import { isAuthenticated } from '../utils/authenticate.mjs';

const router = express.Router();

// POST /url/shorten
// Route for shortening an URL (user must be authenticated)
router.post('/shorten', isAuthenticated, urlController.handleURLShortening);

// GET /url/:shortCode
// Route for previewing an URL (no authentication required)
router.get('/:shortCode', urlController.displayURLPreview);

// DELETE /url/:shortCode
// Route for deleting an URL (user must be authenticated and own the URL)
router.delete('/:shortCode', isAuthenticated, urlController.handleURLDeletion);

export default router;