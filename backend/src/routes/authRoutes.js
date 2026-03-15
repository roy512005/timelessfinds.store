import express from 'express';
import { registerUser, authUser, getUserProfile, logoutUser, refreshToken, phoneLogin } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/phone-login', phoneLogin);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

// Kept for backward-compatibility; the true requirement is GET /api/users/me
router.route('/profile').get(protect, getUserProfile);

export default router;
