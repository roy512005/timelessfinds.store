import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        ip_address: {
            type: String,
        },
        device: {
            type: String,
        },
        expires_at: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const UserSession = mongoose.model('UserSession', userSessionSchema);
export default UserSession;
