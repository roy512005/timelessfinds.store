import Review from '../models/Review.js';

// @desc    Add review
// @route   POST /api/reviews
export const addReview = async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;

        const existingReview = await Review.findOne({ product_id, user_id: req.user._id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({
            product_id,
            user_id: req.user._id,
            rating: Number(rating),
            comment,
        });

        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.id }).populate('user_id', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            await review.deleteOne();
            res.json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
