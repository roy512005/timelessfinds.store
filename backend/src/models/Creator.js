import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        handle: { type: String, required: true },
        followers: { type: String },
        description: { type: String },
        pieces_total: { type: Number },
        pieces_remaining: { type: Number },
        image: { type: String, required: true },
        cta_text: { type: String },
        cta_link: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('Creator', creatorSchema, 'creators');
