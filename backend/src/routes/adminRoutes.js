import express from 'express';
import { createProduct, updateProduct, deleteProduct, getProducts } from '../controllers/productController.js';
import { createCategory, updateCategory, deleteCategory, getCategories } from '../controllers/categoryController.js';
import { getAllUsers, updateUser } from '../controllers/userAdminController.js';
import { getBanners, addBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { getInventory, updateStock, getLowStock } from '../controllers/inventoryController.js';
import { deleteReview } from '../controllers/reviewController.js';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { getSalesAnalytics, getTopProducts, getRevenueStats, getDailyRevenue, getMonthlyRevenue } from '../controllers/analyticsController.js';
import { getOrders, updateOrderStatus, getUserOrdersForAdmin } from '../controllers/orderController.js';
import { getDeliveryBoys, createDeliveryBoy, updateDeliveryBoy, deleteDeliveryBoy, assignDelivery, updateDeliveryStatus } from '../controllers/deliveryController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import Return from '../models/Return.js';

const router = express.Router();

// All routes protected — admin only
router.use(protect, admin);

// --- Product Admin APIs ---
router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id').put(updateProduct).delete(deleteProduct);

// --- Category Admin APIs ---
router.route('/categories').get(getCategories).post(createCategory);
router.route('/categories/:id').put(updateCategory).delete(deleteCategory);

// --- User / Customer Admin APIs ---
router.route('/users').get(getAllUsers);
router.route('/users/:id').put(updateUser);
router.route('/users/:id/orders').get(getUserOrdersForAdmin);

// --- Order Admin APIs ---
router.route('/orders').get(getOrders);
router.route('/orders/:id/status').put(updateOrderStatus);

// --- Delivery Boy Admin APIs ---
router.route('/delivery-boys').get(getDeliveryBoys).post(createDeliveryBoy);
router.route('/delivery-boys/:id').put(updateDeliveryBoy).delete(deleteDeliveryBoy);
router.post('/assign-delivery', assignDelivery);
router.put('/delivery-status/:orderId', updateDeliveryStatus);

// --- Inventory Admin APIs ---
router.route('/inventory').get(getInventory);
router.route('/inventory/low-stock').get(getLowStock);
router.route('/inventory/:variant_id').put(updateStock);

// --- Review Admin APIs ---
router.route('/reviews/:id').delete(deleteReview);

// --- Coupon Admin APIs ---
router.route('/coupons').get(getCoupons).post(createCoupon);
router.route('/coupons/:id').put(updateCoupon).delete(deleteCoupon);

// --- Analytics Admin APIs ---
router.route('/analytics/sales').get(getSalesAnalytics);
router.route('/analytics/top-products').get(getTopProducts);
router.route('/analytics/revenue').get(getRevenueStats);
router.route('/analytics/daily').get(getDailyRevenue);
router.route('/analytics/monthly').get(getMonthlyRevenue);

// --- Banner/CMS Admin APIs ---
router.route('/banners').get(getBanners).post(addBanner);
router.route('/banners/:id').put(updateBanner).delete(deleteBanner);

// --- Returns Admin APIs ---
router.route('/returns').get(async (req, res) => {
    try {
        const returns = await Return.find({})
            .populate('user', 'name email phone')
            .populate('order')
            .sort({ createdAt: -1 });
        res.json(returns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.route('/returns/:id/approve').put(async (req, res) => {
    try {
        const ret = await Return.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
        if (!ret) return res.status(404).json({ message: 'Return not found' });
        res.json(ret);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.route('/returns/:id/reject').put(async (req, res) => {
    try {
        const ret = await Return.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
        if (!ret) return res.status(404).json({ message: 'Return not found' });
        res.json(ret);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
