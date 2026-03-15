import Collection from '../models/Collection.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all active collections
// @route   GET /api/collections
export const getCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(collections);
});

// @desc    Get single active collection by slug
// @route   GET /api/collections/:slug
export const getCollectionBySlug = asyncHandler(async (req, res) => {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true });
    if (collection) {
        res.json(collection);
    } else {
        res.status(404);
        throw new Error('Collection not found');
    }
});

// @desc    Get all collections (Admin)
// @route   GET /api/admin/collections
export const getAdminCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.find({}).sort({ createdAt: -1 });
    res.json(collections);
});

// @desc    Create a collection
// @route   POST /api/admin/collections
export const createCollection = asyncHandler(async (req, res) => {
    const coll = new Collection(req.body);
    const createdColl = await coll.save();
    res.status(201).json(createdColl);
});

// @desc    Update a collection
// @route   PUT /api/admin/collections/:id
export const updateCollection = asyncHandler(async (req, res) => {
    const coll = await Collection.findById(req.params.id);
    if (coll) {
        Object.assign(coll, req.body);
        const updatedColl = await coll.save();
        res.json(updatedColl);
    } else {
        res.status(404);
        throw new Error('Collection not found');
    }
});

// @desc    Delete a collection
// @route   DELETE /api/admin/collections/:id
export const deleteCollection = asyncHandler(async (req, res) => {
    const coll = await Collection.findByIdAndDelete(req.params.id);
    if (coll) {
        res.json({ message: 'Collection removed' });
    } else {
        res.status(404);
        throw new Error('Collection not found');
    }
});
