import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Hotel, User, Log } from './models.js';
import { requireAuth } from './middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

// --- Auth Routes ---

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if password is hashed or plain text (for backward compatibility during transition)
        const isMatch = user.password.startsWith('$2b$') || user.password.startsWith('$2a$') 
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, hotelId: user.hotelId },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userObj = user.toObject();
        delete userObj.password;

        const log = new Log({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userEmail: email,
            action: 'Login',
            details: 'User logged in successfully'
        });
        await log.save();

        res.json({ success: true, token, user: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/auth/register', async (req, res) => {
    try {
        const { hotelData, userData } = req.body;

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hotelId = `hotel-${Date.now()}`;
        const userId = `user-${Date.now()}`;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newHotel = new Hotel({
            id: hotelId,
            name: userData.companyName || 'New Hotel',
            ownerId: userId,
            website: userData.website,
            phone: userData.phone,
            details: {
                companyName: userData.companyName,
                taxId: userData.taxId,
                taxOffice: userData.taxOffice,
                checkInTime: '14:00',
                checkOutTime: '12:00',
                cancellationPolicy: 'Free cancellation up to 24h.'
            },
            rooms: [],
            reservations: [],
            settings: { currency: 'TRY', language: 'tr' },
            createdAt: new Date().toISOString()
        });

        const newUser = new User({
            id: userId,
            email: userData.email,
            password: hashedPassword,
            name: userData.companyName,
            role: 'HOTEL_MANAGER',
            hotelId: hotelId,
            creditsUsed: 0,
            creditLimit: 100
        });

        // Use transaction if using replica set, but standard save for standalone mongo
        await newHotel.save();
        try {
            await newUser.save();
        } catch (userErr) {
            // Rollback hotel if user creation fails
            await Hotel.deleteOne({ id: hotelId });
            throw userErr;
        }

        res.json({ success: true, user: { id: userId, email: newUser.email, role: newUser.role, hotelId: hotelId } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- Hotel Routes ---

router.get('/hotels/:id', requireAuth, async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ id: req.params.id });
        if (!hotel) return res.status(404).json(undefined);
        
        // Basic authorization: Only allow access if user belongs to this hotel or is MASTER_ADMIN
        if (req.user.hotelId !== req.params.id && req.user.role !== 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(hotel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/hotels/:id', requireAuth, async (req, res) => {
    try {
        // Basic authorization
        if (req.user.hotelId !== req.params.id && req.user.role !== 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const data = req.body;
        // Basic validation/whitelist: Prevent mass assignment of sensitive fields
        delete data.id; // Cannot change ID
        delete data.ownerId; // Cannot change Owner ID

        await Hotel.findOneAndUpdate({ id: req.params.id }, data, { new: true, upsert: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/hotels', requireAuth, async (req, res) => {
    try {
        if (req.user.role !== 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- User Routes ---

router.get('/users', requireAuth, async (req, res) => {
    try {
        if (req.user.role !== 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const users = await User.find({ role: { $ne: 'MASTER_ADMIN' } }, { password: 0 }); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Logs ---
router.get('/logs', requireAuth, async (req, res) => {
    try {
        const query = req.user.role === 'MASTER_ADMIN' ? {} : { userEmail: req.user.email };
        const logs = await Log.find(query).sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/logs', requireAuth, async (req, res) => {
    try {
        const newLog = new Log({
            ...req.body,
            userEmail: req.user.email // Force the userEmail to the authenticated user
        });
        await newLog.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
