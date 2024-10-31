import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import entryRoutes from './routes/entryRoutes.js';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import cors from 'cors';
dotenv.config();

// Load environment variables
const PORT = 3000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));// front end connection
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies



app.get('/test-db', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT 1');
      res.status(200).json({ message: 'Database connection successful', rows });
  } catch (error) {
      console.error("Database connection error:", error);
      res.status(500).json({ error: 'Database connection failed' });
  }
});
// Define routes
app.use('/auth', auth);         // Authentication routes
app.use('/entries', entryRoutes); // Entry management routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//