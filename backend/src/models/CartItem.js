import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        price: {
            type: Number,
            required: true, // Price snapshot at time of adding
        },
    },
    { timestamps: true }
);

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;
