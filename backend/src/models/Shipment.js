import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        tracking_number: {
            type: String,
        },
        carrier: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'in_transit', 'delivered', 'failed'],
            default: 'pending',
        },
        shipped_at: {
            type: Date,
        },
        delivered_at: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
