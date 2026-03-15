import DeliveryBoy from '../models/DeliveryBoy.js';
import Order from '../models/Order.js';

// @desc  Get all delivery boys
// @route GET /api/admin/delivery-boys
export const getDeliveryBoys = async (req, res) => {
    try {
        const boys = await DeliveryBoy.find({});
        res.json(boys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Create delivery boy
// @route POST /api/admin/delivery-boys
export const createDeliveryBoy = async (req, res) => {
    try {
        const { name, phone, password, address, vehicleType, status } = req.body;
        if (!phone || !password) return res.status(400).json({ message: 'Phone and password are required' });
        
        const existing = await DeliveryBoy.findOne({ phone });
        if (existing) return res.status(400).json({ message: 'Phone number already registered' });
        
        const boy = await DeliveryBoy.create({ 
            name, 
            phone, 
            password, 
            address, 
            vehicleType: vehicleType || 'Bike', 
            status: status || 'Active' 
        });
        
        res.status(201).json(boy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Update delivery boy
// @route PUT /api/admin/delivery-boys/:id
export const updateDeliveryBoy = async (req, res) => {
    try {
        const boy = await DeliveryBoy.findById(req.params.id);
        if (!boy) return res.status(404).json({ message: 'Delivery boy not found' });
        Object.assign(boy, req.body);
        const updated = await boy.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Delete delivery boy
// @route DELETE /api/admin/delivery-boys/:id
export const deleteDeliveryBoy = async (req, res) => {
    try {
        const boy = await DeliveryBoy.findByIdAndDelete(req.params.id);
        if (!boy) return res.status(404).json({ message: 'Delivery boy not found' });
        res.json({ message: 'Delivery boy removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Assign order to delivery boy
// @route POST /api/admin/assign-delivery
export const assignDelivery = async (req, res) => {
    try {
        const { orderId, deliveryBoyId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        const boy = await DeliveryBoy.findById(deliveryBoyId);
        if (!boy) return res.status(404).json({ message: 'Delivery boy not found' });

        order.assignedDeliveryBoy = deliveryBoyId;
        order.deliveryStatus = 'Assigned';
        order.status = 'out_for_delivery';
        await order.save();

        res.json({ message: `Order assigned to ${boy.name}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Update delivery status for an order
// @route PUT /api/admin/delivery-status/:orderId
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { deliveryStatus } = req.body;
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.deliveryStatus = deliveryStatus;
        if (deliveryStatus === 'Delivered') {
            order.status = 'delivered';
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
