const express = require('express');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimit.js');
const chapterRoutes = require('./routes/chapters');
require('dotenv').config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/v1/chapters', chapterRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});