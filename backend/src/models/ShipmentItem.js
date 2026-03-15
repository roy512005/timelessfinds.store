import mongoose from 'mongoose';

const shipmentItemSchema = new mongoose.Schema(
    {
        shipment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shipment',
            required: true,
        },
        order_item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const ShipmentItem = mongoose.model('ShipmentItem', shipmentItemSchema);
export default ShipmentItem;
