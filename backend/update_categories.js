import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';

dotenv.config();

const categoryUpdates = [
    {
        name: 'Saree',
        slug: 'saree',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
    },
    {
        name: 'Kurtis',
        slug: 'kurtis',
        image: 'https://images.unsplash.com/photo-1610189012906-40763567793d?w=800&q=80'
    },
    {
        name: 'Lehenga Choli',
        slug: 'lehenga-choli',
        image: 'https://images.unsplash.com/photo-1583391733956-311894a821da?w=800&q=80'
    },
    {
        name: 'Suit Sets',
        slug: 'suit-sets',
        image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80'
    },
    {
        name: 'Co-ord Sets',
        slug: 'co-ord-sets',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7825?w=800&q=80'
    },
    {
        name: 'Dresses',
        slug: 'dresses',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
    },
    {
        name: 'Boys',
        slug: 'kalamkari-kurta', // Mapping to the existing men's category to show products
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const catData of categoryUpdates) {
            const existing = await Category.findOne({ name: catData.name });
            if (existing) {
                existing.image = catData.image;
                existing.slug = catData.slug;
                await existing.save();
                console.log(`Updated category: ${catData.name}`);
            } else {
                await Category.create(catData);
                console.log(`Created category: ${catData.name}`);
            }
        }

        console.log('Category updates complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seed();
