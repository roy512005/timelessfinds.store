import express from 'express';
import { getHeroBanner, getLookCategories, getPromo, getCreator, getTopBanners, saveTopBanner, deleteTopBanner, getStoreSettings, updateStoreSettings } from '../controllers/homeController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/hero', getHeroBanner);
router.get('/look-categories', getLookCategories);
router.get('/promo', getPromo);
router.get('/creator', getCreator);
router.get('/top-banners', getTopBanners);
router.post('/top-banners', protect, admin, saveTopBanner);
router.delete('/top-banners/:id', protect, admin, deleteTopBanner);

router.get('/settings', getStoreSettings);
router.put('/settings', protect, admin, updateStoreSettings);

export default router;
