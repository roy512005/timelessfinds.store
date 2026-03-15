import express from 'express';
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    cancelOrder,
    getMyOrders,
    addGuestOrder,
    trackOrder
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
router.route('/myorders').get(protect, getMyOrders);
router.route('/track/:id').get(trackOrder);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/cancel').post(protect, cancelOrder);

export default router;
