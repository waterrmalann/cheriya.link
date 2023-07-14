import express from 'express';
import rootController from '../controllers/rootController.mjs';

const router = express.Router();

// GET /
// Route for displaying the index page.
router.get('/', rootController.displayHome);

export default router;