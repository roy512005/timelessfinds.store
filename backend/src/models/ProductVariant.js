import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        size: {
            type: String,
        },
        color: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant;
