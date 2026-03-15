import User from '../models/User.js';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const roleFilter = req.query.role ? { role: req.query.role } : {};
        const users = await User.find(roleFilter).select('-password').sort({ createdAt: -1 });
        res.json({ users, total: users.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user (block / change role)
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.status !== undefined) user.status = req.body.status;
        if (req.body.role !== undefined) user.role = req.body.role;
        if (req.body.name !== undefined) user.name = req.body.name;

        const updated = await user.save();
        res.json({ user: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
