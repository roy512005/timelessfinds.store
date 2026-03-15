import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const count = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`Total users: ${count}`);
    
    const admins = await mongoose.connection.db.collection('users').find({ role: 'admin' }).toArray();
    console.log("Admins:", admins.map(u => ({ email: u.email, role: u.role })));
    
    const allEmails = await mongoose.connection.db.collection('users').find({}, { projection: { email: 1, role: 1 } }).toArray();
    console.log("All emails in DB:", allEmails.map(u => `${u.email} (${u.role})`));
    
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
