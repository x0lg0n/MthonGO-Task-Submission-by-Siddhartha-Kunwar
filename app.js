const express = require('express');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimit.js');
const chapterRoutes = require('./routes/chapters');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/v1/chapters', chapterRoutes);
app.use('/api/v1/chapters/:id', chapterRoutes);
app.use('/api/v1/chapters/user-stats', chapterRoutes);
app.use('/api/v1/verify', authRoutes);
app.use('/api/v1/auth/login', authRoutes);


app.get('/', (req, res) => {
  res.sendFile('api-tester.html', { root: __dirname })
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});