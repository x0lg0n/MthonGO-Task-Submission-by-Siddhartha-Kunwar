const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapters');
const redisClient = require('../config/redis');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/v1/chapters - Fetch all chapters with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { class: className, unit, status, weakChapters, subject, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {
      ...(className && { class: className }),
      ...(unit && { unit }),
      ...(status && { status }),
      ...(weakChapters && { weakChapters: weakChapters === 'true' }),
      ...(subject && { subject })
    };

    const cacheKey = `chapters:${JSON.stringify(req.query)}`;
    
    // Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Query MongoDB with pagination
    const [total, chapters] = await Promise.all([
      Chapter.countDocuments(query),
      Chapter.find(query)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
    ]);

    const response = {
      total,
      page: Number(page),
      limit: Number(limit),
      chapters,
    };

    // Cache the result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));
    res.json(response);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// GET /api/v1/chapters/:id - Fetch a specific chapter
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).lean();
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// POST /api/v1/chapters - Upload chapters (admin only)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let chaptersData;
    try {
      chaptersData = JSON.parse(req.file.buffer.toString());
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    if (!Array.isArray(chaptersData)) {
      return res.status(400).json({ error: 'Data must be an array of chapters' });
    }

    const failedChapters = [];
    const validChapters = [];

    // Validate each chapter
    for (const chapter of chaptersData) {
      try {
        const newChapter = new Chapter(chapter);
        await newChapter.validate();
        validChapters.push(newChapter);
      } catch (error) {
        failedChapters.push({ 
          chapter, 
          error: error.message 
        });
      }
    }

    // Save valid chapters
    if (validChapters.length > 0) {
      await Chapter.insertMany(validChapters, { ordered: false });
      // Invalidate cache
      await redisClient.del('chapters:*');
    }

    res.json({
      success: true,
      message: 'Chapters processed',
      uploaded: validChapters.length,
      failed: failedChapters,
    });
  } catch (error) {
    console.error('Error uploading chapters:', error);
    res.status(500).json({ error: 'Failed to process chapters' });
  }
});

module.exports = router;