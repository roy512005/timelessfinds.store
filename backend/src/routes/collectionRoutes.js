import express from 'express';
import {
    getCollections,
    getCollectionBySlug,
    getAdminCollections,
    createCollection,
    updateCollection,
    deleteCollection
} from '../controllers/collectionController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCollections);
router.route('/:slug').get(getCollectionBySlug);
router.route('/admin').get(protect, admin, getAdminCollections).post(protect, admin, createCollection);
router.route('/admin/:id').put(protect, admin, updateCollection).delete(protect, admin, deleteCollection);

export default router;
