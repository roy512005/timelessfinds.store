import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import path from 'path';

dotenv.config({ path: ['.env.local', '.env'] });

const __dirname = path.resolve();

const seedAmbraeeProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        // Find or create admin user
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found. Creating one...');
            adminUser = await User.create({
                name: "Admin",
                email: "admin@timelessfinds.local",
                password: "password123",
                role: "admin"
            });
        }

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Old products cleared.');

        const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ambraee_products.json'), 'utf-8'));

        // Track slugs to avoid duplicates
        const slugSet = new Set();

        const formattedProducts = rawData.map((item, idx) => {
            const basePrice = parseInt(item.price) || 999;
            const discountPrice = item.compare_at_price ? parseInt(item.compare_at_price) : undefined;

            // Generate unique slug
            let slug = (item.handle || item.name)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            // Ensure uniqueness
            if (slugSet.has(slug)) {
                slug = `${slug}-${idx}`;
            }
            slugSet.add(slug);

            const description = item.description || `${item.name} - ${item.category || 'Ethnic Wear'} by Ambraee.`;

            return {
                user: adminUser._id,
                name: item.name,
                slug,
                description,
                price: basePrice,
                discountPrice: (discountPrice && discountPrice !== basePrice) ? discountPrice : undefined,
                gender: 'Women',
                status: 'active',
                images: (item.images || []).slice(0, 6).map((url, i) => ({
                    url,
                    alt: `${item.name} - Image ${i + 1}`
                })),
                category: item.category || 'Ethnic Wear',
                tags: [...(item.tags || []), ...(item.product_type ? [item.product_type] : [])].filter(Boolean).slice(0, 10),
                sizes: (item.sizes || ['S', 'M', 'L', 'XL']).map(s => ({
                    size: s,
                    stock: item.stock > 0 ? Math.floor(Math.random() * 15) + 2 : 0
                })),
                stock: item.stock || 0,
                rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
                numReviews: Math.floor(Math.random() * 80),
                isBestSeller: Math.random() < 0.1,  // 10% chance
            };
        });

        const BATCH_SIZE = 100;
        let inserted = 0;
        for (let i = 0; i < formattedProducts.length; i += BATCH_SIZE) {
            const batch = formattedProducts.slice(i, i + BATCH_SIZE);
            await Product.insertMany(batch, { ordered: false });
            inserted += batch.length;
            console.log(`  Inserted ${inserted}/${formattedProducts.length}...`);
        }

        console.log(`\n✅ Successfully seeded ${inserted} Ambraee products!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
};

seedAmbraeeProducts();
