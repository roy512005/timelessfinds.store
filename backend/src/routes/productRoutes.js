import express from 'express';
import {
    getProducts,
    getProductById,
    getTrendingProducts,
    searchProducts,
    createProductReview,
    getFilters
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/filters').get(getFilters);
router.route('/search').get(searchProducts);
router.route('/trending').get(getTrendingProducts);
router.route('/:id').get(getProductById);

router.route('/:id/reviews')
    .get(async (req, res) => {
        // Fallback quick inline until reviewController is mapped
        const product = await import('../models/Product.js').then(m => m.default.findById(req.params.id));
        res.json(product ? product.reviews : []);
    })
    .post(protect, createProductReview);

export default router;
