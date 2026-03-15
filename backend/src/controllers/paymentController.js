import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// @desc   Create Razorpay order
// @route  POST /api/payments/create-order
export const createPaymentIntent = async (req, res) => {
    try {
        const { totalAmount, orderId } = req.body;
        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const amount = Math.round(totalAmount * 100); // Convert to paisa
        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_${orderId || Date.now()}`,
            notes: { orderId: orderId || '' },
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Verify Razorpay payment + mark order as Paid
// @route  POST /api/payments/verify
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,   // our DB order _id
        } = req.body;

        // --- HMAC-SHA256 Signature Verification ---
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign)
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
        }

        // --- Update Order: mark as Paid + Confirmed ---
        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = new Date();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'paid',
                    razorpay_order_id,
                    razorpay_signature,
                };
                order.status = 'Confirmed';
                await order.save();

                // Log payment record
                await Payment.create({
                    order: orderId,
                    user: order.user,
                    method: 'Razorpay',
                    amount: order.totalPrice,
                    status: 'paid',
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                }).catch(() => { }); // Non-blocking — Payment model may vary
            }
        }

        res.json({
            status: 'success',
            message: 'Payment verified. Order confirmed!',
            paymentId: razorpay_payment_id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get available payment methods (from settings or static fallback)
// @route  GET /api/payments/methods
export const getPaymentMethods = async (req, res) => {
    res.json({
        methods: [
            { id: 'razorpay', name: 'Credit / Debit Card, UPI, Netbanking, Wallets', logo: '💳' },
            { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', logo: '📱' },
            { id: 'cod', name: 'Cash on Delivery', logo: '💵' },
        ],
    });
};

// @desc   Process refund via Razorpay
// @route  POST /api/admin/returns/:id/refund
export const processRefund = async (req, res) => {
    try {
        const { paymentId, amount } = req.body;
        if (!paymentId) return res.status(400).json({ message: 'paymentId is required' });

        const refundAmount = amount ? Math.round(amount * 100) : undefined;

        const refund = await razorpay.payments.refund(paymentId, {
            ...(refundAmount ? { amount: refundAmount } : {}),
            notes: { reason: 'Customer return/refund request' },
        });

        res.json({
            status: 'success',
            refundId: refund.id,
            amount: refund.amount / 100,
            message: 'Refund initiated successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
