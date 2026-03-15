import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
