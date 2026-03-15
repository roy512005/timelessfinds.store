import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
    {
        payment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'processed', 'failed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Refund = mongoose.model('Refund', refundSchema);
export default Refund;
