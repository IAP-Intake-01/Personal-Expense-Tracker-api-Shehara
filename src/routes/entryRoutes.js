import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    // You can add token validation here to ensure the user is logged in
    next();
};

// Get all entries for a user
router.get('/user/:userId', authenticateUser, async (req, res) => {
    const userId = req.params.userId;

    try {
        const [entries] = await db.query('SELECT * FROM entries WHERE user_id = ?', [userId]);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching entries' });
    }
});

// Create a new entry
router.post('/', authenticateUser, async (req, res) => {
    const { user_id, category_id, amount, description, date } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO entries (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
            [user_id, category_id, amount, description, date]
        );
        res.status(201).json({ id: result.insertId, message: 'Entry created' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating entry' });
    }
});

// Update an entry
router.put('/:id', authenticateUser, async (req, res) => {
    const entryId = req.params.id;
    const { category_id, amount, description, date } = req.body;

    try {
        await db.query(
            'UPDATE entries SET category_id = ?, amount = ?, description = ?, date = ? WHERE id = ?',
            [category_id, amount, description, date, entryId]
        );
        res.json({ message: 'Entry updated' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating entry' });
    }
});

// Delete an entry
router.delete('/:id', authenticateUser, async (req, res) => {
    const entryId = req.params.id;

    try {
        await db.query('DELETE FROM entries WHERE id = ?', [entryId]);
        res.json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting entry' });
    }
});

export default router; // Export the router
