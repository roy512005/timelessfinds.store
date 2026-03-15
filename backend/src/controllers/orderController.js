import Order from '../models/Order.js';

export const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            order_number: 'ORD' + Math.floor(Math.random() * 1000000),
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addGuestOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            order_number: 'ORD' + Math.floor(Math.random() * 1000000), // generic mock ID strategy for Guest
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        let order;

        // Try finding by _id or order_number
        if (id.startsWith('ORD')) {
            order = await Order.findOne({ order_number: id }).populate('user', 'name email');
        } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id).populate('user', 'name email');
        }

        if (order) {
            // If user is guest, we don't check ownership here (frontend handles email check if needed, or we could add it here)
            // If user is logged in, check role or ownership
            const isAuthorized = !order.user || 
                               (req.user && (req.user.role === 'admin' || req.user.role === 'staff' || order.user._id.equals(req.user._id)));
            
            if (isAuthorized) {
                return res.json(order);
            }
        }
        
        res.status(404).json({ message: 'Order not found or unauthorized' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track order (Public)
// @route   GET /api/orders/track/:id
export const trackOrder = async (req, res) => {
    try {
        const id = req.params.id;
        let order;

        if (id.startsWith('ORD')) {
            order = await Order.findOne({ order_number: id }).populate('user', 'name email').populate('assignedDeliveryBoy', 'name phone vehicleType');
        } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id).populate('user', 'name email').populate('assignedDeliveryBoy', 'name phone vehicleType');
        }

        if (order) {
            // Return order status and basic info
            return res.json(order);
        }
        
        res.status(404).json({ message: 'Order not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders for a specific user (Admin)
// @route   GET /api/admin/users/:id/orders
export const getUserOrdersForAdmin = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            if (req.body.status === 'delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order && (req.user.role === 'admin' || req.user.role === 'staff' || order.user._id.equals(req.user._id))) {
            order.status = 'cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
