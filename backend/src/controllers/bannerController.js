import Banner from '../models/Banner.js';

// @desc    Get all banners (admin: all, public route returns only active)
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get only active banners (public frontend)
export const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add banner
// @route   POST /api/admin/banners
export const addBanner = async (req, res) => {
    try {
        const banner = new Banner(req.body);
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
export const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
