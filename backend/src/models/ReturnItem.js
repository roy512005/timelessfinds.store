import mongoose from 'mongoose';

const returnItemSchema = new mongoose.Schema(
    {
        return_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Return',
            required: true,
        },
        order_item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const ReturnItem = mongoose.model('ReturnItem', returnItemSchema);
export default ReturnItem;
