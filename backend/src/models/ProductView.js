import mongoose from 'mongoose';

const productViewSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        ip_address: {
            type: String,
        },
        viewed_at: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const ProductView = mongoose.model('ProductView', productViewSchema);
export default ProductView;
