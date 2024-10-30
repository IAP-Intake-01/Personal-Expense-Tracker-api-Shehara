import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import entryRoutes from './routes/entryRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables

const app = express();


app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// Define routes
app.use('/auth', auth);         // Authentication routes
app.use('/entries', entryRoutes); // Entry management routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
