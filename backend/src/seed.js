/**
 * Timeless Finds — Database Seeder
 * Run: npm run seed
 * Creates admin user + 6 sample products in MongoDB Atlas.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// ── Minimal User schema (no pre-save hook — password pre-hashed below)
const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'customer' },
    status: { type: String, default: 'active' },
    phone: String,
    rewardPoints: { type: Number, default: 0 },
    wishlist: [],
}, { timestamps: true }));

// ── Minimal Product schema
const ProductModel = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: String, default: 'active' },
    images: [{ url: String, alt: String }],
    colors: [{ name: String, hexCode: String }],
    sizes: [{ size: String, stock: Number }],
    stock: { type: Number, default: 50 },
    reviews: [],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isFlashSale: { status: { type: Boolean, default: false } },
    viewsCount: { type: Number, default: 0 },
}, { timestamps: true }));

const seed = async () => {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB!');

    // ── Create admin user
    let admin = await UserModel.findOne({ email: 'admin@timelessfinds.com' });
    if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        admin = new UserModel({
            name: 'Admin',
            email: 'admin@timelessfinds.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active',
        });
        await admin.save({ validateBeforeSave: false });
        console.log('✅ Admin created  →  admin@timelessfinds.com / admin123');
    } else {
        console.log('ℹ️  Admin already exists.');
    }

    // ── Create sample customer
    let customer = await UserModel.findOne({ email: 'customer@example.com' });
    if (!customer) {
        const hashedPassword = await bcrypt.hash('customer123', 10);
        customer = new UserModel({
            name: 'Ananya Sharma',
            email: 'customer@example.com',
            password: hashedPassword,
            role: 'customer',
            status: 'active',
        });
        await customer.save({ validateBeforeSave: false });
        console.log('✅ Customer created  →  customer@example.com / customer123');
    } else {
        console.log('ℹ️  Customer already exists.');
    }

    // ── Seed products
    const count = await ProductModel.countDocuments();
    if (count > 0) {
        console.log(`ℹ️  ${count} products already exist — skipping product seed.`);
    } else {
        const products = [
            {
                name: 'Velvet Evening Gown',
                slug: 'velvet-evening-gown',
                description: 'A breathtaking deep velvet gown with an adjustable corseted back.',
                price: 12900, category: 'Evening Wear', status: 'active',
                images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', alt: 'Velvet Gown' }],
                colors: [{ name: 'Midnight Black', hexCode: '#1a1a1a' }, { name: 'Royal Burgundy', hexCode: '#800020' }],
                sizes: [{ size: 'XS', stock: 5 }, { size: 'S', stock: 12 }, { size: 'M', stock: 18 }, { size: 'L', stock: 8 }],
                stock: 43, rating: 4.8, numReviews: 124, isBestSeller: true, user: admin._id,
            },
            {
                name: 'Summer Floral Slip Dress',
                slug: 'summer-floral-slip',
                description: 'Light chiffon slip dress with hand-painted floral patterns.',
                price: 4500, category: 'Casual', status: 'active',
                images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80', alt: 'Floral Slip' }],
                colors: [{ name: 'Blush Pink', hexCode: '#ffb6c1' }, { name: 'Soft White', hexCode: '#f8f8f8' }],
                sizes: [{ size: 'XS', stock: 8 }, { size: 'S', stock: 15 }, { size: 'M', stock: 3 }, { size: 'L', stock: 6 }],
                stock: 32, rating: 4.6, numReviews: 87, isBestSeller: true, user: admin._id,
            },
            {
                name: 'Silk Cocktail Wrap',
                slug: 'silk-cocktail-wrap',
                description: 'A sophisticated silk wrap dress with adjustable tie.',
                price: 8900, category: 'Cocktail', status: 'active',
                images: [{ url: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80', alt: 'Silk Wrap' }],
                colors: [{ name: 'Emerald', hexCode: '#50C878' }, { name: 'Champagne', hexCode: '#f7e7ce' }],
                sizes: [{ size: 'XS', stock: 2 }, { size: 'S', stock: 9 }, { size: 'M', stock: 11 }, { size: 'L', stock: 5 }],
                stock: 27, rating: 4.7, numReviews: 52, user: admin._id,
            },
            {
                name: 'Linen Boho Maxi',
                slug: 'linen-boho-maxi',
                description: 'Sun-kissed linen maxi dress with embroidered hem.',
                price: 5200, category: 'Casual', status: 'active',
                images: [{ url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', alt: 'Boho Maxi' }],
                colors: [{ name: 'Terra Cotta', hexCode: '#e2725b' }, { name: 'Natural Linen', hexCode: '#dcd5c1' }],
                sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 14 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 6 }],
                stock: 38, rating: 4.5, numReviews: 73, user: admin._id,
            },
            {
                name: 'LBD Classic Cut',
                slug: 'lbd-classic-cut',
                description: 'The timeless little black dress re-imagined.',
                price: 6800, category: 'Cocktail', status: 'active',
                images: [{ url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80', alt: 'LBD Classic' }],
                colors: [{ name: 'Jet Black', hexCode: '#000000' }],
                sizes: [{ size: 'XS', stock: 7 }, { size: 'S', stock: 13 }, { size: 'M', stock: 9 }, { size: 'L', stock: 4 }],
                stock: 33, rating: 4.9, numReviews: 201, isBestSeller: true, user: admin._id,
            },
            {
                name: 'Ruched Mini Dress',
                slug: 'ruched-mini-dress',
                description: 'Body-flattering ruched jersey mini. Stretchy, comfortable, and impossibly chic.',
                price: 3200, category: 'Party', status: 'active',
                images: [{ url: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?w=800&q=80', alt: 'Ruched Mini' }],
                colors: [{ name: 'Berry', hexCode: '#8E3B64' }, { name: 'Caramel', hexCode: '#C68642' }],
                sizes: [{ size: 'XS', stock: 10 }, { size: 'S', stock: 18 }, { size: 'M', stock: 12 }, { size: 'L', stock: 5 }],
                stock: 45, rating: 4.4, numReviews: 38, user: admin._id,
            },
        ];

        await ProductModel.insertMany(products);
        console.log(`✅ Seeded ${products.length} products!`);
    }

    console.log('\n🎉 Seed complete! Login credentials:');
    console.log('   Admin     →  admin@timelessfinds.com  /  admin123');
    console.log('   Customer  →  customer@example.com     /  customer123');
    process.exit(0);
};

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
