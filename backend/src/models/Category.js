import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
