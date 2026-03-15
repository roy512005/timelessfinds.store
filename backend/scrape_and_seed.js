import mongoose from 'mongoose';

import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import Category from './src/models/Category.js'; // might need this to ensure it exists if linked, but category in schema is just String, not strictly ObjectId except for category_id
import crypto from 'crypto';

dotenv.config();

const sites = [
    { name: 'TheThreadTales', url: 'https://www.thethreadtales.in' },
    { name: 'Kalakarie', url: 'https://kalakarie.in' },
    { name: 'Sudathi', url: 'https://sudathi.com' },
    // Sophistisuit is down with 502, but let's include and let it fail gracefully
    { name: 'Sophistisuit', url: 'https://sophistisuit.com' }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mapShopifyProduct = (spProduct, userId, storeName) => {
    const defaultColorHexes = {
        "black": "#000000", "white": "#FFFFFF", "red": "#FF0000", "blue": "#0000FF",
        "green": "#008000", "yellow": "#FFFF00", "pink": "#FFC0CB", "maroon": "#800000",
        "navy": "#000080", "grey": "#808080", "gray": "#808080", "orange": "#FFA500",
        "purple": "#800080", "brown": "#A52A2A", "gold": "#FFD700", "silver": "#C0C0C0",
        "multi": "#FFFFFF", "multicolor": "#FFFFFF"
    };
    
    let sizeOptionPosition = -1;
    let colorOptionPosition = -1;
    
    (spProduct.options || []).forEach(opt => {
        const name = opt.name.toLowerCase();
        if (name.includes('size')) sizeOptionPosition = opt.position;
        if (name.includes('color') || name.includes('colour')) colorOptionPosition = opt.position;
    });

    const sizesMap = new Map();
    const colorsMap = new Map();
    let totalStock = 0;
    
    let basePrice = 0;
    let baseCompareAt = null;

    if (spProduct.variants && spProduct.variants.length > 0) {
        basePrice = parseFloat(spProduct.variants[0].price || 0);
        if (spProduct.variants[0].compare_at_price) {
            baseCompareAt = parseFloat(spProduct.variants[0].compare_at_price);
        }

        spProduct.variants.forEach(variant => {
            let varSize = null;
            let varColor = null;
            
            if (sizeOptionPosition === 1) varSize = variant.option1;
            else if (sizeOptionPosition === 2) varSize = variant.option2;
            else if (sizeOptionPosition === 3) varSize = variant.option3;
            
            if (colorOptionPosition === 1) varColor = variant.option1;
            else if (colorOptionPosition === 2) varColor = variant.option2;
            else if (colorOptionPosition === 3) varColor = variant.option3;

            varSize = varSize || "Free Size";
            
            const variantStock = variant.available ? 10 : 0;
            totalStock += variantStock;
            sizesMap.set(varSize, (sizesMap.get(varSize) || 0) + variantStock);

            if (varColor && !colorsMap.has(varColor)) {
                const hex = defaultColorHexes[varColor.toLowerCase()] || "#" + crypto.randomBytes(3).toString('hex');
                colorsMap.set(varColor, hex);
            }
        });
    }

    if (colorsMap.size === 0) {
        colorsMap.set("Default", "#" + crypto.randomBytes(3).toString('hex'));
    }
    if (sizesMap.size === 0) {
        sizesMap.set("Free Size", 10);
        totalStock = 10;
    }

    const sizes = Array.from(sizesMap.entries()).map(([size, stock]) => ({ size: String(size).substring(0, 10), stock }));
    const colors = Array.from(colorsMap.entries()).map(([name, hexCode]) => ({ name: String(name).substring(0, 15), hexCode }));

    let tags = spProduct.tags || [];
    tags.push(storeName);

    let category = spProduct.product_type || "Uncategorized";
    if (category.trim() === "") category = "Uncategorized";

    let gender = 'Women';
    const lTitle = spProduct.title.toLowerCase();
    const lTags = tags.map(t => t.toLowerCase());
    if (lTitle.includes('men') && !lTitle.includes('women')) gender = 'Men';
    else if (lTags.includes('men')) gender = 'Men';
    if (lTitle.includes('kid') || lTags.includes('kids')) gender = 'Kids';

    let descText = spProduct.body_html || "";
    // Extremely basic HTML strip
    descText = descText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (!descText) descText = spProduct.title;

    const finalPrice = baseCompareAt && baseCompareAt > basePrice ? baseCompareAt : basePrice;
    const finalDiscountPrice = baseCompareAt && baseCompareAt > basePrice ? basePrice : undefined;

    return {
        user: userId,
        name: spProduct.title,
        slug: `${storeName.toLowerCase()}-${spProduct.handle}`.substring(0, 150),
        description: descText.substring(0, 2000),
        price: finalPrice || 1000,
        ...(finalDiscountPrice ? { discountPrice: finalDiscountPrice } : {}),
        gender: gender,
        status: 'active',
        images: (spProduct.images || []).map(img => ({ url: img.src, alt: spProduct.title })).slice(0, 5),
        category: category,
        tags: tags,
        colors: colors,
        sizes: sizes,
        stock: totalStock > 0 ? totalStock : 10,
        rating: 0,
        numReviews: 0,
        isBestSeller: false,
        viewsCount: 0
    };
};

const scrapeShopifyStore = async (storeUrl) => {
    let page = 1;
    let products = [];
    let keepsGoing = true;

    while (keepsGoing) {
        try {
            const url = `${storeUrl}/products.json?limit=250&page=${page}`;
            console.log(`Fetching ${url}`);
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 10000
            });
            if (!response.ok) {
                console.log(`Failed with status ${response.status} for ${url}`);
                keepsGoing = false;
                break;
            }
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                products = products.concat(data.products);
                page++;
                await sleep(500); // polite sleeping
            } else {
                keepsGoing = false;
            }
        } catch (error) {
            console.log(`Error fetching ${storeUrl} page ${page}:`, error.message);
            keepsGoing = false;
        }
    }
    return products;
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log("No admin user found. Make sure to run the main seeder first or start the app to create one.");
            // Create dummy admin if missing to avoid breaking
            adminUser = await User.create({
                name: "Admin Scraper",
                email: "admin_scraper@example.com",
                password: "password123",
                role: "admin"
            });
        }
        const adminId = adminUser._id;

        for (const site of sites) {
            console.log(`\n--- Starting scraping for ${site.name} ---`);
            const shopifyProducts = await scrapeShopifyStore(site.url);
            console.log(`Found ${shopifyProducts.length} products on ${site.name}`);

            if (shopifyProducts.length === 0) {
                console.log(`No products to insert for ${site.name}. Moving on.`);
                continue;
            }

            // Group into batches for insertion to avoid memory overload
            let insertedCount = 0;
            let updatedCount = 0;

            for (const spProduct of shopifyProducts) {
                // Skip if no images or title missing
                if (!spProduct.title || !spProduct.images || spProduct.images.length === 0) continue;

                const dbProductData = mapShopifyProduct(spProduct, adminId, site.name);

                try {
                    const existingProduct = await Product.findOne({ slug: dbProductData.slug });
                    if (existingProduct) {
                        // Optionally update
                        updatedCount++;
                    } else {
                        await Product.create(dbProductData);
                        insertedCount++;
                    }
                } catch (err) {
                    console.error(`Error saving product ${dbProductData.slug}:`, err.message);
                }
            }

            console.log(`Finished ${site.name}: Inserted ${insertedCount}, Skipped/Updated ${updatedCount}`);
        }

        console.log('\nAll scraping and seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
};

run();
