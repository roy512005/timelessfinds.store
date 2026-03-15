import Product from '../models/Product.js';

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

        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Infinity;
        const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

        let sortObj = { createdAt: -1 };
        if (req.query.sort === 'new') sortObj = { createdAt: -1 };

        const limit = req.query.limit ? parseInt(req.query.limit) : 0;

        let query = Product.find({ ...keyword, ...category, ...size, ...color, ...tag, ...collection, ...gender, ...badge, ...priceFilter })
            .sort(sortObj);
        if (limit > 0) query = query.limit(limit);

        const products = await query;
        res.json(products);
    } catch (error) {
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
