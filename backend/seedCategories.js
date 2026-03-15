import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';

dotenv.config();

const categories = [
    { 
        name: 'Lehenga Choli', 
        slug: 'lehenga-choli', 
        image: 'https://images.unsplash.com/photo-1583391733956-311894a821da?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        name: 'Kurtis', 
        slug: 'kurtis', 
        image: 'https://images.unsplash.com/photo-1610189012906-40763567793d?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        name: 'Saree', 
        slug: 'saree', 
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        name: 'Dresses', 
        slug: 'dresses', 
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        name: 'Suit Sets', 
        slug: 'suit-sets', 
        image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        name: 'Co-ord Sets', 
        slug: 'co-ord-sets', 
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7825?auto=format&fit=crop&q=80&w=800' 
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log('Seeded categories');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
