import express from 'express';
import { addToWishlist, getWishlist, removeWishlistItem } from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getWishlist)
    .post(addToWishlist);

router.route('/:id')
    .delete(removeWishlistItem);

export default router;
