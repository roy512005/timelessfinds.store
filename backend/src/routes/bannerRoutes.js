import express from 'express';
import { getBanners } from '../controllers/bannerController.js';

const router = express.Router();

router.route('/').get(getBanners);

export default router;
