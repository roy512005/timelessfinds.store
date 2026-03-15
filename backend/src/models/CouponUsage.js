import mongoose from 'mongoose';

const couponUsageSchema = new mongoose.Schema(
    {
        coupon_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
    },
    { timestamps: true }
);

const CouponUsage = mongoose.model('CouponUsage', couponUsageSchema);
export default CouponUsage;
