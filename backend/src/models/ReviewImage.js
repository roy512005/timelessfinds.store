import mongoose from 'mongoose';

const reviewImageSchema = new mongoose.Schema(
    {
        review_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            required: true,
        },
        image_url: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const ReviewImage = mongoose.model('ReviewImage', reviewImageSchema);
export default ReviewImage;
