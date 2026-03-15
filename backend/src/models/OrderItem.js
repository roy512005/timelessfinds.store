import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductVariant',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true, // Price snapshot
        },
    },
    { timestamps: true }
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;
