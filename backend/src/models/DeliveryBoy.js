import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const deliveryBoySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        address: { type: String, required: true },
        vehicleType: {
            type: String,
            enum: ['Bike', 'Scooter', 'Cycle', 'Auto', 'Van'],
            default: 'Bike',
        },
        status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
        currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
        totalDeliveries: { type: Number, default: 0 },
        rating: { type: Number, default: 5.0 },
    },
    { timestamps: true }
);

// Hash password before save
deliveryBoySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
deliveryBoySchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);
export default DeliveryBoy;
