import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';
import User from './src/models/User.js';

dotenv.config();

const trendingProducts = [
    {
        name: "Emerald Silk Slip",
        slug: "emerald-silk-slip",
        description: "An elegant slip dress crafted from organic mulberry silk.",
        price: 3499,
        discountPrice: 2999,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", alt: "Emerald Slip" }],
        category: "Party",
        tags: ["trending", "bestseller"],
        colors: [{ name: "Emerald", hexCode: "#047857" }],
        sizes: [{ size: "S", stock: 10 }, { size: "M", stock: 4 }],
        stock: 14,
        rating: 4.8,
        numReviews: 24
    },
    {
        name: "Crimson Velvet Midi",
        slug: "crimson-velvet-midi",
        description: "A statement velvet piece for the holiday season.",
        price: 4999,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", alt: "Crimson Velvet" }],
        category: "Party",
        tags: ["trending", "gala"],
        colors: [{ name: "Crimson", hexCode: "#991b1b" }],
        sizes: [{ size: "M", stock: 5 }, { size: "L", stock: 3 }],
        stock: 8,
        rating: 4.9,
        numReviews: 12
    },
    {
        name: "Midnight Lace Gown",
        slug: "midnight-lace-gown",
        description: "Intricate black lace forming an unforgettable silhouette.",
        price: 8999,
        discountPrice: 7999,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80", alt: "Midnight Lace" }],
        category: "Evening",
        tags: ["trending", "exclusive"],
        colors: [{ name: "Black", hexCode: "#000000" }],
        sizes: [{ size: "S", stock: 2 }, { size: "M", stock: 2 }],
        stock: 4,
        rating: 5.0,
        numReviews: 8
    },
    {
        name: "Champagne Draped Dress",
        slug: "champagne-draped-dress",
        description: "Luxurious draping that flatters every angle.",
        price: 4499,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", alt: "Champagne Draped" }],
        category: "Casual",
        tags: ["trending"],
        colors: [{ name: "Champagne", hexCode: "#f3e5ab" }],
        sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 0 }, { size: "L", stock: 2 }],
        stock: 7,
        rating: 4.7,
        numReviews: 31
    }
];

const newArrivals = [
    {
        name: "Rose Quartz Wrap",
        slug: "rose-quartz-wrap",
        description: "A gentle pink wrap dress, perfect for summer afternoons.",
        price: 2499,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1515372039744-b0f0234acbc6?w=800&q=80", alt: "Rose Quartz" }],
        category: "Summer",
        tags: ["new"],
        colors: [{ name: "Rose", hexCode: "#fb7185" }],
        sizes: [{ size: "S", stock: 15 }, { size: "M", stock: 12 }],
        stock: 27,
        rating: 0,
        numReviews: 0
    },
    {
        name: "Azure Flow Maxi",
        slug: "azure-flow-maxi",
        description: "Breathtaking blue gradients in a sweeping maxi length.",
        price: 3899,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", alt: "Azure Flow" }],
        category: "Summer",
        tags: ["new"],
        colors: [{ name: "Azure", hexCode: "#0284c7" }],
        sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 5 }],
        stock: 13,
        rating: 0,
        numReviews: 0
    },
    {
        name: "Ivory Pearl Mini",
        slug: "ivory-pearl-mini",
        description: "Classic ivory with delicate pearl embellishments on the neckline.",
        price: 2999,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80", alt: "Ivory Pearl" }],
        category: "Party",
        tags: ["new"],
        colors: [{ name: "Ivory", hexCode: "#fffff0" }],
        sizes: [{ size: "M", stock: 6 }, { size: "L", stock: 4 }],
        stock: 10,
        rating: 0,
        numReviews: 0
    },
    {
        name: "Lilac Dream Ruffle",
        slug: "lilac-dream-ruffle",
        description: "Soft lilac ruffles that bring a playful yet sophisticated aura.",
        price: 3299,
        gender: "Women",
        status: "active",
        images: [{ url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", alt: "Lilac Dream" }],
        category: "Casual",
        tags: ["new"],
        colors: [{ name: "Lilac", hexCode: "#c8a2c8" }],
        sizes: [{ size: "S", stock: 12 }, { size: "M", stock: 10 }],
        stock: 22,
        rating: 0,
        numReviews: 0
    }
];

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

        const allProducts = [...trendingProducts, ...newArrivals];

        let addedCount = 0;
        for (const item of allProducts) {
            // Check if product with this slug already exists to prevent duplication
            const existing = await Product.findOne({ slug: item.slug });
            if (!existing) {
                // Attach the user ID
                item.user = adminUser._id;
                await Product.create(item);
                addedCount++;
                console.log(`Added product: ${item.name}`);
            } else {
                // Optionally update tags if it exists to make sure it shows up
                await Product.updateOne({ _id: existing._id }, { $addToSet: { tags: { $each: item.tags } } });
                console.log(`Product ${item.name} already exists. Added tags if missing.`);
            }
        }

        console.log(`Successfully seeded ${addedCount} new products!`);
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
