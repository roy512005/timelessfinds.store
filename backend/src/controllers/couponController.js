import Coupon from '../models/Coupon.js';

// @desc    Apply coupon
// @route   POST /api/coupons/apply
export const applyCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (coupon) {
            if (!coupon.isActive) {
                return res.status(400).json({ message: 'Coupon is currently inactive' });
            }
            if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) {
                return res.status(400).json({ message: 'Coupon expired' });
            }
            if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
                return res.status(400).json({ message: 'Coupon usage limit reached' });
            }
            if (cartTotal < coupon.min_order_amount) {
                return res.status(400).json({ message: `Minimum order amount for this coupon is ₹${coupon.min_order_amount}` });
            }

            // Calculate discount
            let discountValue = 0;
            if (coupon.discount_type === 'percentage') {
                discountValue = (cartTotal * coupon.discount_value) / 100;
                if (coupon.max_discount_amount > 0 && discountValue > coupon.max_discount_amount) {
                    discountValue = coupon.max_discount_amount;
                }
            } else {
                discountValue = coupon.discount_value;
            }

            res.json({ success: true, discount: Math.round(discountValue), coupon: coupon.code });
        } else {
            res.status(404).json({ message: 'Invalid coupon code' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coupons
// @route   GET /api/admin/coupons
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create coupon
// @route   POST /api/admin/coupons
export const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
