import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image_url: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        position: {
            type: String,
            default: 'hero',
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
