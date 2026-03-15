import mongoose from 'mongoose';

const searchLogSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        search_query: {
            type: String,
            required: true,
        },
        searched_at: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const SearchLog = mongoose.model('SearchLog', searchLogSchema);
export default SearchLog;
