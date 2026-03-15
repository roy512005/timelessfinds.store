import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
    {
        freeShippingThreshold: {
            type: Number,
            default: 999,
        },
        topBannerText: {
            type: String,
            default: 'Free Shipping Over ₹999 | Easy Returns & Exchanges',
        },
        contactEmail: {
            type: String,
        },
        contactPhone: {
            type: String,
        },
        socialLinks: {
            instagram: { type: String },
            facebook: { type: String },
            twitter: { type: String },
            youtube: { type: String },
        },
        address: {
            type: String,
        },
    },
    { timestamps: true }
);

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema, 'store_settings');
export default StoreSettings;
