// ========================================
// GeoAdTech — Auth Controller
// ========================================
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'geoadtech_secret_2026';
const JWT_EXPIRES = '30d';

const signToken = (id: string) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, city } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        const user = await User.create({ name, email, password, phone, city });
        const token = signToken(user._id.toString());

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                role: user.role,
                sitesTracked: user.sitesTracked,
                feedbackGiven: user.feedbackGiven,
                zonesEntered: user.zonesEntered,
                createdAt: user.createdAt,
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'No account found with this email.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password.' });
        }

        const token = signToken(user._id.toString());

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                role: user.role,
                sitesTracked: user.sitesTracked,
                feedbackGiven: user.feedbackGiven,
                zonesEntered: user.zonesEntered,
                createdAt: user.createdAt,
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/auth/me  (requires token)
export const getMe = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided.' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, user });
    } catch (err: any) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// PATCH /api/auth/profile  (requires token)
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided.' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const { name, phone, city } = req.body;
        const user = await User.findByIdAndUpdate(
            decoded.id,
            { name, phone, city },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({ success: true, user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/auth/stats (increment engagement stats)
export const incrementStat = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token.' });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const { stat } = req.body; // 'sitesTracked' | 'feedbackGiven' | 'zonesEntered'
        const allowed = ['sitesTracked', 'feedbackGiven', 'zonesEntered'];
        if (!allowed.includes(stat)) return res.status(400).json({ success: false, message: 'Invalid stat.' });
        const user = await User.findByIdAndUpdate(decoded.id, { $inc: { [stat]: 1 } }, { new: true });
        res.json({ success: true, user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
