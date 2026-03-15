import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
        },
        brand_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
        },
        gender: {
            type: String,
            enum: ['Women', 'Men', 'Kids'],
            default: 'Women'
        },
        status: {
            type: String,
            enum: ['active', 'draft', 'archived'],
            default: 'draft'
        },
        images: [
            {
                url: { type: String, required: true },
                alt: { type: String },
            },
        ],
        videoUrl: {
            type: String,
        },
        category: {
            type: String,
            required: true,
        },
        tags: [{
            type: String,
        }],
        colors: [
            {
                name: { type: String, required: true },
                hexCode: { type: String, required: true },
            },
        ],
        sizes: [
            {
                size: { type: String, required: true },
                stock: { type: Number, required: true, default: 0 },
            },
        ],
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isFlashSale: {
            status: { type: Boolean, default: false },
            endTime: { type: Date },
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
