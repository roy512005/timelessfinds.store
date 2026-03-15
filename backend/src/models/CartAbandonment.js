import mongoose from 'mongoose';

const cartAbandonmentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },
        abandoned_at: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const CartAbandonment = mongoose.model('CartAbandonment', cartAbandonmentSchema);
export default CartAbandonment;
