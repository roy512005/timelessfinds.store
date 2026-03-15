import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import DeliveryBoy from '../models/DeliveryBoy.js';

const generateToken = (id, role) => {
    const expiresIn = (role === 'admin' || role === 'staff') ? '7d' : '10d';
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', { expiresIn });
};

// @desc   Protect routes — supports User, Admin and DeliveryBoy tokens
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Resolve the actor based on role in JWT
            if (decoded.role === 'delivery') {
                req.deliveryBoy = await DeliveryBoy.findById(decoded.id).select('-password');
                req.user = req.deliveryBoy; // Unified req.user for convenience
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.status(403).json({ message: 'Not authorized as admin' });
};

export const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) return next();
    res.status(403).json({ message: 'Not authorized as staff or admin' });
};

export const deliveryGuard = (req, res, next) => {
    if (req.deliveryBoy) return next();
    res.status(403).json({ message: 'Not authorized as delivery boy' });
};
