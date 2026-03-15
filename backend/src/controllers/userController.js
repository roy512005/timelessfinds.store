import User from '../models/User.js';
import UserAddress from '../models/UserAddress.js';

// ---- ADMIN ROUTES ----

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---- CUSTOMER ROUTES ----

// @desc    Get user profile
// @route   GET /api/users/me
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me
export const updateMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
export const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user && (await user.matchPassword(req.body.oldPassword))) {
            user.password = req.body.newPassword; // will be hashed by pre-save middleware
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user addresses
// @route   GET /api/users/address
export const getAddresses = async (req, res) => {
    try {
        const addresses = await UserAddress.find({ user_id: req.user._id });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add user address
// @route   POST /api/users/address
export const addAddress = async (req, res) => {
    try {
        const address = new UserAddress({
            user_id: req.user._id,
            ...req.body
        });
        const createdAddress = await address.save();
        res.status(201).json(createdAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user address
// @route   PUT /api/users/address/:id
export const updateAddress = async (req, res) => {
    try {
        const address = await UserAddress.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            req.body,
            { new: true }
        );
        if (address) {
            res.json(address);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user address
// @route   DELETE /api/users/address/:id
export const deleteAddress = async (req, res) => {
    try {
        const address = await UserAddress.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        if (address) {
            res.json({ message: 'Address removed' });
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
