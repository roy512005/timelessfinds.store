import mongoose from 'mongoose';

const attributeValueSchema = new mongoose.Schema(
    {
        attribute_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attribute',
            required: true,
        },
        value: {
            type: String,
            required: true, // e.g. XL, Red, Cotton
        },
    },
    { timestamps: true }
);

const AttributeValue = mongoose.model('AttributeValue', attributeValueSchema);
export default AttributeValue;
