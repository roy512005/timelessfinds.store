import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import path from 'path';

dotenv.config({ path: ['.env.local', '.env'] });

const __dirname = path.resolve();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding Products.');

        // Find an admin user to assign these products
        let adminUser = await User.findOne({ role: 'admin' });

        // If no admin user exists, create a dummy one for the script
        if (!adminUser) {
            console.log('No admin user found. Creating dummy admin for product attribution...');
            adminUser = await User.create({
                name: "Admin",
                email: "admin@dressaura.local",
                password: "password123", // Hashes automatically via pre-save
                role: "admin"
            });
        }

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Old products cleared.');

        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sourcing_products.json'), 'utf-8'));

        const formattedProducts = productsData.map(item => {
            const basePrice = parseInt(item.price);
            return {
                name: item.name,
                slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                description: item.description,
                price: basePrice,
                gender: item.gender === "women" ? "Women" : item.gender === "men" ? "Men" : "Unisex",
                status: "active",
                images: item.images.map(img => ({ url: img, alt: item.name })),
                category: item.category,
                tags: item.tags,
                sizes: item.sizes.map(s => ({ size: s, stock: Math.floor(Math.random() * 10) + 2 })),
                stock: item.stock || 10,
                rating: 0,
                numReviews: 0,
                user: adminUser._id
            };
        });

        await Product.insertMany(formattedProducts);

        console.log(`Successfully seeded ${formattedProducts.length} new products!`);
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
