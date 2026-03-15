import mongoose from 'mongoose';

const inventoryMovementSchema = new mongoose.Schema(
    {
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductVariant',
            required: true,
        },
        change_type: {
            type: String,
            enum: ['receive', 'ship', 'return', 'adjustment'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        reference: {
            type: String, // e.g. Order ID, PO number
        },
    },
    { timestamps: true } // created_at is handled by timestamps
);

const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);
export default InventoryMovement;
