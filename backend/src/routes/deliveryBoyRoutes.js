import express from 'express';
import {
    loginDeliveryBoy,
    getProfile,
    getAssignedOrders,
    getOrderDetail,
    updateDeliveryStatus
} from '../controllers/deliveryBoyAuthController.js';
import { protect, deliveryGuard } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', loginDeliveryBoy);

// Protected delivery routes
router.use(protect, deliveryGuard);
router.get('/profile', getProfile);
router.get('/orders', getAssignedOrders);
router.get('/orders/:id', getOrderDetail);
router.put('/orders/:id/status', updateDeliveryStatus);

export default router;
