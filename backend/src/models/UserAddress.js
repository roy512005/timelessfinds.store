import mongoose from 'mongoose';

const userAddressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address_line1: {
            type: String,
            required: true,
        },
        address_line2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postal_code: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
            default: 'India',
        },
        is_default: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const UserAddress = mongoose.model('UserAddress', userAddressSchema);
export default UserAddress;
