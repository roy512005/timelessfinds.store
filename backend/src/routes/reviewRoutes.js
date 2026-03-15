import express from 'express';
import { addReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

import Review from '../models/Review.js';

const router = express.Router();

router.get('/featured', async (req, res) => {
    const featured = await Review.find({ isFeatured: true }).populate('user_id', 'name').limit(6);
    res.json(featured);
});

router.post('/', protect, addReview);

export default router;
