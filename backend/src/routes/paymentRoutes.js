import express from 'express';
import { createPaymentIntent, verifyPayment, getPaymentMethods, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', createPaymentIntent);
router.post('/verify', verifyPayment);
router.get('/methods', getPaymentMethods);

// Secure server-to-server Razorpay webhook
// MUST use express.raw() here — NOT express.json() — so the raw Buffer is available for HMAC verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
