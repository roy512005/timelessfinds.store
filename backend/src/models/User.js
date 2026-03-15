import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['customer', 'staff', 'admin'],
            default: 'customer',
        },
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended', 'blocked'],
            default: 'active',
        },
        rewardPoints: {
            type: Number,
            default: 0,
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
