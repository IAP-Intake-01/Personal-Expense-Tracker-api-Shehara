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
            'SELECT * FROM user WHERE email = ? OR username = ?',
            [email, username]
        );
        if (existingUser.length) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO user (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// // Login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//
//     try {
//         // Query the user by email instead of username
//         const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
//         if (!users.length) {
//             return res.status(400).json({ error: 'Invalid credentials' });
//         }
//
//         const user = users[0]; // Correctly access the first user
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Invalid credentials' });
//         }
//
//         const accessToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
//         const refreshToken = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '90d' });
//
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: true,  // Set to true in production
//             sameSite: 'strict',
//             maxAge: 90 * 24 * 60 * 60 * 1000,  // 90 days
//         });
//
//         res.json({ accessToken });
//     } catch (error) {
//         console.error("Login error:", error); // Log the error for debugging
//         res.status(500).json({ error: 'Error logging in' });
//     }
// });


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (!users.length) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Successfully authenticated, but no tokens are generated
        res.status(200).json({ message: 'Login successful', user: { id: user.user_id, email: user.email } });
    } catch (error) {
        console.error("Login error:", error);
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
// Get All User
router.get('/user', async (req, res) => {
    try {
        const [user] = await db.query('SELECT * FROM user');
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

export default router; // Export the router
//