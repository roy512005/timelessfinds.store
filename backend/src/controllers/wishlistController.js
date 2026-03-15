import Wishlist from '../models/Wishlist.js';
import WishlistItem from '../models/WishlistItem.js';

// Helper to get or create wishlist
const getUserWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user_id: userId });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user_id: userId });
    }
    return wishlist;
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;
        const wishlist = await getUserWishlist(req.user._id);

        let item = await WishlistItem.findOne({ wishlist_id: wishlist._id, product_id });
        if (!item) {
            item = await WishlistItem.create({
                wishlist_id: wishlist._id,
                product_id
            });
        }
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get wishlist
// @route   GET /api/wishlist
export const getWishlist = async (req, res) => {
    try {
        const wishlist = await getUserWishlist(req.user._id);
        const items = await WishlistItem.find({ wishlist_id: wishlist._id }).populate('product_id');
        res.json({ wishlist, items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
export const removeWishlistItem = async (req, res) => {
    try {
        const item = await WishlistItem.findByIdAndDelete(req.params.id);
        if (item) {
            res.json({ message: 'Item removed from wishlist' });
        } else {
            res.status(404).json({ message: 'Wishlist item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
