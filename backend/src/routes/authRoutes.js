import express from 'express';
import { registerUser, authUser, getUserProfile, logoutUser, refreshToken, phoneLogin } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// OTP Rate Limiter — max 3 OTP requests per 5 minutes per IP
// Prevents SMS bombing and brute-force token guessing (Security Audit fix)
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,   // 5 minutes
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many OTP requests. Please wait 5 minutes before trying again.',
    },
    skipSuccessfulRequests: false,
});

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/phone-login', otpLimiter, phoneLogin);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

// Kept for backward-compatibility; the true requirement is GET /api/users/me
router.route('/profile').get(protect, getUserProfile);

export default router;
