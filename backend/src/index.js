import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import deliveryBoyRoutes from './routes/deliveryBoyRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import { mountDynamicRoutes } from './routes/genericRoutes.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Manual CORS middleware — prevents Express 5 + cors package compatibility issues
app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    // Handle preflight early — respond 204 and stop
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery', deliveryBoyRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/collections', collectionRoutes);

// ── Seed all products endpoint (no auth) ────────────────────────────────────
app.post('/api/seed-all-products', async (req, res) => {
    try {
        const { default: Product } = await import('./models/Product.js');
        const { default: User }    = await import('./models/User.js');

        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin', email: 'admin@timelessfinds.local',
                password: 'password123', role: 'admin'
            });
        }

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Load merged all_products.json (1335 products from Ambraee + JaipurKurta + The Pankhudi)
        const jsonPath = path.join(__dirname, '../../all_products.json');
        const rawData  = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        console.log(`Loaded ${rawData.length} products from all_products.json`);

        const slugSet = new Set();
        const formatted = rawData.map((item, idx) => {
            const price = parseInt(item.price) || 999;
            const mrp   = parseInt(item.mrp) || price;
            const discountPrice = mrp > price ? mrp : undefined;

            // Build unique slug from handle or name
            let slug = (item.handle || item.name || `product-${idx}`)
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            if (slugSet.has(slug)) slug = `${slug}-${idx}`;
            slugSet.add(slug);

            const description = (item.description || `${item.name} — ${item.category} by ${item.vendor}.`).slice(0, 600);

            // Sizes — already normalized to string[] in all_products.json
            const sizeArr = Array.isArray(item.sizes) ? item.sizes : ['Free Size'];
            const sizesFormatted = sizeArr.map(s => ({
                size:  String(s).trim() || 'Free Size',
                stock: item.stock > 0 ? Math.floor(Math.random() * 15) + 2 : 0,
            }));

            // Build tags array — merge tags + product_type
            const rawTags = [...(item.tags || []), ...(item.product_type ? [item.product_type] : [])];
            const tags = [...new Set(rawTags.filter(Boolean))].slice(0, 10);

            return {
                user:        adminUser._id,
                name:        item.name,
                slug,
                description,
                price,
                discountPrice,
                gender:      item.gender === 'women' ? 'Women' : (item.gender || 'Women'),
                status:      'active',
                images:      (item.images || []).slice(0, 6).map((url, i) => ({
                    url, alt: `${item.name} - ${i + 1}`
                })),
                category:    item.category || 'Ethnic Wear',
                tags,
                sizes:       sizesFormatted,
                stock:       item.stock || 0,
                rating:      parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
                numReviews:  Math.floor(Math.random() * 120),
                isBestSeller: Math.random() < 0.08,
            };
        });

        const BATCH = 100;
        let inserted = 0;
        for (let i = 0; i < formatted.length; i += BATCH) {
            await Product.insertMany(formatted.slice(i, i + BATCH), { ordered: false });
            inserted += Math.min(BATCH, formatted.length - i);
            console.log(`  Inserted ${inserted}/${formatted.length}...`);
        }

        res.json({ success: true, inserted, total: formatted.length, message: `Successfully seeded ${inserted} products from 3 stores.` });
    } catch (err) {
        console.error('Seed error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});
// ── End seed endpoint ─────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// Initialize dynamic generic APIs then boot server!
mountDynamicRoutes(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize dynamic apis:', err);
});

export default app;
