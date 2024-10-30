import pool from '../config/db.js';

// Get all entries for a specific user
export const getEntries = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM entry WHERE user_id = ?',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching entries' });
    }
};

// Get a specific entry by its ID
export const getEntryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM entry WHERE id = ?',
            [id]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching entry' });
    }
};

// Create a new entry
export const createEntry = async (req, res) => {
    const { user_id, category_id, amount, description, date } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO entry (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
            [user_id, category_id, amount, description, date]
        );
        res.status(201).json({ id: result.insertId, message: 'Entry created' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating entry' });
    }
};

// Update an entry
export const updateEntry = async (req, res) => {
    const { id } = req.params;
    const { category_id, amount, description, date } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE entry SET category_id = ?, amount = ?, description = ?, date = ? WHERE id = ?',
            [category_id, amount, description, date, id]
        );
        if (result.affectedRows > 0) {
            res.json({ message: 'Entry updated' });
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating entry' });
    }
};

// Delete an entry
export const deleteEntry = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM entry WHERE id = ?',
            [id]
        );
        if (result.affectedRows > 0) {
            res.json({ message: 'Entry deleted' });
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting entry' });
    }
};
