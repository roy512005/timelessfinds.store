import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true, // e.g. login, update_profile
        },
        entity_type: {
            type: String, // e.g. Product, Order
        },
        entity_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    { timestamps: true } // Handled created_at
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
