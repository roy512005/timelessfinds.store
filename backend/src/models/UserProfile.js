import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
        },
        date_of_birth: {
            type: Date,
        },
        profile_image: {
            type: String,
        },
    },
    { timestamps: true }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile;
