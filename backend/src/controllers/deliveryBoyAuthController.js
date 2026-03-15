import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import DeliveryBoy from '../models/DeliveryBoy.js';
import Order from '../models/Order.js';

const generateToken = (id) =>
    jwt.sign({ id, role: 'delivery' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

// @desc   Login delivery boy
// @route  POST /api/delivery/login
export const loginDeliveryBoy = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password)
            return res.status(400).json({ message: 'Phone and password are required' });

        const boy = await DeliveryBoy.findOne({ phone }).select('+password');
        if (!boy) return res.status(401).json({ message: 'Invalid credentials' });
        if (boy.status === 'Inactive')
            return res.status(403).json({ message: 'Your account is deactivated. Contact admin.' });

        const isMatch = await boy.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            token: generateToken(boy._id),
            deliveryBoy: {
                _id: boy._id,
                name: boy.name,
                phone: boy.phone,
                vehicleType: boy.vehicleType,
                status: boy.status,
                rating: boy.rating,
                totalDeliveries: boy.totalDeliveries,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get delivery boy's own profile
// @route  GET /api/delivery/profile
export const getProfile = async (req, res) => {
    try {
        const boy = await DeliveryBoy.findById(req.deliveryBoy._id);
        if (!boy) return res.status(404).json({ message: 'Not found' });
        res.json(boy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get orders assigned to this delivery boy
// @route  GET /api/delivery/orders
export const getAssignedOrders = async (req, res) => {
    try {
        const orders = await Order.find({ assignedDeliveryBoy: req.deliveryBoy._id })
            .populate('user', 'name phone')
            .populate('orderItems.product', 'name images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single order detail
// @route  GET /api/delivery/orders/:id
export const getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            assignedDeliveryBoy: req.deliveryBoy._id,
        }).populate('user', 'name phone');

        if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update delivery status for an order
// @route  PUT /api/delivery/orders/:id/status
// body: { status: "Picked Up" | "Out for Delivery" | "Delivered" | "Failed" }
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const allowedStatuses = ['Picked Up', 'Out for Delivery', 'Delivered', 'Failed'];
        if (!allowedStatuses.includes(status))
            return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });

        const order = await Order.findOne({
            _id: req.params.id,
            assignedDeliveryBoy: req.deliveryBoy._id,
        });
        if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });

        order.deliveryStatus = status;

        // Push to tracking history
        order.trackingHistory = order.trackingHistory || [];
        order.trackingHistory.push({ status, timestamp: new Date(), note: note || '' });

        if (status === 'Delivered') {
            order.status = 'Delivered';
            order.isDelivered = true;
            order.deliveredAt = new Date();

            // Update delivery boy stats
            await DeliveryBoy.findByIdAndUpdate(req.deliveryBoy._id, {
                $inc: { totalDeliveries: 1 },
                currentOrder: null,
            });
        } else if (status === 'Out for Delivery') {
            order.status = 'Out for Delivery';
        } else if (status === 'Failed') {
            order.status = 'Pending'; // Reset for re-assignment
        }

        await order.save();
        res.json({ message: `Status updated to "${status}"`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
