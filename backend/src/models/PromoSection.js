import mongoose from 'mongoose';

const promoSectionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String, required: true },
        badge: { type: String, default: 'Limited Collection' },
        cta_text: { type: String },
        cta_link: { type: String },
        pieces_left: { type: String },
        time_left: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('PromoSection', promoSectionSchema, 'promo_sections');
