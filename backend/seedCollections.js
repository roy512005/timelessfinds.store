import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Collection from './src/models/Collection.js';

dotenv.config();

const data = [
    {
        title: "Summer Breeze",
        slug: "summer-breeze",
        description: "Lightweight fabrics and vibrant colors for the sunny days.",
        image: "https://jaipurkurta.com/cdn/shop/files/desktop_2_7f16428c-687f-4b0d-b40b-044ced54359d.jpg?v=1710414447",
        tags: ["Summer", "Light", "Cotton"]
    },
    {
        title: "Wedding Edit",
        slug: "wedding-edit",
        description: "Exquisite lehengas and sarees for the grand celebrations.",
        image: "https://jaipurkurta.com/cdn/shop/files/desktop_1_7f16428c-687f-4b0d-b40b-044ced54359d.jpg?v=1710414447",
        tags: ["Wedding", "Festive", "Silk"]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Collection.deleteMany({});
        await Collection.insertMany(data);
        console.log('Collections seeded');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
