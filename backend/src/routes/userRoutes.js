import express from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Base /api/users
router.route('/').get(protect, admin, getUsers);

// Personal profile (Customer/Staff/Admin)
router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);

router.put('/change-password', protect, changePassword);

// Addresses (Customer)
router.route('/address')
    .get(protect, getAddresses)
    .post(protect, addAddress);

router.route('/address/:id')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

// Admin specific management
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
