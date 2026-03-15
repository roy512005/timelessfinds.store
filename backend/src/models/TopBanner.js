import mongoose from 'mongoose';

const topBannerSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('TopBanner', topBannerSchema, 'top_banners');
