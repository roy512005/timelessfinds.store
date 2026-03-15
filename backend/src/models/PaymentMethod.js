import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
    {
        method_name: {
            type: String,
            required: true,
            unique: true,
        },
        provider: {
            type: String,
            required: true, // e.g., Stripe, Razorpay
        },
    },
    { timestamps: true }
);

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
export default PaymentMethod;
