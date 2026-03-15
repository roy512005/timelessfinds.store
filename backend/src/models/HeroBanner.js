import mongoose from 'mongoose';

const heroBannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        description: { type: String },
        image: { type: String, required: true },
        button1_text: { type: String },
        button1_link: { type: String },
        button2_text: { type: String },
        button2_link: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('HeroBanner', heroBannerSchema, 'hero_banners');
