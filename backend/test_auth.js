import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = 'mongodb+srv://aproy48_db_user:c7Zlb5DODfD0sTHK@cluster0.l3pznj7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
    try {
        console.log('Testing connection to cluster...');
        await mongoose.connect(uri);
        console.log('✅ Success!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err.message);
        process.exit(1);
    }
}
test();
