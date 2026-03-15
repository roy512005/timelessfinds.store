import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();

// ── Inline Product Schema (avoids import issues) ─────────────────────────────
const productSchema = new mongoose.Schema({
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:         { type: String, required: true },
    slug:         { type: String, required: true, unique: true },
    description:  { type: String, required: true },
    price:        { type: Number, required: true },
    discountPrice:{ type: Number },
    gender:       { type: String, enum: ['Women', 'Men', 'Kids'], default: 'Women' },
    status:       { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
    images:       [{ url: String, alt: String }],
    category:     { type: String, required: true },
    tags:         [String],
    sizes:        [{ size: String, stock: { type: Number, default: 0 } }],
    stock:        { type: Number, default: 0 },
    rating:       { type: Number, default: 0 },
    numReviews:   { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name:  String,
    email: { type: String, unique: true },
    password: String,
    role:  { type: String, default: 'user' },
    phone: String,
}, { timestamps: true });

// Password hash middleware
import bcrypt from 'bcryptjs';
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User    = mongoose.models.User    || mongoose.model('User', userSchema);

const main = async () => {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected!');

    // Get or create admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        admin = await User.create({ name: 'Admin', email: 'admin@timelessfinds.local', password: 'admin123', role: 'admin' });
        console.log('Created admin user');
    } else {
        console.log(`Using admin: ${admin.email}`);
    }

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Cleared.');

    const filePath = path.join(__dirname, 'all_products.json');
    const rawData  = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Loaded ${rawData.length} products from all_products.json`);

    const slugSet = new Set();
    const formatted = rawData.map((item, idx) => {
        const price        = parseInt(item.price) || 999;
        const mrp          = parseInt(item.mrp) || price;
        const discountPrice = mrp > price ? mrp : undefined;

        let slug = (item.handle || item.name || `product-${idx}`)
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        if (slugSet.has(slug)) slug = `${slug}-${idx}`;
        slugSet.add(slug);

        const description = (item.description || `${item.name} — ${item.category} by ${item.vendor}.`).slice(0, 600);

        const sizeArr = Array.isArray(item.sizes) ? item.sizes : ['Free Size'];
        const sizes   = sizeArr.map(s => ({
            size:  String(s).trim() || 'Free Size',
            stock: item.stock > 0 ? Math.floor(Math.random() * 15) + 2 : 0,
        }));

        const rawTags = [...(item.tags || []), ...(item.product_type ? [item.product_type] : [])];
        const tags    = [...new Set(rawTags.filter(Boolean))].slice(0, 10);

        return {
            user:         admin._id,
            name:         item.name,
            slug,
            description,
            price,
            discountPrice,
            gender:       'Women',
            status:       'active',
            images:       (item.images || []).slice(0, 6).map((url, i) => ({ url, alt: `${item.name} - ${i + 1}` })),
            category:     item.category || 'Ethnic Wear',
            tags,
            sizes,
            stock:        item.stock || 0,
            rating:       parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
            numReviews:   Math.floor(Math.random() * 120),
            isBestSeller: Math.random() < 0.08,
        };
    });

    // Insert in batches of 100
    const BATCH = 100;
    let inserted = 0;
    for (let i = 0; i < formatted.length; i += BATCH) {
        const batch = formatted.slice(i, i + BATCH);
        await Product.insertMany(batch, { ordered: false });
        inserted += batch.length;
        process.stdout.write(`\r  Progress: ${inserted}/${formatted.length} products inserted...`);
    }

    console.log(`\n\n✅ Done! Successfully seeded ${inserted} products.`);
    console.log('\nBreakdown by vendor:');
    const vendorCounts = {};
    rawData.forEach(p => { vendorCounts[p.vendor] = (vendorCounts[p.vendor] || 0) + 1; });
    Object.entries(vendorCounts).forEach(([v, c]) => console.log(`  ${v}: ${c}`));

    await mongoose.disconnect();
    process.exit(0);
};

main().catch(err => {
    console.error('FAILED:', err.message);
    process.exit(1);
});
