// Update middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis'); // Fix: Import RedisStore correctly
const client = require('../config/redis');

const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
    prefix: 'rate_limit:' // Add prefix for Redis keys
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per IP
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use both IP and user ID (if available) for more precise rate limiting
    return req.user ? `${req.ip}-${req.user.id}` : req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for certain paths or conditions
    return req.path.startsWith('/public');
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: res.getHeader('Retry-After')
    });
  }
});

module.exports = rateLimiter;