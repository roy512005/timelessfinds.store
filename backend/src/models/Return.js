import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['requested', 'approved', 'rejected', 'completed'],
            default: 'requested',
        },
    },
    { timestamps: true } // Handles created_at
);

const Return = mongoose.model('Return', returnSchema);
export default Return;
