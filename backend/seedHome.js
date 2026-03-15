import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HeroBanner from './src/models/HeroBanner.js';
import PromoSection from './src/models/PromoSection.js';
import Creator from './src/models/Creator.js';
import InstagramPost from './src/models/InstagramPost.js';
import Category from './src/models/Category.js';

dotenv.config();

const heroData = {
    title: "Own\nThe Room.",
    subtitle: "Spring / Summer 2025",
    description: "Elegant dresses crafted for modern women who command every entrance.",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1600&q=90",
    button1_text: "Shop New Arrivals",
    button1_link: "/new-arrivals",
    button2_text: "Explore Collection",
    button2_link: "/collections",
    isActive: true
};

const promoData = {
    title: "Midnight Gala\nCollection",
    description: "Handcrafted couture for the woman who arrives and never goes unnoticed. Only 50 pieces available — ever.",
    image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=1600&q=85",
    cta_text: "Shop The Collection",
    cta_link: "/collections",
    isActive: true
};

const creatorData = {
    name: "PriyaStyles",
    handle: "@PriyaStyles",
    followers: "2.1M",
    description: "India's most influential fashion creator teamed up with DressAura to craft the \"Bombay Nights\" capsule — 100 pieces ethically made in Mumbai. Once sold, never restocked.",
    pieces_total: 100,
    pieces_remaining: 43,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=85",
    cta_text: "Shop The Drop",
    cta_link: "/collections",
    isActive: true
};

const instagramData = [
    { image_url: 'https://images.unsplash.com/photo-1515372039744-b0f0234acbc6?w=400&q=80', handle: '@priya.styles', likes: '12.4k', isActive: true },
    { image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', handle: '@simran_chic', likes: '8.9k', isActive: true },
    { image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80', handle: '@thedelhistyle', likes: '24.1k', isActive: true },
    { image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80', handle: '@neha.vogue', likes: '15.2k', isActive: true },
    { image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', handle: '@ananya_daily', likes: '9.3k', isActive: true },
    { image_url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80', handle: '@mumbai.muse', likes: '18.7k', isActive: true },
];

const categoryData = [
    { name: 'Casual', slug: 'casual', image: 'https://images.unsplash.com/photo-1515372039744-b0f0234acbc6?w=800&q=80', isActive: true },
    { name: 'Party', slug: 'party', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80', isActive: true },
    { name: 'Summer', slug: 'summer', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', isActive: true },
    { name: 'Office', slug: 'office', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', isActive: true },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        await HeroBanner.deleteMany();
        await PromoSection.deleteMany();
        await Creator.deleteMany();
        await InstagramPost.deleteMany();

        await HeroBanner.create(heroData);
        await PromoSection.create(promoData);
        await Creator.create(creatorData);
        await InstagramPost.insertMany(instagramData);

        for (const cat of categoryData) {
            const existing = await Category.findOne({ slug: cat.slug });
            if (!existing) {
                await Category.create(cat);
            }
        }

        console.log('Data successfully seeded!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
