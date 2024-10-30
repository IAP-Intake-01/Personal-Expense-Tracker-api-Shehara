import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;

    try {
        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        if (existingUser.length) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (!users.length) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '90d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,  // Set to true in production
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000,  // 90 days
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Refresh Token
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);  // Forbidden

        const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    });
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
});

export default router; // Export the router
//