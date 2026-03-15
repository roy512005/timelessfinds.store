import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        discount_type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discount_value: {
            type: Number,
            required: true,
        },
        min_order_amount: {
            type: Number,
            default: 0,
        },
        max_discount_amount: {
            type: Number,
            default: 0, // 0 means no limit
        },
        usage_limit: {
            type: Number,
            default: 0, // 0 means unlimited
        },
        used_count: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expires_at: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
