import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';

// Helper to get or create cart
const getUserCart = async (userId) => {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
        cart = await Cart.create({ user_id: userId });
    }
    return cart;
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res) => {
    try {
        const { product_variant_id, quantity, price } = req.body;
        const cart = await getUserCart(req.user._id);

        let cartItem = await CartItem.findOne({ cart_id: cart._id, product_variant_id });
        if (cartItem) {
            cartItem.quantity += Number(quantity || 1);
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cart_id: cart._id,
                product_variant_id,
                quantity: Number(quantity || 1),
                price: price || 0
            });
        }
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
    try {
        const cart = await getUserCart(req.user._id);
        const items = await CartItem.find({ cart_id: cart._id }).populate({
            path: 'product_variant_id',
            model: 'Product'
        });
        
        res.json({ cart, items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item
// @route   PUT /api/cart/:id
export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findById(req.params.id);

        if (cartItem) {
            cartItem.quantity = Number(quantity);
            await cartItem.save();
            res.json(cartItem);
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove cart item
// @route   DELETE /api/cart/:id
export const removeCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByIdAndDelete(req.params.id);
        if (cartItem) {
            res.json({ message: 'Item removed from cart' });
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
