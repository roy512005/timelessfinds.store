import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
    {
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductVariant',
            required: true,
        },
        warehouse_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true,
        },
        stock_quantity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
