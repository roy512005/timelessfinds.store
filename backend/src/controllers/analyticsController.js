import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Return from '../models/Return.js';

// @desc    Full dashboard stats
// @route   GET /api/admin/analytics/sales
export const getSalesAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalOrders, totalCustomers, totalProducts, returnRequests, allPaidOrders, ordersTodayQuery, newUsers, pendingDeliveries] = await Promise.all([
            Order.countDocuments({}),
            User.countDocuments({}),
            Product.countDocuments({}),
            Return.countDocuments({ status: 'Pending' }),
            Order.find({ isPaid: true }),
            Order.find({ createdAt: { $gte: today } }),
            User.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'packed', 'out_for_delivery'] } })
        ]);

        const totalRevenue = allPaidOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
        const ordersToday = ordersTodayQuery.length;
        const revenueToday = ordersTodayQuery.filter(o => o.isPaid).reduce((acc, o) => acc + (o.total_amount || 0), 0);

        res.json({
            totalOrders,
            totalCustomers,
            totalProducts,
            totalRevenue,
            ordersToday,
            revenueToday,
            newUsers,
            pendingDeliveries,
            returnRequests,
            revenueGrowth: 0,
            ordersGrowth: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Revenue stats
// @route   GET /api/admin/analytics/revenue
export const getRevenueStats = async (req, res) => {
    try {
        const orders = await Order.find({ isPaid: true });
        const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
        res.json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Top products by order count
// @route   GET /api/admin/analytics/top-products
export const getTopProducts = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('orderItems.product', 'name');
        const productMap = {};
        for (const order of orders) {
            for (const item of order.orderItems || []) {
                const name = item.title || item.product?.name || 'Unknown';
                productMap[name] = (productMap[name] || 0) + (item.qty || 1);
            }
        }
        const sorted = Object.entries(productMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 7);
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Daily revenue for last 7 days
// @route   GET /api/admin/analytics/daily
export const getDailyRevenue = async (req, res) => {
    try {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - i);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            const orders = await Order.find({ createdAt: { $gte: start, $lt: end } });
            const revenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + (o.total_amount || 0), 0);
            days.push({
                day: start.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
                revenue,
                orders: orders.length
            });
        }
        res.json(days);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Monthly revenue for last 12 months
// @route   GET /api/admin/analytics/monthly
export const getMonthlyRevenue = async (req, res) => {
    try {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const start = new Date();
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            start.setMonth(start.getMonth() - i);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            const orders = await Order.find({ createdAt: { $gte: start, $lt: end } });
            const revenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + (o.total_amount || 0), 0);
            months.push({
                month: start.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
                revenue,
                orders: orders.length
            });
        }
        res.json(months);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
