import ProductVariant from '../models/ProductVariant.js';

// @desc    Get inventory list
// @route   GET /api/admin/inventory
export const getInventory = async (req, res) => {
    try {
        const inventory = await ProductVariant.find({}).populate('product_id', 'title price');
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get low stock variants
// @route   GET /api/admin/inventory/low-stock
export const getLowStock = async (req, res) => {
    try {
        // Assume < 10 is low stock for blueprint
        const inventory = await ProductVariant.find({ stock: { $lt: 10 } }).populate('product_id', 'title');
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update stock
// @route   PUT /api/admin/inventory/:variant_id
export const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const variant = await ProductVariant.findById(req.params.variant_id);

        if (variant) {
            variant.stock = Number(stock);
            const updatedVariant = await variant.save();
            res.json(updatedVariant);
        } else {
            res.status(404).json({ message: 'Variant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
