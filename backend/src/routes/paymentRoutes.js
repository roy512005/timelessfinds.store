import express from 'express';
import { createPaymentIntent, verifyPayment, getPaymentMethods } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', createPaymentIntent);
router.post('/verify', verifyPayment);
router.get('/methods', getPaymentMethods);

export default router;
