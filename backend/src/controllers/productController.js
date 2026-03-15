import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } },
                    { tags: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};
        const category = req.query.category
            ? { category: { $regex: req.query.category, $options: 'i' } }
            : {};
        const size = req.query.size
            ? { 'sizes.size': { $in: req.query.size.split(',') } }
            : {};
        const color = req.query.color
            ? { 'colors.hexCode': { $in: req.query.color.split(',') } }
            : {};

        const tag = req.query.tag
            ? { tags: { $in: [req.query.tag] } }
            : {};

        const gender = req.query.gender
            ? { gender: { $regex: `^${req.query.gender}$`, $options: 'i' } }
            : {};

        const badge = req.query.badge
            ? { badge: { $regex: req.query.badge, $options: 'i' } }
            : {};

        const collection = req.query.collection
            ? { tags: { $in: [req.query.collection] } }
            : {};

        const priceFilter = {};
        if (req.query.minPrice || req.query.maxPrice) {
            priceFilter.price = {};
            if (req.query.minPrice) priceFilter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) priceFilter.price.$lte = parseFloat(req.query.maxPrice);
        }

        let sortObj = { createdAt: -1 };
        if (req.query.sort === 'new') sortObj = { createdAt: -1 };

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const skip = (page - 1) * limit;

        const countQuery = { ...keyword, ...category, ...size, ...color, ...tag, ...collection, ...gender, ...badge, ...priceFilter };
        const totalCount = await Product.countDocuments(countQuery);

        let query = Product.find(countQuery).sort(sortObj);
        if (limit > 0) query = query.skip(skip).limit(limit);

        const products = await query;

        // Backward compatibility: return array for old controllers without page params
        if (req.query.page) {
            res.json({ products, page, pages: limit > 0 ? Math.ceil(totalCount / limit) : 1, total: totalCount });
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trending products (most ordered in last 7 days)
// @route   GET /api/products/trending
export const getTrendingProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Aggregate orders from last 7 days — sum qty per product
        const topProductIds = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $unwind: '$orderItems' },
            { $group: { _id: '$orderItems.product', totalQty: { $sum: '$orderItems.qty' } } },
            { $sort: { totalQty: -1 } },
            { $limit: limit * 3 },
        ]);

        let orderBasedProducts = [];
        if (topProductIds.length > 0) {
            const ids = topProductIds.map(t => t._id).filter(Boolean);
            const docs = await Product.find({ _id: { $in: ids } });
            const docMap = Object.fromEntries(docs.map(d => [d._id.toString(), d]));
            orderBasedProducts = topProductIds.map(t => docMap[t._id?.toString()]).filter(Boolean);
        }

        // Always fetch products from the 4 key categories to guarantee variety
        const TRENDING_CATS = ['Kurtis', 'Kurta Sets', 'Saree', 'Dresses', 'Lehenga Choli', 'Co-ord Sets'];
        const catProducts = await Product.find({
            category: { $in: TRENDING_CATS },
        }).sort({ rating: -1 }).limit(limit * 3);

        // Merge: order-based first, then fill with category products (dedup by _id)
        const seen = new Set();
        const merged = [];
        for (const p of [...orderBasedProducts, ...catProducts]) {
            const id = (p._id || p.id)?.toString();
            if (id && !seen.has(id)) {
                seen.add(id);
                merged.push(p);
            }
        }

        // Round-robin blend by category — fixed loop (always advance i)
        const grouped = {};
        merged.forEach(p => {
            const cat = p.category || 'other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(p);
        });
        const keys = Object.keys(grouped);
        const mixed = [];
        let i = 0;
        while (mixed.length < limit && keys.length > 0) {
            const idx = i % keys.length;
            const key = keys[idx];
            if (grouped[key] && grouped[key].length > 0) {
                mixed.push(grouped[key].shift());
                i++;
            } else {
                keys.splice(idx, 1);
                // don't increment i — re-check same position with shorter keys
            }
        }

        res.json(mixed.length > 0 ? mixed : merged.slice(0, limit));
    } catch (error) {
        console.error('getTrendingProducts error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dynamic filters (colors, sizes, categories)
// @route   GET /api/products/filters
export const getFilters = async (req, res) => {
    try {
        const products = await Product.find({ status: 'active' });

        const sizes = new Set();
        const colors = new Set();
        const categories = new Set();
        let minPrice = Infinity;
        let maxPrice = 0;

        products.forEach(p => {
            if (p.category) categories.add(p.category);
            if (p.price && p.price < minPrice) minPrice = p.price;
            if (p.price && p.price > maxPrice) maxPrice = p.price;
            if (p.sizes) p.sizes.forEach(s => {
                if (s.size && s.stock > 0) sizes.add(s.size);
            });
            if (p.colors) p.colors.forEach(c => { if (c.hexCode) colors.add(c.hexCode); });
        });

        res.json({
            sizes: Array.from(sizes).filter(Boolean).sort(),
            colors: Array.from(colors).filter(Boolean),
            categories: Array.from(categories).filter(Boolean),
            minPrice: minPrice === Infinity ? 0 : minPrice,
            maxPrice: maxPrice || 25000
        });
    } catch (error) {
        console.error('getFilters error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search Products specifically
// @route   GET /api/products/search?q=...
export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q
            ? {
                $or: [
                    { name: { $regex: req.query.q, $options: 'i' } },
                    { description: { $regex: req.query.q, $options: 'i' } },
                    { category: { $regex: req.query.q, $options: 'i' } }
                ]
            }
            : {};
        const products = await Product.find(query).limit(20);
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.viewsCount += 1;
            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
