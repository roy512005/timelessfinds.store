import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true } // Handles created_at
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
