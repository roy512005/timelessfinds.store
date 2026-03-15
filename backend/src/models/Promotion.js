import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true } // Handles created_at, updated_at
);

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;
