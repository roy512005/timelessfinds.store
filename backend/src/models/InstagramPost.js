import mongoose from 'mongoose';

const instagramPostSchema = new mongoose.Schema(
    {
        image_url: { type: String, required: true },
        postUrl: { type: String },
        likes: { type: String, default: '0' },
        handle: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('InstagramPost', instagramPostSchema, 'instagram_posts');
