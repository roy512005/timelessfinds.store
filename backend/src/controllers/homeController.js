import asyncHandler from 'express-async-handler';
import HeroBanner from '../models/HeroBanner.js';
import Category from '../models/Category.js';
import PromoSection from '../models/PromoSection.js';
import Creator from '../models/Creator.js';
import TopBanner from '../models/TopBanner.js';
import StoreSettings from '../models/StoreSettings.js';

// @desc    Get store settings
// @route   GET /api/home/settings
// @access  Public
export const getStoreSettings = asyncHandler(async (req, res) => {
    let settings = await StoreSettings.findOne();
    if (!settings) {
        settings = await StoreSettings.create({});
    }
    res.json(settings);
});

// @desc    Update store settings
// @route   PUT /api/home/settings
// @access  Admin
export const updateStoreSettings = asyncHandler(async (req, res) => {
    let settings = await StoreSettings.findOne();
    if (settings) {
        settings = await StoreSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
        settings = await StoreSettings.create(req.body);
    }
    res.json(settings);
});

// @desc    Get active hero banner
// @route   GET /api/home/hero
// @access  Public
export const getHeroBanner = asyncHandler(async (req, res) => {
    const banner = await HeroBanner.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json(banner || {});
});

// @desc    Get look categories
// @route   GET /api/home/look-categories
// @access  Public
export const getLookCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

// @desc    Get promo section
// @route   GET /api/home/promo
// @access  Public
export const getPromo = asyncHandler(async (req, res) => {
    const promo = await PromoSection.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json(promo || {});
});

// @desc    Get creator collab
// @route   GET /api/home/creator
// @access  Public
export const getCreator = asyncHandler(async (req, res) => {
    const creators = await Creator.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(creators);
});

// @desc    Get top banner ticker items
// @route   GET /api/home/top-banners
// @access  Public
export const getTopBanners = asyncHandler(async (req, res) => {
    const banners = await TopBanner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
});

// @desc    Create/Update top banner
// @route   POST /api/home/top-banners
// @access  Admin
export const saveTopBanner = asyncHandler(async (req, res) => {
    const { _id, text, isActive } = req.body;
    if (_id) {
        const banner = await TopBanner.findByIdAndUpdate(_id, { text, isActive }, { new: true });
        return res.json(banner);
    }
    const banner = await TopBanner.create({ text, isActive: isActive !== false });
    res.status(201).json(banner);
});

// @desc    Delete top banner item
// @route   DELETE /api/home/top-banners/:id
// @access  Admin
export const deleteTopBanner = asyncHandler(async (req, res) => {
    await TopBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner item removed' });
});
