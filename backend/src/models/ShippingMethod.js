import mongoose from 'mongoose';

const shippingMethodSchema = new mongoose.Schema(
    {
        name: {
            type: String, // e.g., Standard, Express, Overnight
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        estimated_days: {
            type: Number,
        },
    },
    { timestamps: true }
);

const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);
export default ShippingMethod;
