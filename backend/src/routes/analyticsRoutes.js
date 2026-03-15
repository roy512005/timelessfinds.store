import express from 'express';
import { getSalesAnalytics } from '../controllers/analyticsController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getSalesAnalytics);

export default router;
