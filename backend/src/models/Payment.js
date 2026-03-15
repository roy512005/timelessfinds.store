import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        payment_method: {
            type: String, // E.g., Credit Card, UPI
            required: true,
        },
        transaction_id: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paid_at: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
