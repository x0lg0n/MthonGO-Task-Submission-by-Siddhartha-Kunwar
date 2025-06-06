const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and generate JWT token
 * @access  Public
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // For demonstration purposes only
  // In a real application, you would validate against a database
  if (username === 'admin' && password === 'password') {
    // Create payload for JWT
    const payload = {
      id: 1,
      username: 'admin',
      role: 'admin'
    };

    // Generate JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token: token
        });
      }
    );
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify JWT token
 * @access  Private (requires JWT token)
 */
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
});

module.exports = router;