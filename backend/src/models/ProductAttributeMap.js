import mongoose from 'mongoose';

const productAttributeMapSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        attribute_value_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AttributeValue',
            required: true,
        },
    },
    { timestamps: true }
);

const ProductAttributeMap = mongoose.model('ProductAttributeMap', productAttributeMapSchema);
export default ProductAttributeMap;
