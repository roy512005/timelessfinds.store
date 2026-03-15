import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        order_number: {
            type: String,
            required: true,
            unique: true,
        },
        orderItems: [
            {
                title: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: false },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            }
        ],
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address_line1: { type: String, required: true },
            city: { type: String, required: true },
            postal_code: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'packed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
            default: 'pending',
        },
        assignedDeliveryBoy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryBoy',
            default: null,
        },
        deliveryStatus: {
            type: String,
            enum: ['Unassigned', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered', 'Failed Delivery'],
            default: 'Unassigned',
        },
        courierPartner: {
            type: String, // e.g., 'Delhivery', 'BlueDart'
            default: '',
        },
        trackingNumber: {
            type: String,
            default: '',
        },
        courierTrackingUrl: {
            type: String,
            default: '',
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        total_amount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
