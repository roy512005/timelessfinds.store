import mongoose from 'mongoose';

const orderStatusHistorySchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        changed_at: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const OrderStatusHistory = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);
export default OrderStatusHistory;
