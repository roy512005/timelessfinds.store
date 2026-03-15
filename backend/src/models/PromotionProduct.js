import mongoose from 'mongoose';

const promotionProductSchema = new mongoose.Schema(
    {
        promotion_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promotion',
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    { timestamps: true }
);

const PromotionProduct = mongoose.model('PromotionProduct', promotionProductSchema);
export default PromotionProduct;
