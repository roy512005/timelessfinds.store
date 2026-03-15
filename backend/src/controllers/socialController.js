import asyncHandler from 'express-async-handler';
import InstagramPost from '../models/InstagramPost.js';

// @desc    Get instagram feed
// @route   GET /api/social/instagram
// @access  Public
export const getInstagramFeed = asyncHandler(async (req, res) => {
    const posts = await InstagramPost.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(posts);
});
