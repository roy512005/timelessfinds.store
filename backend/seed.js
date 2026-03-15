import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const MOCK = [
    { title: 'Midnight Silk Slip Dress', description: 'Luxury silk slip dress.', price: 3499, originalPrice: 5999, category: 'evening', countInStock: 4, images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'], rating: 4.8, numReviews: 312 },
    { title: 'Rose Velvet Midi', description: 'Trending rose velvet midi dress.', price: 4299, originalPrice: 7499, category: 'evening', countInStock: 2, images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80'], rating: 4.7, numReviews: 198 },
    { title: 'Blush Lace Cocktail', price: 2899, description: 'Top rated blush lace cocktail.', originalPrice: 4999, category: 'cocktail', countInStock: 2, images: ['https://images.unsplash.com/photo-1612336307408-8cae297034b2?w=600&q=80'], rating: 4.9, numReviews: 421 },
    { title: 'Ivory Wrap Maxi', price: 3999, description: 'Elegant wrap maxi.', originalPrice: 6499, category: 'maxi', countInStock: 5, images: ['https://images.unsplash.com/photo-1515372039744-b0f0234acbc6?w=600&q=80'], rating: 4.6, numReviews: 267 },
    { title: 'Celestial Draped Gown', price: 5499, description: 'Limited draped gown.', originalPrice: 8999, category: 'gown', countInStock: 3, images: ['https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80'], rating: 4.8, numReviews: 143 },
    { title: 'Crimson Satin Slip', price: 2699, description: 'Crimson satin slip.', originalPrice: 4299, category: 'mini', countInStock: 8, images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80'], rating: 4.5, numReviews: 389 },
    { title: 'Emerald Off-Shoulder', price: 4799, description: 'Emerald off-shoulder.', originalPrice: 7999, category: 'evening', countInStock: 1, images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80'], rating: 4.9, numReviews: 211 },
    { title: 'Pearl Sequin Mini', price: 3299, description: 'Pearl sequin mini.', originalPrice: 5499, category: 'party', countInStock: 12, images: ['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80'], rating: 4.7, numReviews: 176 },
    { title: 'Onyx Asymmetric Gown', price: 5999, description: 'Black Onyx Gown.', originalPrice: 9499, category: 'gown', countInStock: 4, images: ['https://images.unsplash.com/photo-1572804013309-8c98e10f1465?w=600&q=80'], rating: 4.8, numReviews: 94 },
    { title: 'Dusty Rose Corset Midi', price: 4199, description: 'Corset Midi.', originalPrice: 6799, category: 'evening', countInStock: 6, images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'], rating: 4.7, numReviews: 152 },
    { title: 'Aurora Tulle Ballgown', price: 6999, description: 'Luxury ballgown.', originalPrice: 11999, category: 'gown', countInStock: 2, images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80'], rating: 4.9, numReviews: 54 },
    { title: 'Cashmere Wrap Dress', price: 5299, description: 'Cashmere wrap dress.', originalPrice: 8499, category: 'evening', countInStock: 15, images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=600&q=80'], rating: 4.6, numReviews: 119 }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log('Seeding products...');
            await Product.insertMany(MOCK);
            console.log('Done seeding.');
        } else {
            console.log('Products already exist.');
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

seed();
