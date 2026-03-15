import mongoose from 'mongoose';

const orderAddressSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true,
        },
        shipping_address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAddress', // Snapshot or direct reference
            required: true,
        },
        billing_address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAddress',
        },
    },
    { timestamps: true }
);

const OrderAddress = mongoose.model('OrderAddress', orderAddressSchema);
export default OrderAddress;
