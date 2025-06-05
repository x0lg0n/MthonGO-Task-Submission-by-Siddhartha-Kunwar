const { createClient } = require('redis');
require('dotenv').config();

// Create Redis client with configuration
const client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    },
    retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout
            return new Error('Retry time exhausted');
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

// Error handling
client.on('error', err => {
    console.error('Redis Client Error:', err);
});

// Connection handling
client.on('connect', () => {
    console.log('Connected to Redis successfully');
});

// Initialize connection
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1);
    }
})();

module.exports = client;
