import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HeroBanner from './src/models/HeroBanner.js';
import PromoSection from './src/models/PromoSection.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        await HeroBanner.deleteMany({});
        await HeroBanner.create({
            title: "Own The Room.",
            subtitle: "Elegant dresses crafted for modern women who command every entrance.",
            image: "https://jaipurkurta.com/cdn/shop/files/desktop_2_7f16428c-687f-4b0d-b40b-044ced54359d.jpg?v=1710414447",
            link: "/dresses",
            isActive: true
        });

        await PromoSection.deleteMany({});
        await PromoSection.create({
            title: "The Midnight Gala",
            subtitle: "Discover the new evening collection",
            image: "https://jaipurkurta.com/cdn/shop/files/desktop_1_7f16428c-687f-4b0d-b40b-044ced54359d.jpg?v=1710414447",
            link: "/dresses",
            isActive: true
        });

        console.log('Home data seeded');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
